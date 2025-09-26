const express =  require('express')
const {getDatabase,ObjectId}  = require('../_helpers/db')
const jwt = require ('jsonwebtoken')



async function createTask(req,res){

    try{
    const{title,description,reward,address,location} = req.body;

    if(!title){
        return{
            status:false,
            msg:"Title required"
        }
    }

    if(!description){
        return{
            status:false,
            msg:"Description Required"
        }
    }

    if(!reward){
        return{
            status:false,
            msg:'Reward Required'
        }
    }
    if(!location){
        return{
            status:false,
            msg:'Location required Required'
        }
    }
     if(!address){
        return{
            status:false,
            msg:'Location required Required'
        }
    }
    


    const authHeader = req.headers["authorization"]
    if(!authHeader){
        return{
            status:false,
            msg:"Auth token missing"
        }
    }

    const token = authHeader?.split(' ')[1]

    const decoded= jwt.verify(token,process.env.JWT_SECRET)
    const userId = decoded._id
    const username = decoded.name
    console.log(decoded)

     await getDatabase().collection('task').insertOne({
        title,
        description,
        reward,
        userId:new ObjectId (userId),
        username:username,
        location:location,
        address:address,
        acceptedUserId:null,
        status:null,
        createdAt:new Date()
    })
    
    return{
        status:true,
        msg:'Task been uploaded',
        data:{
            title,
            description,
            reward,
            location,
            address,
           username
        }
    }
}catch(error)
    {
        console.log(error)
        return{
            status:false,
            msg:error.message
        }
    }


}

async function getAllTask(req,res){
    try{

       const task= await getDatabase().collection('task').find({}).toArray()

        return{
            status:true,
            msg:"sucessfull task retrive",
            data:task
        }


    }catch(error){
        return{
            status:false,
            msg:"Failed to retrive task data"
        }
    }
}

async function getTaskId(req){
    const {id} = req.params

    if(!ObjectId.isValid(id)){
        return{
            status:false,
            msg:"Task not found"
        }
    }

    const task = await getDatabase().collection("task").findOne({
        _id:new ObjectId(id)
    })

    if(!task){
        return{
            status:false,
            msg:'Task not found'
        }
    }

    return{
    status:true,
    msg:"Task retrieved successfully",
    data:task
    }
}

async function acceptedTask(req,res){
   
    try{
        const taskId = req.params.id
        const {acceptUserId} = req.body
        const db= getDatabase()

        const task = await db.collection('task').findOne({
            _id:new ObjectId (taskId)
        })

        if(!task){
            return{
                status:false,
                msg:"Task not found"
            }
        }
        if(task.accepted){
            return{
                status:false,
                msg:"Task already accepted"
            }
        }

        const updatedTask= await db.collection('task').updateOne(
            {_id:new ObjectId(taskId)},
            {
                $set:{
                    acceptedUserId:new ObjectId(acceptUserId),
                    status:'pending'
                }
            }
        )
        return{
            status:true,
            data:updatedTask,
            msg:'Task accepted successfully'
        }

    }catch(error){
        console.log(error)
        return{
            status:false
        }
    }
  
}

 async function getTaskbyAccepterId(req){
    try{
        const {acceptUserId} = req.params
        const db = getDatabase();
        const tasks = await db.collection('task').find({acceptedUserId:new ObjectId(acceptUserId)}).toArray()
        return{
            status:true,
            msg:"Task retrieved successfully",
            data:tasks
        }

    }catch(error){
        console.log(error)
        return{
            status:false,
            msg:error.message
        }
    }
 }

module.exports={createTask,getAllTask,getTaskId,acceptedTask,getTaskbyAccepterId}