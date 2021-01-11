const mongoose = require('mongoose');

const mtSchema = new mongoose.Schema({

    l: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    u: {
        type: String
    },
    e: {
        e: {type : Date, default: null},  // e = end
        o: {type : Date, default: null},  // o = out link open click
        i: {type : Date, default: null},  // i = install
        l: {type : Date, default: null}, // l = loaded
        u: {type : Date, default: null}, // u = unsuccessful loading
        s: {type : Date, default: null},  // s = started
        f: {type : Date, default: null}, // f = failed
        r: {type : Date, default: null}, // r = rewarded
        c: {type : Date, default: null}, // c = closed
        d: {type : Date, default: null}, // d = dismiss
        x: {type : Date, default: null}  // x = expired
      }
},
    {
        timestamps: true
    });

mongoose.model('MTracker', mtSchema);
