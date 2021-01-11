const mongoose = require('mongoose');

const mSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    pos:{
        type: Number,
        required: true
    }

},
    {
        timestamps: true
    });

mongoose.model('Wallet', mSchema);
