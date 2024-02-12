const express = require('express');
const router = express.Router();

const customersController = require('../../controllers/customersController');

router.route('/')
    .get(customersController.getCustomers)
    .post(customersController.createCustomer)
    .put(customersController.updateCustomer)
    .delete(customersController.deleteCustomer)

router.route('/:id')
    .get(customersController.getCustomer)
    .put(customersController.updateCustomer)
    .delete(customersController.deleteCustomer)

module.exports = router;