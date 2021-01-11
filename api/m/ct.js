const mongoose = require('mongoose');

const ctSchema = new mongoose.Schema({

    c: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    p: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    e: {
        o: {type : Date, default: null},
        f: {type : Date, default: null},
        r: {type : Date, default: null},
        c: {type : Date, default: null},
        i: {type : Date, default: null},
        l: {type : Date, default: null}
      }
},
    {
        timestamps: true
    });

mongoose.model('CTracker', ctSchema);
