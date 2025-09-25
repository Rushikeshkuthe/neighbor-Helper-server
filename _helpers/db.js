const {MongoClient} = require ('mongodb')
const {ObjectId} =require('mongodb')
require('dotenv').config();
const url = process.env.MONGODB_URI
const dbname = process.env.DBNAME

let client;
let database=null;

async function connectToDatabase(){
    if(!database){
        try{
            client = new MongoClient(url)
            await client.connect();
            console.log("Database has been Connected")
            database= client.db(dbname)
        }catch(err){
            console.log('Error in connecting database')
            throw err;
        }
    }

    return database;
}

function closeDatabaseConnection(){
    if(client){
  client.close
  console.log("Close the database connection")
    }
}

function getDatabase(){
    if(!database){
        throw new Error("Database not initalized, Call connection to database firse")
    }return database
}


module.exports={
    connectToDatabase,closeDatabaseConnection,getDatabase,ObjectId
}