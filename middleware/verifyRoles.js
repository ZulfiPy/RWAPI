const verifyRoles = (allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.status(401).json({ 'message': 'you do not have any roles' });
        const found = req.roles.some(role => allowedRoles.includes(role));
        if (!found) return res.status(401).json({ 'message': 'you do not have allowed role to access this api endpoint' });
        next();
    }
}

module.exports = verifyRoles;