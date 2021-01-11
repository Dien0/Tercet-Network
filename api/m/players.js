var mongoose = require('mongoose');
var consts = require('../i/c');
var jwt = require('jsonwebtoken');

// Basic Player Schema for Google Authentication
var playerSchema = new mongoose.Schema({
    m: {
        type: String,
        required: [true, 'email required'],
        unique: [true, 'email already registered']
    },
    p: {
        type: String,
        required: [true, 'player id required']

    },
    n: {
        type: String,
        required: [true, 'player name is required'],

    },
    a: {
        type: String,
        required: [true, 'image required'],
    },
    t: {
        type: String,
        required: [true, 'Access token required'],
    },
    r: {
        type: String
    }
},
    {
        timestamps: true
    });

playerSchema.methods.generateAccessToken = function (exp) {
    return jwt.sign({
        _id: this._id,
        email: this.m,
        type: consts.typePlayer.TYPE,
        name: this.n,
        username: this.p,
        avatar: this.a,
        exp: parseInt(exp),
    }, consts.app.secret); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

playerSchema.methods.generateRefreshAccessToken = function (exp,appid) {
    return jwt.sign({
        _id: this._id,
        type: consts.typePlayer.TYPE,
        name: this.n,
        username: this.p,
        exp: exp,
    }, consts.app.refresh_secret); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

mongoose.model('Player', playerSchema);
