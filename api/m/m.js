const mongoose = require('mongoose');

const mSchema = new mongoose.Schema({
    g: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    a: {
        type: String,
        required: true
    },
    i: {
        type: String,
        required: true
    },
    s: {
        type: String
    },
    u: {
        type: String,
    },
    p: {
        type: String
    }

},
    {
        timestamps: true
    });


mongoose.model('Mediation', mSchema);
