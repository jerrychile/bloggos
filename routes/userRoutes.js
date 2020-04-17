const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');

const router = express.Router();

router.route('/signup').post(authController.signup);
//router.post('/login', authController.login);
router.route('/login').post(authController.login);


router.route('/logout').get(authController.logout);
router.route('/').get(userController.getAllUsers);
//router.route('/:id').delete(userController.deleteUser).patch(userController.updateUser).get(userController.getUser);

module.exports = router;