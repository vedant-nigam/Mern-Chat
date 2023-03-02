const express = require("express");
const { chats } = require("./Data/Data");
const dotenv = require("dotenv");
const userRoutes = require("./Routes/userRoutes");
const { notfound, errorHandler } = require("./middleware/erroeMiddleware");
// const { notfound, errorHandler } = require("./middleware/erroeMiddleware");
const router = require("./Routes/chatRoutes")
const connectDB =require("./Config/db")
const chatModel = require('./Models/Chatmodel');
const messageModel = require('./Models/MessageModel');
const userModel = require('./Models/userModel');

const app = express();
dotenv.config();
connectDB();
app.use(express.json()); // to accept json data

app.get("/", (req, res) => {
  res.send("API is Working");
});

app.use("/api/user", userRoutes);
app.use("/api/chat",chatRoutes);

app.use(notfound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(5000, console.log(`server started on port ${PORT}`));
