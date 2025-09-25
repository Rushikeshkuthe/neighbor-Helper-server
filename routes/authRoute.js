const express = require ('express')
const path = require('path')
const router = express.Router();
const authController = require('../controller/userController')

router.post("/register",authController.registerUser)
router.post("/login",authController.loginUser)
router.put("/update/:id",authController.update)
router.delete("/deleteUser/:id",authController.deleteUser)
router.get('/getalluser',authController.getaAllUser)

module.exports = router;