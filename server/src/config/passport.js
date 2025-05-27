// server/src/config/passport.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const { User } = require('../models/User');
const { Op } = require('sequelize');
require('dotenv').config();

// Serialize/Deserialize
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});

// Local Strategy
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !user.password) return done(null, false, { message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    return match ? done(null, user) : done(null, false, { message: 'Invalid credentials' });
  } catch (err) {
    return done(err);
  }
}));

// Google Strategy
// Đảm bảo rằng nếu email đã tồn tại thì không tạo mới user trùng lặp.
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;

    let user = await User.findOne({
      where: {
        [Op.or]: [{ googleId: profile.id }, { email }]
      }
    });

    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email,
        role: 'user'
      });
    } else if (!user.googleId) {
      // Link Google ID to existing email-based user
      user.googleId = profile.id;
      await user.save();
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));
