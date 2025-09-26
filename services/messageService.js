const {getDatabase,ObjectId} = require ('../_helpers/db')

async function messeging(req,res){

    try{
        const {userId,otherId} = req.params;
        const db = getDatabase()

        const chat = await db.collection('messages').find({
            $or:[
                {senderId:userId ,receiverId:otherId},
                {senderId:otherId,receiverId:userId}
            ]
        }).sort({createdAt:1})
        .toArray()
        return{
            status:true,
            msg:"success chat",
            data:chat
        }
    }catch(error){
        console.log("unabele to fetch message")
        return{
            status:false,
            msg:error.message
        }
    }

}

module.exports = {messeging}