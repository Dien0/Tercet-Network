var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      // Return if user not found in database
      if (!user) {
        return done({
          message: 'User not found'
        },false);
      }
      // Return if password is wrong
      if (!user.validPassword(password)) {
        return done( {
          message: 'Password is wrong'
        },false);
      }
      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));
