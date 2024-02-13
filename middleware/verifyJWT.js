
const jwt = require('jsonwebtoken');

const verifyJWT = async (req, res, next) => {
    console.log('start verify jwt');
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ 'message': 'you header auth is empty' });
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(401).json({ err });
            console.log('decoded', decoded.UserInfo);
            req.username = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    )
};

module.exports = verifyJWT;