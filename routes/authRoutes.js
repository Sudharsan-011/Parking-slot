const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authMiddleWare } = require("../middlewares/authMiddleWare");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.put("/toggle-role", authMiddleWare, authController.toggleRole);

module.exports = router;
