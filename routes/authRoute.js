const express = require("express");
const router = express.Router();
const {signupValidator, loginValidator} = require("../validators/authValidator");
const { signup, login, logoutCtrl, getCurrentUserCtrl } = require("../controllers/authController");
const { authentication } = require("../middlewares/authMiddleware");

router.route("/signup").post(signupValidator, signup )
router.route("/login").post(loginValidator, login)
router.route("/logout").post(logoutCtrl)
router.route("/currentUser").get(authentication, getCurrentUserCtrl)

module.exports = router