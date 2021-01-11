const mongoose = require('mongoose');

const mSchema = new mongoose.Schema({

    g: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    p: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    e: {
        i: {type : Date, default: null},  // Login
        o: {type : Date, default: null},  // logoff
        r: [{type : Date, default: null}] // Ad Requests
      }
},
    {
        timestamps: true
    });

mongoose.model('MLog', mSchema);
