const { sendResponse } = require("../_helpers/responseHelper")
const httpStatus = require('http-status')
const walletService = require("../services/walletServices")


async function getwalletbyId(req, res) {
    const wallet = await walletService.getWalletByUserId(req)
    if (wallet.status) {
        sendResponse(res, httpStatus.OK, wallet.msg, wallet.data, null)
    }
    else {
        sendResponse(res, httpStatus.BAD_REQUEST, wallet.msg, null, null)
    }
}

async function makePayment(req, res) {
    const wallet = await walletService.makepayment(req)
    if (wallet.status) {
        sendResponse(res, httpStatus.OK, wallet.msg, wallet.data, null)
    } else {
        sendResponse(res, httpStatus.BAD_REQUEST, wallet.msg, null, null)
    }
}


module.exports = { getwalletbyId, makePayment }