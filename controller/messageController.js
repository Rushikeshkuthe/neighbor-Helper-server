const httpStatus = require('http-status')
const {sendResponse} = require ('../_helpers/responseHelper')
const msgService = require ('../services/messageService')


async function messageController(req,res){

    const chat = await msgService.messeging(req)
    if(chat.status){
        sendResponse(res,httpStatus.OK,chat.msg,chat.data,null)
    }else{
        sendResponse(res,httpStatus.BAD_REQUEST,chat.msg,null,null)
    }

}
module.exports = {messageController}