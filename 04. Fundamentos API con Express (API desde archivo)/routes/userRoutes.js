//Modulos
const express = require('express');
const userController = require('./../controllers/userController');

// Router
const router = express.Router();

//Route Resources: Users
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
