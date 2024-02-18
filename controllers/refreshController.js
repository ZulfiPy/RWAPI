const Employee = require('../model/Employee');
const jwt = require('jsonwebtoken');

const handleRefresh = async (req, res) => {
    const cookies = req?.cookies;
    console.log('cookies at refresh', JSON.stringify(req?.cookies));
    if (!cookies?.jwt) return res.status(403).json({ 'message': 'there is jwt token stored in your cookies' });

    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    const foundEmployee = await Employee.findOne({ refreshTokens: refreshToken }).exec();

    if (!foundEmployee) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.status(401);

                // token valid, but clear out from the database
                const hackedEmployee = await Employee.findOne({ username: decoded.username }).exec();
                hackedEmployee.refreshTokens = [];
                const result = await hackedEmployee.save();
                console.log('hackedEmployee', result);
            }
        )
        return res.sendStatus(403);
    }

    const refreshTokenArray = foundEmployee.refreshTokens.filter(rt => rt !== refreshToken);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                foundEmployee.refreshTokens = refreshTokenArray;
                const result = await foundEmployee.save();
                console.log('result', result);
            }

            if (err || foundEmployee.username !== decoded.username) return res.sendStatus(403);

            const roles = Object.values(foundEmployee.roles).filter(Boolean);

            const newAccessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundEmployee.username,
                        roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "5m" }
            );

            const newRefreshToken = jwt.sign(
                { "username": foundEmployee.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "1h" }
            );

            foundEmployee.refreshTokens = [...refreshTokenArray, newRefreshToken];
            const result = await foundEmployee.save();
            console.log('refresh update is done', result);

            res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', secure: true });

            return res.json({ 'accessToken': newAccessToken });
        }
    )
}

module.exports = {
    handleRefresh
}