const express = require("express")

const {protect } = require("../middleware/authMiddleware")

const router = express.Router();

 router.route("/").post(protect,accessChat);
router.route("/").get(protect,fetchchat);
router.route("/group").post( protect,createGroupchat);
router.route("/rename").put(protect,renameGroup);
router.route("/remove").put(protect,removeFromGroup);
router.route("/add").put(protect,addTogroup);

module.exports = router;