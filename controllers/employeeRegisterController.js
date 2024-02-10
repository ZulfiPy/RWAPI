const Employee = require('../model/Employee');
const bcrypt = require('bcrypt');

const createEmployee = async (req, res) => {
    const requiredFields = ['username', 'password', 'firstname', 'lastname', 'birthDate'];

    for (let field of requiredFields) {
        if (!req?.body?.[field]) {
            return res.status(400).json({ 'message': `${field} field is missing` });
        }
    }

    const duplicatedUser = await Employee.findOne({ username: req.body.username }).exec();
    if (duplicatedUser) return res.status(409).json({ 'message': `username ${req.body.username} exists in the database, please select other username` });

    const { username, firstname, lastname, birthDate } = req.body;

    try {
        const hashedPwd = await bcrypt.hash(req.body.password, 10);
        const newEmployee = await Employee.create({
            username,
            password: hashedPwd,
            firstname,
            lastname,
            birthDate
        });

        return res.json(newEmployee)
    } catch (err) {
        return res.status(500).message({ 'message': 'internal server error' });
    }
}

module.exports = {
    createEmployee
}