const {getDatabase,ObjectId} =  require ('../_helpers/db')

async function getWalletByUserId(req){

try{

    const {userId} = req.params


    if(!ObjectId.isValid(userId)){
        return{
            status:false,
            msg:"User not found"
        }
    }
    const wallet = await getDatabase().collection('wallet').findOne({
        userId:new ObjectId(userId)
    })

    const transaction = await getDatabase().collection('transaction').find({walletId:wallet._id}).toArray()
    if(!wallet){
        return{
            status:false,
            msg:"No wallet found"
        }
    }
    
    return{
    status:true,
    msg:'Wallet fetched successfuly',
    data:{
        wallet,
        transaction
    }
}
}catch(error){
    return{
        status:false,
        msg:error.message
    }
}


}

module.exports= {getWalletByUserId}