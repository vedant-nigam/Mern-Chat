const asynchandler = require("express-async-handler");
const user = require("../Models/userModel");
const chatModel = require('../Models/Chatmodel');
const messageModel = require('../Models/MessageModel');
const generateToken = require("../Config/generateToken");
const { query } = require("express");
 
const registerUser = asynchandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please enter all the feilds");
  }

  const userExists = await user.findone({ email });
  if (userExists) {
    res.status(400);
    throw new error("User already exists");
  }
  const user = await user.create({
    name,
    email,
    password,
    pic,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new error("failed to create user");
  }
});

const authUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await user.findOne({ email });

  if (user && (await user.matchpassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new error("Invalid email or password");
  }
});

// ("api/user")
// query are used for calling api
const alluser = asynchandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        //or is an mongodb fun when  either of the fun are true it
        //regex is also an mongodb func tbat helps us to match the string and filter them
        $or: [
          {
            name: {
              $regex: req.query.search,
              $option: "i",
            },
          },
          {
            email: {
              $regex: req.query.search,
              $option: "i",
            },
          },
        ],
      }
    : {};

  const users = await user.find(keyword).find({ _id: { $ne: req.use._id } });

  res.send(users);
});

module.export = { registerUser, authUser, alluser };
