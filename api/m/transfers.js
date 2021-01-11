const mongoose = require('mongoose');

const mSchema = new mongoose.Schema({

    f: {
        type: String,
        required: true
    },
    t: {
        type: String,
        required: true
    },
    v: {
        type: Number,
        required: true
    },
    th: {
        type: String,
        required: true
    },
    bn: {
        type: Number,
        required: true
    },
    bh: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });

mongoose.model('Transfer', mSchema);
