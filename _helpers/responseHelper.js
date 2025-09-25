/**
 * @param {Object} res
 * @param {Number} status
 * @param {String} message
 * @param {String | Object} data
 * @param {String} err
 */

function sendResponse(
    res,
    status,
    message,
    data,
    err
){
    if(err){
        res.status(status).json({
            status: status,
            message:message
        })
    }else{
        res.status(status).json({
            status:status,
            message:message,
            data:data
        })
    }
}

module.exports={
    sendResponse
}