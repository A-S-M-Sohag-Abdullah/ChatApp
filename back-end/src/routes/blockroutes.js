const express = require("express");
const { protect } = require("../middlewares/authmiddleware");
const { blockUser, unblockUser } = require("../controllers/blockcontroller");

const router = express.Router();

router.post("/block/:id", protect, blockUser);
router.post("/unblock/:id", protect, unblockUser);

module.exports = router;
