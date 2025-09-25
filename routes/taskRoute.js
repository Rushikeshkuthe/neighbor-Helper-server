const express =require('express')
const router = express.Router();
const taskController = require('../controller/taskController')
const authmiddleware = require ('../middlewares/authmiddleware')


router.post("/createTask",taskController.taskCreate)
router.get('/getallTask',taskController.getAllTask)
router.get('/getTaskById/:id',taskController.getTaskById)

module.exports = router