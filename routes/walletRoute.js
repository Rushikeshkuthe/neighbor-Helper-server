const express =  require('express')
const router = express.Router()
const walletController = require ('../controller/walletController')


router.get('/getWalletById/:userId',walletController.getwalletbyId)
router.put('/makePayment',walletController.makePayment)

module.exports = router