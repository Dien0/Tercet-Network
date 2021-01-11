var mongoose = require('mongoose');

var rewardSchema = new mongoose.Schema({
  t: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  tx: {
    type: String,
    required: true
  },
  ic: {
    type: Boolean,
    default: false
  },
  rwd: {
    type: Number,
    required: true
  },
  s: {
    type: String,
    enum: ['i', 'p', 'r', 'd'],
    default: 'i',
    required: true
},


},
{
  timestamps: true
});

mongoose.model('Reward', rewardSchema);
