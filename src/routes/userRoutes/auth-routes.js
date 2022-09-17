const express = require("express");
const router = express.Router();
const userApi = require("../../api/user/index");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods


// Post Methods
router.post("/sign-up", validate("body", userApi.signup.validation), userApi.signup.handler);
router.post("/login", validate("body", userApi.login.validation), userApi.login.handler);


// Put Methods
router.put("/update-profile", passport.authenticate(["jwt"], { session: false }), validate("body", userApi.updateProfile.validation), userApi.updateProfile.handler);


module.exports = router;
