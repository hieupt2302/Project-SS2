const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Users } = require('../models/User'); // Adjust the path as necessary

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: '942650690084-nuq19oe3idpp9jq88cigsef98d54tj5c.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const [user] = await Users.findOrCreate({
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

  passport.serializeUser((user, done) => {
    console.log('Serializing user:', user);
    done(null, user.id)
  });
  passport.deserializeUser(async (id, done) => {
    console.log('Deserializing user with id:', id);
    const user1 = await Users.findByPk(id);
    console.log('User found:', user1);

    try {
      console.log('Deserializing user with ID:', id);
      const user = await Users.findByPk(id);
      if (!user) {
        return done(new Error('User not found'), null);
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};