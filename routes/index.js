const express = require('express')
const authRoute = require('../routes/authRoute')
const walletRoute = require('../routes/walletRoute')
const taskRoute = require('../routes/taskRoute')
const messageRoute =  require('../routes/messageRoute')

const router = express.Router();


const defaultRoutes =[
    {
        path:"/auth",
        route:authRoute
    },
    {
        path:"/wallet",
        route:walletRoute
    },
    {
        path:'/task',
        route:taskRoute
    },

]

defaultRoutes.forEach((route)=>{
    router.use(route.path,route.route)
})


module.exports = router