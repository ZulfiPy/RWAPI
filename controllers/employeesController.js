const Employee = require('../model/Employee');
const getEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const foundEmployee = await Employee.findOne({ _id: id }).exec();

        if (!foundEmployee) return res.status(404).json({ 'message': `driver not found by privided id ${id}` });

        return res.json(foundEmployee);
    } catch (err) {
        return res.status(500).json({ 'message': 'internal server error' });
    }
}

const getEmployees = async (req, res) => {
    const employees = await Employee.find();

    if (employees.length < 1) return res.status(404).json({ 'message': 'there is not any employee in the database' });

    return res.json(employees);
}

const deleteEmployee = async (req, res) => {
    // destruct the id
    const { id } = req.params;
    // id isn't provided in API endpoint
    if (!id) return res.status(400).json({ 'message': 'provide a full API endpoint with employee id for further deletion' });

    try {
        // find employee and check if it exists
        const findEmployeeToDelete = await Employee.findOne({ _id: id }).exec();
        if (!findEmployeeToDelete) return res.status(404).json({ 'message': `employee not found by the id ${id}` });

        // delete employee
        await Employee.deleteOne({ _id: id });

        return res.json({ 'message': "employee successfully deleted" });
    } catch (err) {
        return res.status(500).json({ 'message': 'internal server error' });
    }
};

module.exports = {
    getEmployee,
    getEmployees,
    deleteEmployee
}