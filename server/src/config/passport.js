const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models/User'); // Adjust the path as necessary

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const [user] = await User.findOrCreate({
        where: { email: profile.emails[0].value },
        defaults: {
          googleId: profile.id,
          email: profile.emails[0].value
        }
      });
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await User.findByPk(id);
    done(null, user);
  });
};