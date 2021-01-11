var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var consts = require('../i/c');
const wallet = mongoose.model('Wallet');
const blockChain = require("../i/bc");

const modelX = require('../i/m');


var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  pos: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  addr: {
    unique: true,
    type: String
  },
  active: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    enum: [consts.typeAdmin.TYPE, consts.typePlayer.TYPE, consts.typePublisher.TYPE],
    default: consts.typePlayer.TYPE
  },
  hash: String,
  salt: String
},
  {
    timestamps: true
  });


userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateAccessToken = function () {
  var expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 5);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    wid: this.s,
    type: this.type,
    name: this.name,
    exp: parseInt(expiry.getTime()),
  }, consts.app.secret); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

userSchema.methods.generateRefreshAccessToken = function () {
  var expiry = new Date();
  expiry.setHours(expiry.getHours() + 1);

  return jwt.sign({
    _id: this._id,
    exp: parseInt(expiry.getTime()),
  }, consts.app.refresh_secret); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

userSchema.pre('save', function (next) {
  doc = this;

  wallet.findByIdAndUpdate('userId' , { $inc: { pos: 1 } }, function (error, counter) {
    if (error)
      return next(error);
    doc.pos = counter.pos;
    cb = (err, addr) => {
      if (err) {
      }
      doc.addr = addr;
       next();
    };
    blockChain.getAddress(counter.pos, cb);

  });

});

mongoose.model('User', userSchema);
