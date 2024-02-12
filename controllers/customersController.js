const Customer = require('../model/Customer');

const getCustomers = async (req, res) => {
    const customers = await Customer.find();

    if (customers.length < 1) return res.status(404).json({ 'message': 'customers not found in the database' });

    return res.json(customers);
}

const getCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await Customer.findOne({ _id: id }).exec();
        if (!customer) return res.status(404).json({ 'message': 'customer not found by provided id in the database' });

        return res.json(customer);
    } catch (err) {
        return res.status(500).json({ 'message': 'internal server error' });
    }
}

const createCustomer = async (req, res) => {
    const requiredFields = ['firstname', 'lastname', 'isikukood', 'driverLicenseNumber', 'address', 'email', 'phone'];

    if (!req?.body) return res.status(400).json({ 'message': 'empty request' });

    for (let field of requiredFields) {
        if (!req.body?.[field]) {
            return res.status(400).json({ 'message': `${field} field is empty` });
        }
    }

    const { firstname, lastname, isikukood, driverLicenseNumber, address, email, phone } = req.body;

    try {
        const newCustomer = await Customer.create({
            firstname,
            lastname,
            isikukood,
            driverLicenseNumber,
            address,
            email,
            phone,
            vehicle: req.body?.vehicle ? req.body.vehicle : ""
        });

        return res.json(newCustomer);
    } catch (err) {
        return res.status(500).json({ 'message': 'internal server error' });
    }
}

const updateCustomer = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ 'message': 'no customer id provided for further update' });

    if (Object.values(req?.body).every(val => val === '')) return res.status(400).json({ 'message': 'empty request' });

    try {
        const foundCustomer = await Customer.findOne({ _id: id }).exec();

        if (!foundCustomer) return res.status(404).json({ 'message': 'customer not found by the provided id for furthe update' });

        for (let key of Object.keys(req.body)){
            if (req.body?.[key]) {
                foundCustomer[key] = req.body[key];
            }
        }
        const result = await foundCustomer.save();
        console.log(result);
        return res.json({ 'updated customer': result});
    } catch (err) {
        return res.status(500).json({ 'message': 'internal server error' });
    }
}

const deleteCustomer = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ 'message': 'no customer id provided for further deletion' });

    try {
        const foundCustomer = await Customer.findOne({ _id: id }).exec();
        if (!foundCustomer) return res.status(404).json({ 'message': 'customer not found by the provided id for further deletion' });

        await Customer.deleteOne({ _id: id });

        return res.json({ 'message': `driver with id ${id} deleted` });
    } catch (err) {
        return res.status(500).json({ 'message': 'internal server error' });
    }
}

module.exports = {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer
}