const express = require('express');
const router = express.Router();
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

const customersController = require('../../controllers/customersController');

router.route('/')
    .get(verifyRoles([ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin]),customersController.getCustomers)
    .post(verifyRoles([ROLES_LIST.Editor, ROLES_LIST.Admin]), customersController.createCustomer)
    .put(verifyRoles([ROLES_LIST.Editor, ROLES_LIST.Admin]), customersController.updateCustomer)
    .delete(verifyRoles([ROLES_LIST.Admin]), customersController.deleteCustomer)

router.route('/:id')
    .get(verifyRoles([ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin]), customersController.getCustomer)
    .put(verifyRoles([ROLES_LIST.Editor, ROLES_LIST.Admin]), customersController.updateCustomer)
    .delete(verifyRoles([ROLES_LIST.Admin]), customersController.deleteCustomer)

module.exports = router;