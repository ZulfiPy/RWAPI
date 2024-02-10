const express = require('express');
const router = express.Router();

const employeesController = require('../../controllers/employeesController');

router.route('/')
    .get(employeesController.getEmployees)

router.route('/:id')
    .get(employeesController.getEmployee)
    .delete(employeesController.deleteEmployee)

module.exports = router;