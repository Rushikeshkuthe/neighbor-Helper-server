const httpStatus = require('http-status')
const {sendResponse} =require ('../_helpers/responseHelper')
const taskService = require('../services/taskServices')



async function taskCreate (req,res){
    const task = await taskService.createTask(req)
    if(task.status){
        sendResponse(res,httpStatus.CREATED,task.msg,task.data,null)
    } else {
        sendResponse(res,httpStatus.BAD_REQUEST,task.msg,null,null)
    }
}

async function getAllTask(req,res){
    const task = await taskService.getAllTask();
    if(task.status){
        sendResponse(res,httpStatus.OK,task.msg,task.data,null)
    }
    else{
        sendResponse(res,httpStatus.BAD_REQUEST,task.msg,null,null)
    }
}

async function getTaskById(req,res){
    const task = await taskService.getTaskId(req)
        if(task.status){
            sendResponse(res,httpStatus.OK,task.msg,task.data,null)
        }else{
            sendResponse(res,httpStatus.BAD_REQUEST,task.msg,null,null)
        }
}
module.exports = {taskCreate,getAllTask,getTaskById}