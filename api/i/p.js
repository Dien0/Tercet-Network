const mongoose = require('mongoose');
const consts = require('../i/c');
// middleware for doing role-based permissions
module.exports.permit = function (...allowed) {
  const isAllowed = role => allowed.indexOf(role) > -1;
  const UserX = mongoose.model('User');
  const PlayerX = mongoose.model('Player');
  // return a middleware

  return (request, response, next) => {
    if (request.payload._id) {
      let User = UserX;
      if(request.payload.type == consts.typePlayer.TYPE){
        User = PlayerX;

      }

      User
        .findById(request.payload._id).exec(function (err, user) {
          if(err || !user){
            response.status(403).json({ message: "Forbidden" });
            return;
          }
          if(request.payload.type == consts.typePlayer.TYPE){
            user.type = consts.typePlayer.TYPE;
          }
          if (user && isAllowed(user.type)) {
            next(); // role is allowed, so continue on the next middleware
          } else {
            response.status(403).json({ message: "Forbidden" }); // user is forbidden
          }
        });
    } else {
      response.status(403).json({ message: "Forbidden" }); // user is forbidden
    }

  };
};
// middleware for checking if email exist in db
module.exports.isEmailExist = function () {
  var User = mongoose.model('User');
  // return a middleware

  return (request, response, next) => {
    if (request.body.email) {
      User
        .find({ email: request.body.email }).exec(function (err, user) {
          if (user.length) {
            response.status(403).json({ message: request.body.email + " exists" }); // user is forbidden
          } else {
            next();
          }
        });
    } else {
      response.status(403).json({ message: "Email require" }); // user is forbidden
    }

  };
};
