const mongoose = require("mongoose")
const chatModel = require('../Models/Chatmodel');
const messageModel = require('../Models/MessageModel');
const userModel = require('../Models/userModel');

const connectDB = async()=>{
    try{
         const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
           
         });
         console.log(`MongoDB Connected:${conn.connection.best}`);
    }catch(error){
        console.log(`Error:${error.message}`);
        process.exit();
    }
};

module.exports = connectDB;