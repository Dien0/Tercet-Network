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
    s: {
        type: String,
        enum: ['init', 'adreq', 'offline'],
        required: true
    },
     o: {
        type: String,
        enum: ['android', 'ios'],
        required: true
    }
},
    {
        timestamps: true
    });

mongoose.model('Log', mSchema);
