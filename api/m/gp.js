const mongoose = require('mongoose');

const mSchema = new mongoose.Schema({

    g: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    p: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
},
    {
        timestamps: true
    });

mongoose.model('GamePlayer', mSchema);
