const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../schemas/User");
const jwt = require('jsonwebtoken');
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: '948158100231-n4l3j047n9en4rkf6cfpk83o6jetf807.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: "http://localhost:8000/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          const newUser = new User({
            email: profile.emails[0].value,
            name: profile.name,
            photoUrl: profile.photoUrl
            // Add other relevant user data here
          });
          await newUser.save();
          
          const token = jwt.sign(
            { id: newUser._id, isAdmin: newUser.isAdmin, email: newUser.email },
            process.env.JWT_SECRET
          );
          
          return done(null, { user: newUser, token });
        }

        const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin, email: user.email },
          process.env.JWT_SECRET
        );

        return done(null, { user, token });
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = passport;
