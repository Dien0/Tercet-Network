var mongoose = require('mongoose');
const Player = mongoose.model('Player');
const keys = require('../i/keys');
const OAuth2Client = require('google-auth-library').OAuth2Client;
const client = new OAuth2Client(keys.google.clientID, keys.google.clientSecret);

const sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.login = function (req, res) {
  console.log(req.body);
  if (!req.body.code || !req.body.appid) {
    sendJSONresponse(res, 401, { "error": "All fields required" });
    return;
  }
  try {
    client.getToken(
      req.body.code
    ).then((data) => {

      client.verifyIdToken({
        idToken: data.tokens.id_token,
        audience: keys.google.clientID,
        // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      }).then((ticket) => {
        /**
         * Payload
           locale: 'en-GB',
     iat: 1571496190,
     exp: 1571499790
            */
        const payload = ticket.getPayload();
        if (!payload.email_verified) {
          sendJSONresponse(res, 400, { "error": "Please verify your email first!" });
          return false;
        }
        const player = {
          player_id: payload.sub,
          gid: req.body.appid,
          email: payload.email,
          player_name: payload.given_name + ' ' + payload.family_name,
          image: payload.picture,
          access_token: data.tokens.access_token,
          refresh_token: data.tokens.refresh_token,
        };
        if (data.tokens.refresh_token != undefined) {
          player.refresh_token = data.tokens.refresh_token;
        }
        Player.findOneAndUpdate(
          { player_id: payload.sub, gid: req.body.appid }, // find a document with that filter
          player, // document to insert when nothing was found
          { upsert: true, new: true, runValidators: true }, // options
          function (err, playerX) { // callback
            if (err) {
              console.log(err);
              sendJSONresponse(res, 400, { "error": err });
            }
            if (playerX) {
              token = playerX.generateAccessToken(payload.exp, req.body.appid);
              refresh_token = playerX.generateRefreshAccessToken(payload.exp, req.body.appid);
              let json = ({
                "error": err,
                "token": token,
                "refresh_token": refresh_token
              });
              sendJSONresponse(res, 200, json);
            }
          }
        );

      }).catch(console.log);


    }).catch(console.error);

  } catch (err) {
    sendJSONresponse(res, 400, { "error": err });
  }
};
