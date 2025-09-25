const {sendResponse} =  require('../_helpers/responseHelper')
const authService = require('../services/userservices')
const httpStatus = require("http-status")


async function registerUser(req,res){
    const user =  await authService.register(req);
    if(user.status){
        sendResponse(res,httpStatus.CREATED,user.msg,user.data,null)
    }else{
        sendResponse(res,httpStatus.BAD_REQUEST,user.msg,null,null)
    }
}



async function loginUser(req,res){
    const user = await authService.login(req)
    if(user.status){
        sendResponse(res,httpStatus.OK,user.msg,user.data,null)
    }else{
        sendResponse(res,httpStatus.BAD_REQUEST,user.msg,null,null)
    }
}

async function update(req,res){
    const user = await authService.update(req)
    if(user.status){
        sendResponse(res,httpStatus.OK,user.msg,user.data,null)
    }else{
        sendResponse(res,httpStatus.BAD_REQUEST,user.msg,null,null)
    }
}

async function deleteUser(req,res){
    const deleteUser =  await authService.deleteUser(req)
    if(deleteUser.status){
        sendResponse(res,httpStatus.OK,deleteUser.msg,null,null)
    }else{
        sendResponse(res,httpStatus.BAD_REQUEST,deleteUser.msg,null,null)
    }
}

async function getaAllUser(req,res){
    const user = await authService.getAllUser()
    if(user.status){
        sendResponse(res,httpStatus.OK,user.msg,user.data,null)
    }else{
        sendResponse(res,httpStatus.BAD_REQUEST,user.msg,null,null)
    }
}

module.exports={registerUser ,loginUser,update,deleteUser,getaAllUser}