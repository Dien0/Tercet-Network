const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const atob = require('atob');
const btoa = require('btoa');
const mailerX = require('../i/Mailer');
const mailer = new mailerX();

module.exports.login = function (req, res) {
    passport.authenticate('local', function (err, user) {
      let token;
      // If Passport throws/catches an error
      if (err) {
        console.log(err);
        res.status(404).json(err);
        return;
      }

      // If a user is found
      if (user) {
        token = user.generateAccessToken();
        refresh_token = user.generateRefreshAccessToken();
        res.status(200);
        res.json({
          "token": token,
          "refresh_token": refresh_token
        });
      }else{
        res.status(404).json(user);
      }
    })(req, res);

  };
  module.exports.changePassword = function (req, res) {
    User.findOne({ email: req.payload.email }, function (err, user) {
      if (err) { return done(err); }
      // Return if user not found in database
      if (!user) {
        res.status(401).json({
          "error": "UnauthorizedError: private profile"
        });
      }
      // Return if password is wrong
      if (!user.validPassword(req.body.oldPassword)) {
        res.status(401).json({
          "error": "UnauthorizedError: private profile"
        });
      } else {
        user.setPassword(req.body.newPassword);
        user.save(function (err) {
          if (user) {
            token = user.generateAccessToken();
            refresh_token = user.generateRefreshAccessToken();
            res.status(200);
            res.json({
              "token": token,
              "refresh_token": refresh_token
            });
          }

        });

      }
    });
  };

  // reset pass send in email
  module.exports.resetPassword = function (req, res) {
    if (!req.body.email) {
      res.status(401).json({
        "message": "NoUserError: User not found"
      });
      return;
    }
    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) { return done(err); }
      // Return if user not found in database
      if (!user) {
        res.status(401).json({
          "error": "UnauthorizedError: private profile"
        });
      }
      // generate random password
      let newPassword = Math.random().toString(36).substring(2, 15);
      user.setPassword(newPassword);
      user.save(function (err) {
        let from = 'passwordreminder@server.com';
        let text = 'Password: ' + newPassword;
        let subject = "Reset Password";
        mailer.sendTextMail(from, req.body.email, subject, text);
        res.status(200);
        res.json({
          "data": 'Password sent to: ' + req.body.email
        });
      });
    });
  };

/**
 * For google login
 */

module.exports.glogin = function (req, res) {
    passport.authenticate('google',{scope:
      [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ],}, function (err, player, info) {
      var token;
      // If Passport throws/catches an error
      if (err) {
        res.status(404).json({err:err});
        return;
      }

      // If a player is found

      if (player) {
        let expiry = new Date();
        expiry.setHours(expiry.getHours() + 177);
        let exp = parseInt(expiry.getTime());
        token = player.generateAccessToken(exp, 98977);
        refresh_token = player.generateRefreshAccessToken(exp,98977);

        let json =({
          "token": token,
          "refresh_token": refresh_token
        });
        let state = req.query.state;
        console.log(state);
        console.log('state');
        if(!state){
          res.status(200).json(json);
          return;
        }
        console.log(state);
        // state = state.split('=')[1];

        const  querystring = require('querystring');
        state = atob(state);

        state = state+'?data='+ btoa(querystring.stringify(json));
        console.log('state');
        console.log(state);
        res.redirect(state);
          return;
        } else {
        // If user is not found
        res.status(401).json({
          "token": null,
          "refresh_token": null
        });
      }
    })(req, res);

  };

