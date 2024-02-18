const Employee = require('../model/Employee');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const cookies = req?.cookies;
    console.log('cookies at login', JSON.stringify(cookies));

    const { username, password } = req?.body;
    if (!username || !password) return res.status(400).json({ 'message': 'some of data missing' });

    const foundEmployee = await Employee.findOne({ username }).exec();
    if (!foundEmployee) return res.status(401).json({ 'message': 'user with the provided username does not exist. register please.' });

    const match = await bcrypt.compare(password, foundEmployee.password);

    if (match) {
        const roles = Object.values(foundEmployee.roles).filter(Boolean);
    
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundEmployee.username,
                    roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '5m' }
        );

        const refreshToken = jwt.sign(
            {
                "username": foundEmployee.username
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1h" }
        );

        let refreshTokenArray = 
            !cookies?.jwt
                ? foundEmployee.refreshTokens
                : foundEmployee.refreshTokens.filter(rt => rt !== cookies.jwt);
        console.log('refreshTokenArray', refreshTokenArray);

        if (cookies?.jwt) {
            const refreshToken = cookies.jwt;
            const foundToken = await Employee.findOne({ refreshTokens: refreshToken }).exec();
            if (!foundToken) {
                refreshTokenArray = [];
            }
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        }
        
        foundEmployee.refreshTokens = [...refreshTokenArray, refreshToken];
        const result = await foundEmployee.save();
        console.log(result);

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        
        return res.json({accessToken});
    } else {
        return res.status(401).json({ 'message': 'provided password does not match the password associated with the user' });
    }
}

module.exports = { 
    handleLogin 
}