const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const keys = require('./keys');
const consts = require('./c');

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Player = mongoose.model('Player');
const Game = mongoose.model('Game');
/**
 * verify app id
 * request tokens
 * record player
 * record game player
 */


passport.use(
  new GoogleStrategy({
    // options for strategy
    callbackURL: consts.app.url+'auth-success',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    passReqToCallback: true

  }, function (req,accessToken, refreshToken, profile, done) {
    let appid = req.query.state;
    //appid = appid.split('=')[0];
    Game.findOne({i: appid}).exec(
      (err, game) => {
        if (err){
          return done(err, null);
        }

    var player = {
      p: profile.id,
      m: profile.emails[0].value,
      n: profile.displayName,
      a: profile.photos[0].value,
      t: accessToken
    };
	if(refreshToken){
		player.r = refreshToken;
	}

    Player.findOneAndUpdate(
      { p: profile.id }, // find a document with that filter
      player, // document to insert when nothing was found
      { upsert: true, new: true, runValidators: true }, // options
      function (err, player) { // callback
       if(game){
           req.query.state = null;
       }
        return done(err, player);
      }
    );
  });

  }


  ));
