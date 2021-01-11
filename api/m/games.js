const mongoose = require('mongoose');
const crypto = require('../i/e');

const gameSchema = new mongoose.Schema({
  p: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  b: {
    type: String,
    required: true
  },
  o: {
    type: String,
    enum: ['android', 'ios'],
    required: true
  },
  n: {
    type: String,
    required: true
  },
  rwd: {
    type: Number,
    default: 1
  },
  m: {
    type: String,
    enum: ['test', 'live'],
    default: 'test'
  },
  a: {
    type: Boolean,
    default: true
  },
  i: {
    type: String
  },
  s: {
    type: String
  }

},
  {
    timestamps: true
  });

gameSchema.pre("save", function (next) {
  this.wasNew = this.isNew;
  const key = crypto.genKeys();
  this.i = key.i;
  this.s = key.s;
  next();
});

gameSchema.post("save", (doc) => {
  console.log(doc);
  if (doc.wasNew) {
    Mediation = mongoose.model('Mediation');
    mediation = new Mediation();
    mediation.a = '_default';
    mediation.i = '_default';
    mediation.g = doc._id;
    mediation.u = '_default';
    mediation.save();
  }
});
mongoose.model('Game', gameSchema);
