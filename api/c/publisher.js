const mongoose = require('mongoose');
const User = mongoose.model('User');
const consts = require('../i/c');
const hdkey = require("ethereumjs-wallet/hdkey");
const bip39 = require("bip39");
const mnemonic = 'memory expire desk kitchen digital obey crouch slot pony bachelor theme divide';


exports.walletAddress = (req, res) => {
  let data;
  User
    .findById(req.payload._id)
    .exec(function (err, user) {
      if (user) {
        data = { address: user.addr };
      }
      res.status(200).json({ data: data, err: err });
    });
};

// register
module.exports.register = function (req, res) {
  if (!req.body.email || !req.body.name || !req.body.password) {
    res.status(400);
    res.json({
      "error": "All fields required"
    });
    return;
  }
  let user = new User();
  user.type = consts.typePublisher.TYPE;
  user = consts.populateUser(req, user);
  user.save(function (err) {
    if (err) {
      res.json({
        "error": err
      });
      return;
    }

    res.status(200);
    res.json({
      "token": user.generateAccessToken()
    });
  });
};

// profile view
module.exports.profileRead = function (req, res) {

  User
    .findById(req.payload._id)
    .exec(function (err, user) {
      let data = user;
      if (user) {
        data = { email: user.email, name: user.name, avatar: null, active: user.active, member_since: user.createdAt };
      }
      res.status(200).json({ data: data, err: err });
    });

};

// profile edit
module.exports.profileEdit = function (req, res) {
  if (!req.body.email || !req.body.name || !req.body.password) {
    res.status(400);
    res.json({
      "error": "All fields required"
    });
    return;
  }
  const user = new User();
  user.user_type = userType;
  user.setPassword(req.body.password);
  const data = { password: user.password, name: req.body.name, email: req.body.email, member_since: user.createdAt };
  User
    .update({ _id: req.payload._id }, data)
    .exec(function (err, pub) {
      res.status(200).json({ "data": pub });
    });
};

