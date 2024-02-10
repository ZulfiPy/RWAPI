const express = require('express');
const router = express.Router()

const employeeRegisterController = require('../controllers/employeeRegisterController');

router.route('/')
    .post(employeeRegisterController.createEmployee);

module.exports = router;