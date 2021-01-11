var mongoose = require('mongoose');
/**
 * tid = transaction id for input or output
 */
var prwdSchema = new mongoose.Schema({
  t: {
    type: String,
    required: true
  },
  p: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  i: {
    type: Number,
    default: 0
  },
  b: {
    type: Number,
    default: 0
  },
  o: {
    type: Number,
    default: 0
  },
  c: {
    type: Boolean,
    default: false
  },

},
{
  timestamps: true
});

mongoose.model('PubRwds', prwdSchema);
