const express = require("express");
const { registerUser, loginUser } = require("../controllers/auth");
const passport = require("passport");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  router.get(
    "/google/callback",
    passport.authenticate("google", {
      successRedirect: "/dashboard", // Redirect on successful authentication
      failureRedirect: "/login", // Redirect to login on failure
      failureFlash: true,
    })
  );

module.exports = router;