const mongoose = require('mongoose');

const mSchema = new mongoose.Schema({

    g: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    rwd: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });

mongoose.model('MReward', mSchema);
