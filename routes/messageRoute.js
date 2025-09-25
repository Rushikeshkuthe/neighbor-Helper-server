const express = require ('express')
const router =  express.Router();
const messageController =  require ('../controller/messageController')


router.get('/messages/:userId/:otherId', messageController.messageController)

module.exports = router