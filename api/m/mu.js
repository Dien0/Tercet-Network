const mongoose = require('mongoose');

const muSchema = new mongoose.Schema({
    m: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    a: {
        type: String
    },
    p: {
        type: String
    },
    t: {
        type: String,
        enum: ['i', 'r'],
        required: true
      },

},
    {
        timestamps: true
    });

mongoose.model('AdUnit', muSchema);
