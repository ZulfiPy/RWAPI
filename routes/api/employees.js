const express = require('express');
const router = express.Router();
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

const employeesController = require('../../controllers/employeesController');

router.route('/')
    .get(verifyRoles([ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin]), employeesController.getEmployees)

router.route('/:id')
    .get(verifyRoles([ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin]), employeesController.getEmployee)
    .delete(verifyRoles([ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin]), employeesController.deleteEmployee)

module.exports = router;