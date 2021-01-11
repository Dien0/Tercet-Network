const mongoose = require('mongoose');

const aSchema = new mongoose.Schema({

    g: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    s: {
        type: String,
        enum: ['a', 'p', 's', 'd'],
        default: 'a'
      },
    u: {
        type: String,
        required: true
    },
    b: {
        type: Number,
        required: true
    },
    d: {
        type: Number,
        required: true
    },
    r: {
        type: Number,
        required: true
    }
},
    {
        timestamps: true
    });

mongoose.model('Campaign', aSchema);
