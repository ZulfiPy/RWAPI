const Employee = require('../model/Employee');

const handleLogout = async (req, res) => {
    console.log('logout started')
    const cookies = req?.cookies;
    console.log('cookies in logout', cookies)
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    const foundEmployee = await Employee.findOne({ refreshTokens: refreshToken }).exec();
    if (!foundEmployee) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.status(204).json({ 'message': 'employee not found by provided jwt cookie' });
    }

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    
    foundEmployee.refreshTokens = foundEmployee.refreshTokens.filter(rt => rt !== refreshToken);
    const result = await foundEmployee.save();

    console.log('result', result)

    return res.json({ cookies : req?.cookies })
}

module.exports = {
    handleLogout
}