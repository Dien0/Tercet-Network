const mongoose = require('mongoose');

const mSchema = new mongoose.Schema({

    g: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    s: {
        type: Date
    },
    e: {
        type: Date
    }
},
    {
        timestamps: true
    });

mongoose.model('FGame', mSchema);
