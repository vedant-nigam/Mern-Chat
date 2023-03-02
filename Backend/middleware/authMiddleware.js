 const jwt = require("jsonwebtoken")

 const user = require("../Models/userModel")
 const chatModel = require('../Models/Chatmodel');
const messageModel = require('../Models/MessageModel');
 const asynchandler = require("express-async-handler");

 const protect = asynchandler(async(req,res,next) => {
    let token;
if(
    req.header.authorization &&
    req.header.authorization.startsWith("Bearer")
    //bearer
){
    try{
        token = req.header.authorization.split("")[1];

        //decodes token id
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        req.user = await user.findById(decoded.id).select("-password");

        next();

    } catch(error){
        res.status(401);
        throw new Error(" not authorized ,token failde");

    }
}

if (!token){
    res.status(401);
    throw new error("not authorized , no token")
}

 })