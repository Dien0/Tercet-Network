var mongoose = require('mongoose');
/**
 * tid = transaction id for input or output
 */
var ctransSchema = new mongoose.Schema({
  p: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  l: {
    type: String,
    required: true
  },
  g: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

},
{
  timestamps: true
});

mongoose.model('CampaignLog', ctransSchema);
