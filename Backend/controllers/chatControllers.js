const asynchandler = require("express-async-handler");
const { Error } = require("mongoose");

const chat = require("../Models/Chatmodel");
const user = require("../Models/userModel");
const messageModel = require('../Models/MessageModel');

const accessChat = asynchandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("userId params not sent me request");
    return res.sendStatus(400);
  }

  var isChat = await chat
    .find({
      isGroupChat: false,
      $and: [
        {
          user: {
            $elemMatch: { $eq: req.user._id },
          },
        },
        { user: { $elemMatch: { $eq: userId } } },
      ],
    })
    .populate("user", "-password")
    .populate("latestMessage");

  isChat = awaituser.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      user: [req.user._id, userId],
    };

    try {
      const createChat = await chat.create(chatData);

      const Fullchat = await chat
        .findOne({ _id: createChat._id })
        .populate("users", "-password");

      res.status(201).send(Fullchat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchchats = asynchandler(async (res, req) => {
  // fetchchat fun is for fetching data from  server and to sort old with new msg
  try {
    chat
      .find({ user: { $elemMatch: { $eq: req.user._id } } })
      .populate("user", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {

        results = await user.populate(results,{
            path:"latestMessage.sender",
            select:"name pic email",
        });
       res.status(200).send(results)
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupchat = asynchandler(async(res,req)=>

{
   if (!req.body.user||!req.body.name){
    return res.status(400).send({message:"please fill all the feilds"})
   }

   var users = JSON.parse(req.body.users);

   if(user.lenth<2){
    return res
    .status(400)
    .send("more than 2 users are required for the group chat")
   }

   user.push(req.user);

   try{
    const groupChat = await chat.create({
        chatName:req.body.name,
        users:users,
        isGroupChat:true,
        groupAdmin:req.user,
    })

    const fullGroupChat = await chat.findOne({ _id:groupChat._id})
    .populate("users","-password")
    .populate("groupAdmin","-password");

    res.status(200).json(fullGroupChat);
   } catch(error){
   res.status(400);
   throw new Error(error.message);
   }
});

const renameGroup = asynchandler(async(req,res) =>{
   
  const { chatId ,chatName} = req.body ;

  const updatedchat = await chat.finalIdAndUpdate(
    chatId,{
      chatName,
    },
    {
      new:true,
    }
  )
  .populate("users","-password")
  .populate("groupAdmin","-password");

  if(!updatedchat){
    res.status(404);
    throw new Error("chat not found");
  }else{
    res.json(updatedchat);
  }
})


const addTogroup = asynchandler(async(res,req)=>{
   const {chatId,userId} = req.body;
   const added = chat.findbyIdandUpdate(
    chatId,
    {
      $push:{user:userId},
    },
    {new:true}
   )
   .populate("users","-password")
   .populate("groupadmin","-password");

   if(!added){
    res.status(404);
    throw new Error("chat not found");
   }
   else{
    res.json(added);
   }
});

const removeFromGroup = asynchandler(async(res,req)=>{
  const {chatId,userId} = req.body;
  const remove = chat.findbyIdandUpdate(
   chatId,
   {
     $pull:{user:userId},
   },
   {new:true}
  )
  .populate("users","-password")
  .populate("groupadmin","-password");

  if(!remove){
   res.status(404);
   throw new Error("chat not found");
  }
  else{
   res.json(added);
  }
});



module.exports = { accessChat,fetchchats,createGroupchat ,renameGroup,addTogroup , removeFromGroup};
