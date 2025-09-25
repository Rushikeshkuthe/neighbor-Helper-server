const jwt = require('jsonwebtoken');
const { getDatabase, ObjectId } = require('../_helpers/db');

async function authMiddleware(req,res,next){
    try{
        const token= req.headers["authorization"]?.split(" ")[1];
        if(!token){
            return{
                status:false,
                msg:"Token Missing"
            }
        }
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
           const db = await getDatabase();
           const userId = new ObjectId(decoded._id);
           const user = await db.collection('users').findOne({userId})
           req.user = user
           req.userId = decoded._id
            next();
        

    }catch(error){
        return{
            status:false,
            msg:"Invalid Token"
        }
    }
}

module.exports= authMiddleware