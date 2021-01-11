const blockChain = require("../i/bc");
require('../m/db');
const consts = require('../i/c');
const mongoose = require('mongoose');
const PubRwds = mongoose.model('PubRwds');
const User = mongoose.model('User');



exports.getWallet = (pubid, callBack) =>{

    User.find({ _id: { $lte: pubid } }).countDocuments((err, pos) => {
        if (err) {
            return false;
        }
        blockChain.getWallet(pos, callBack);


    });
};
