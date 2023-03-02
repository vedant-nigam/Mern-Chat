const express = require("express");
const router = express.Router();
const {registerUser , authUser, alluser} = require("../controllers/userController");
const chatModel = require('../Models/Chatmodel');
const messageModel = require('../Models/MessageModel');
const userModel = require('../Models/userModel');
router.route("/").post(registerUser);
router.route("/login", authUser);

// its a get request for searching diff users
router.route("/").get( protect,alluser);

module.exports = router;
