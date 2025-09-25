const express = require('express')
const jwt = require('jsonwebtoken')
const {ObjectId} = require('mongodb')
const { getDatabase } = require('../_helpers/db');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const genrateWalletAddress = require('../utils/randomwalletaddress');


async function register(req, res) {

    try {
        const { username, email, password } = req.body;
        if (!email) {
            console.log("Email required")
            return {
                status: false,
                msg: "Email required"
            }
        }
        if (!username) {
            console.log("username Required")
            return {
                status: false,
                msg: "Username required"
            }
        }
        if (!password) {
            console.log("password required")
            return {
                status: false,
                msg: "password required"
            }
        }

        const isExist = await getDatabase().collection("users").findOne({
            email
        })
        if (isExist) {
            return {
                status: false,
                msg: "Email Already registered"
            }
        }

        const hashedPassword = await hashPassword(password)

        const response = await getDatabase().collection("users").insertOne({
            username,
            email,
            password: hashedPassword,
            
        })

        const userId =  response.insertedId;

        const walletAddress = genrateWalletAddress();
        const wallet = await getDatabase().collection('wallet').insertOne({
            userId:userId,
            address:walletAddress,
            balance:100,
        })

            const walletId =  wallet.insertedId
        await getDatabase().collection('transaction').insertOne({
            walletId:walletId,
            type:'credit',
            amount:100,
            description:'wallet created',
            txnDate:new Date(),
        })

        return {
            status: true,
            msg: "user registered successfully",
            data: {
                userId: response.insertedId,
                username,
                email,
                walletAddress
            }
        }

    } catch (error) {
        console.log(error)
        return {
            status: false,
            msg: error.message
        }
    }
}

async function login(req){
    const {email,password }= req.body;

    if(!email){
        return{
            status:false,
            msg:"Email required"
        }
    }

    if(!password){
        return{
            status:false,
            msg:'Password Required'
        }
    }

    try{

        const response = await getDatabase().collection("users").findOne({email})

        if(!response){
            return{
                status:false,
                msg:'Email is Not Registered'
            }
        }

        const passwordsMatch =  await comparePassword(password,response.password);
        if(!passwordsMatch){
            return{
                status:false,
                msg:"Password is Incorrect"
            }
        }

        const token = jwt.sign(
            {
                _id:response._id,
                name:response.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn:'30d'
            }
        )

        return{
            status:true,
            msg:"Logged in successfully",
            data:{...response, accessToken:token}
        }

    }catch(error){
        console.log(error);
        return{
            status:false,
            msg:error.message
        }
    }

}


async function update(req) {
   try{

    const userId = req.params.id;
    if(!ObjectId.isValid(userId)){
        return{
            status:false,
            msg:"Incalid user Id"
        }
    }

    const {email,username,password}=req.body;

    const update={}
    if(username) update.username = username
    if(email) update.email = email
    if(password) update.password = await hashPassword(password)

    const response = await getDatabase().collection("users").findOne(
        {_id:new ObjectId(userId)}
    )


    if(response){
        await getDatabase().collection('users').updateOne(
            {_id:new ObjectId(userId)},
            {$set:update}
        )
    }else{
        return{
            status:false,
            msg:"User Not Found"
        }
    }
    const updateuser =  await getDatabase().collection('users').findOne(
        {_id:new ObjectId(userId)}
    )

    const token = jwt.sign(
        {
            _id:updateuser._id,
            name:updateuser.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn:'30d'
        }
    )

    return{
        status:true,
        msg:"User updated successfully",
        data:{...updateuser,token}
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

async function deleteUser(req){
    try{
        const userId = req.params.id;
        if(!ObjectId.isValid(userId)){
            return {
                status:false,
                msg:"Invalid User Id"
            }
        }

        const user = await getDatabase().collection("users").findOne({
            _id:new ObjectId (userId)
        })


        if(!user){
            return{
                status:false,
                msg:"User not found"
            }
        }

        const deleteResult = await getDatabase().collection('users').deleteOne({
            _id:new ObjectId (userId)
        })

        if(deleteResult.deletedCount === 1){
            return{
                status:true,
                msg:'user deleted sucessfully'
            }
        }else{
            return{
                status:false,
                msg:"failed to delete user"
            }
        }

    }catch(error){
        console.log(error)
        return{
            status:false,
            msg:error.message
        }
    }
}

 async function getAllUser(req,res){
    try{

        const user = await getDatabase().collection('users').find({}).toArray()

        return{
            status:true,
            msg:"User retived successfully",
            data:user
        }

    }catch(error){
        console.log(error)
        return{
            status:false,
            msg:error.message

        }
    }
 }

module.exports = {register , login , update , deleteUser,getAllUser}