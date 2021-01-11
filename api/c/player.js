const mongoose = require('mongoose');
const Player = mongoose.model('Player');

const consts = require('../i/c');
const Log = mongoose.model('MLog');
/**
 * Player profile
 */
module.exports.profileRead = function (req, res) {
  Player
    .findById(req.payload._id)
    .exec(function (err, player) {
      if (player) {
        res.status(200).json({ player: { email: player.m, avatar: player.a, name: player.n, user_id: player.p, member_since: player.createdAt }, err: err });
      } else {
        res.status(200).json({ player: null, err: err });
      }
    });

};

/**
 * Player Reward List
 * 2019-04-25
 */

module.exports.rewardsList = function (req, res) {
  const fields = ['from', 'to'];
  const err = 'from and to date fields are required';
  if (! consts.validateRequest(req, res, fields, err)) {
  return false;
  }
  cond = { "p": mongoose.Types.ObjectId(req.payload._id) };

  cond.createdAt = {
    "$gte": new Date(req.query.from + "T00:00:00.000Z"),
    "$lt": new Date(req.query.to + "T23:59:59.999Z")
 };


    group = { $group: { _id: {tx_id: "$trackers.rewards.tx",createdAt: "$trackers.rewards.createdAt", platform: "$games.o", game_name: "$games.n", game_id: "$g", reward: "$games.rwd" }} };
    project = {
      $project: {
        _id: 0,
        tx_id: "$_id.tx_id",
        reward: "$_id.reward",
        rewards: "$number",
        game_name: "$_id.game_name",
        game_id: "$_id.game_id",
        platform: "$_id.platform",
        createdAt: "$_id.createdAt"
      }
    };
    cb = (err, rewards) =>{
      if (err) { res.status(410).json({ err: 'wrong', rewards: null }); }
      res.status(200).json({ data: rewards, err: null });
    };
    consts.getRewards( Log, false, false, false, cond, project, group, cb);
};

/**
   * Player Game List
   */

module.exports.gameStat = function (req, res) {
  cond = { "p": mongoose.Types.ObjectId(req.payload._id) };
  cond.createdAt = {
    "$gte": new Date(req.query.from + "T00:00:00.000Z"),
    "$lt": new Date(req.query.to + "T23:59:59.999Z")
 };

 group = { $group: { date: { $addToSet: "$trackers.rewards.createdAt" } , _id: { platform: "$games.o", game_name: "$games.n", game_id: "$g", reward: "$games.rwd" }, number: { $sum: "$trackers.rewards.rwd" } } };
  project = {
    $project: {
      platform: "$_id.platform",
      _id: 0,
      rewards: "$number",
      reward: "$_id.reward",
      name: "$_id.game_name",
      id: "$_id.game_id",
      date: { $slice: [ "$date", 1 ] },
    }
  };
  cb = (err, rewards) =>{
    if (err) { res.status(410).json({ err: 'wrong', rewards: null }); }
    res.status(200).json({ data: rewards, err: null });
  };
  consts.getRewards(Log, false, false, false, cond, project, group, cb);

};

