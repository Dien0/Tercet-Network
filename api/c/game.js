const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const FGame = mongoose.model('FGame');
const consts = require('../i/c');

module.exports.gameCreate = function (req, res) {

  const fields = ["name", "platform", "reward", "bundle_id"];
  if (!req.body.name || !req.body.platform) {
    res.status(401);
    res.json({
      "error": "Game name, And Platform are required"
    });
    return;
  }

  let game = new Game();
  game = consts.populateGame(req, game);
  game.p = mongoose.Types.ObjectId(req.payload._id);
  game.save(function (err) {
    console.log(err);
    res.status(err == null? 200 : 400);
    res.json({
      "status": (!err),
      "error" : err
    });
  });

};

// game edit if user is permited
module.exports.gameUpdate = function (req, res) {
  console.log(req.body.id);
  if (!req.body.id) {
    res.status(401);
    res.json({
      "error": "All fields required"
    });
    return;
  }
  const cond = { "_id": mongoose.Types.ObjectId(req.body.id), "p": mongoose.Types.ObjectId(req.payload._id) };
  const update = { m: req.body.mode, b: req.body.bundle_id, o: req.body.platform, n: req.body.name };

  console.log(update);
  Game.findOneAndUpdate(cond, update, function (err, game) {
    if (err) { res.status(401); } else { res.status(200); }
    res.end();
  });

};

// game delete verify if user is permited
module.exports.gameDelete = function (req, res) {
  if (!req.params.game_id) {
    res.status(401);
    res.end();
    return;
  }
  const cond = { "_id": mongoose.Types.ObjectId(req.params.game_id), "p": mongoose.Types.ObjectId(req.payload._id) };
  const update = { a: false };

  Game.findOneAndUpdate(cond, update, function (err, game) {
    if (!err) { res.status(401); } else { res.status(200); }
    res.end();
  });

};

/**
     * The getGameListByPublisherId method returns a list of games
     * for an publisher, or returns an error message.
     *
     */

module.exports.getGameRewardListByPublisher = function (req, res) {
  cond = { "p": mongoose.Types.ObjectId(req.payload._id) };
  startDate = new Date(req.query.from + "T00:00:00.000Z");
  endDate = new Date(req.query.to + "T23:59:59.999Z");
  let status = false;
  if (req.params.status === 'pending') {
    status = 'p';
  } else if (req.params.status === 'inprogress') {
    status = 'i';
  } else if (req.params.status === 'paid') {
    status = 'r';
  } else if (req.params.status === 'disputed') {
    status = 'd';
  }
  group = { $group: { _id: {mediator: "$mediators.a", date: "$trackers.rewards.createdAt", platform: "$o", game_name: "$n", game_id: "$_id", reward: "$trackers.rewards.rwd", status: "$trackers.rewards.s", tx_id: "$trackers.rewards.tx" }, rewards: { $sum: "$trackers.rewards.rwd" } } };
  project = {
    $project: {
      _id: 0,
      createdAt: "$_id.date",
      game_name: "$_id.game_name",
      platform: "$_id.platform",
      status:
      {
        $switch:
        {
          branches: [
            {
              case: { $eq: ["$_id.status", "i"] },
              then: "In progress"
            },
            {
              case: { $eq: ["$_id.status", "p"] },
              then: "Pending"
            },
            {
              case: { $eq: ["$_id.status", "r"] },
              then: "Paid"
            },
            {
              case: { $eq: ["$_id.status", "d"] },
              then: "Disputed"
            },

          ],
          default: "$_id.status"
        }
      },
      mediator: "$_id.mediator",
      reward: "$_id.reward",
      tx_id: "$_id.tx_id"

    }
  };

  cb = (err, rewards) => {
console.log(rewards);
    if (err) { return res.status(410).json({ err: 'wrong', rewards: null }); }
    res.status(200).json({ data: rewards, err: null });
  };

  consts.getGameRewards(Game, status, cond, startDate, endDate, project, group, cb);

};

module.exports.OLDgetGameRewardListByPublisher = function (req, res) {
  let cond = { "p": mongoose.Types.ObjectId(req.payload._id) };
  Game.aggregate([
    { "$match": cond },
    // { "$sort": { "p": 1, "adunits.p": 1 } },
    {
      "$lookup": {
        "from": "mlogs",
        "let": { "g": "$_id" },
        "pipeline": [
          { "$match": { "$expr": { "$eq": ["$g", "$$g"] } } },
          {
            "$lookup": {
              "from": "players",
              "let": { "p": "$p" },
              "pipeline": [
                { "$match": { "$expr": { "$eq": ["$_id", "$$p"] } } }
              ],
              "as": "players"
            }
          },
          { "$unwind": "$players" },
          {
            "$lookup": {
              "from": "mtrackers",
              "let": { "l": "$_id" },
              "pipeline": [
                { "$match": { "$expr": { "$eq": ["$l", "$$l"] } } },
                {
                  "$lookup": {
                    "from": "rewards",
                    "let": { "t": "$_id" },
                    "pipeline": [
                      { "$match": { "$expr": { "$eq": ["$t", "$$t"] } } }
                    ],
                    "as": "rewards"
                  }
                },
                { "$unwind": "$rewards" }
              ],
              "as": "trackers"
            }
          },
          { "$unwind": "$trackers" }
        ],
        "as": "logs"
      }
    },
    { "$unwind": "$logs" },
    {
      $project: {

        _id: "$logs.trackers.rewards._id",
        game_id: "$_id",
        game_name: "$n",
        platform: "$o",
        player_id: "$logs.players.p",
        player_avatar: "$logs.players.a",
        player_name: "$logs.players.n",
        player_email: "$logs.players.m",
        tx_id: "$logs.trackers.rewards.tx",
        reward: "$logs.trackers.rewards.rwd",
        createdAt: "$logs.trackers.rewards.createdAt"

      }
    }
  ]).exec((err, rwds) => {
    if (err) { res.status(200).json({ err: 'wrong', data: null }); }
    res.status(200).json({ data: rwds, err: null });
  });

};

exports.getGameStatForPublisher = (req, res) => {

  cond = { "p": mongoose.Types.ObjectId(req.payload._id) };
  startDate = new Date(req.query.from + "T00:00:00.000Z");
  endDate = new Date(req.query.to + "T23:59:59.999Z");

  group = { $group: { _id: { date: "$createdAt", platform: "$o", game_name: "$n", game_id: "$_id", reward: "$rwd" }, rewards: { $sum: "$trackers.rewards.rwd" }, date: { $addToSet: "$createdAt" } } };
  project = {
    $project: {
      _id: 0,
      name: "$_id.game_name",
      platform: "$_id.platform",
      reward: "$_id.reward",
      rewards: "$rewards",
      date: "$date",
      game_id: "$_id.game_id"
    }
  };

  cb = (err, rewards) => {
    console.log(err);
    console.log(rewards);
    console.log(9099);
    if (err) { res.status(410).json({ err: 'wrong', rewards: null }); }
    return res.status(200).json({ data: rewards, err: null });
  };
  consts.getGameRewards(Game, false, cond, startDate, endDate, project, group, cb);


};


module.exports.getGamePlayerListByPublisher = function (req, res) {
  let cond = { "p": mongoose.Types.ObjectId(req.payload._id) };
  if (req.payload.user_type == consts.typeAdmin.TYPE) {
    cond = {};
  }
  Game.aggregate([
    { "$match": cond },
    // { "$sort": { "p": 1, "adunits.p": 1 } },
    {
      "$lookup": {
        "from": "mlogs",
        "let": { "g": "$_id" },
        "pipeline": [
          { "$match": { "$expr": { "$eq": ["$g", "$$g"] } } },
          {
            "$lookup": {
              "from": "players",
              "let": { "p": "$p" },
              "pipeline": [
                { "$match": { "$expr": { "$eq": ["$_id", "$$p"] } } }
              ],
              "as": "players"
            }
          },
          { "$unwind": "$players" }
        ],
        "as": "gp"
      }
    },
    { "$unwind": "$gp" },
    {
      $project: {
        _id: 0,
        game_id: "$_id",
        game_name: "$n",
        platform: "$o",
        player_id: "$gp.players._id",
        player_avatar: "$gp.players.a",
        player_name: "$gp.players.n",
        player_email: "$gp.players.m",
        user_name: "$gp.players.p"
      }
    }
  ]).exec(function (err, games) {
    res.status(200).json({ "error": err, "data": games });
  });
};

module.exports.getTopPayingGames = function (req, res) {
  Game.aggregate([
    { "$sort": { "games.rwd": 1 } },
    { "$limit": 10 },

    {
      $project: {
        _id: 0,
        id: "$_id",
        name: "$n",
        description: "$d",
        platform: "$o",
        rewards: "$rwd",
        app_id: "$i",
        createdAt: "$createdAt"
      }
    }
  ]).exec(function (err, games) {
    res.status(200).json({ "error": err, "data": games });
  });
};
module.exports.getFeaturedGames = function (req, res) {
  cond = {
    s: {
      "$lt": new Date()
    },
    e: {
      "$gt": new Date()
    }
  };
  FGame.aggregate([
    { "$match": cond },

    {

      "$lookup": {
        "from": "games",
        "localField": "g",
        "foreignField": "_id",
        "as": "games"
      }
    },
    { $unwind: '$games' },

    {
      $project: {
        _id: 0,
        id: "$_id",
        name: "$games.n",
        platform: "$games.o",
        rewards: "$games.rwd",
        app_id: "$games.i",
        start: "$s",
        end: "$e"
      }
    }
  ]).exec(function (err, games) {
    res.status(200).json({ "error": err, "data": games });
  });
};

module.exports.getGameListByPublisher = function (req, res) {
  let cond = { "p": mongoose.Types.ObjectId(req.payload._id) };
  if (req.payload.user_type == consts.typeAdmin.TYPE) {
    cond = {};
  }
  Game
    .aggregate([
      { $match: cond },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: "$n",
          mode: "$m",
          description: "$d",
          createdAt: 1,
          app_id: "$i",
          // app_secret: "$s",
          platform: "$o"
        }
      }
    ])
    .exec(function (err, games) {
      res.status(200).json({ "error": err, "data": games });
    });
};

module.exports.getGameActivityByPublisher = function (req, res) {
  let cond = { "p": mongoose.Types.ObjectId(req.payload._id) };
  if (req.payload.user_type == consts.typeAdmin.TYPE) {
    cond = {};
  }
  let rmatch = { "$match": { "$expr": { "$eq": ["$g", "$$g"] } } };

  if (req.query.from && req.query.to) {

    startDate = new Date(req.query.from + "T00:00:00.000Z");
    endDate = new Date(req.query.to + "T23:59:59.999Z");
    rmatch = {
      "$match": {
        "$expr": {
          "$and": [
            { "$eq": ["$g", "$$g"] },
            { "$gte": ["$createdAt", startDate] },
            { "$lt": ["$createdAt", endDate] }
          ]
        }
      }
    };

  }

  Game.aggregate([
    { "$match": cond },
    {
      "$lookup": {
        "from": "mlogs",
        "let": { "g": "$_id" },
        "pipeline": [
          rmatch
        ],
        "as": "log"
      }
    },
    { $unwind: '$log' },
    {
      $project: {
        _id: 0,
        name: "$n",
        platform: "$o",
        activity:
        {
          $switch:
          {
            branches: [
              {
                case: { $eq: ["$log.l", "init"] },
                then: "Login"
              },
              {
                case: { $eq: ["$log.l", "adreq"] },
                then: "Ad request"
              },

            ],
            default: "$log.l"
          }
        },
        createdAt: "$log.createdAt",
        description: "$d",
        mode: "$m",
        id: "$_id"
      }
    }
  ])
    .exec(function (err, games) {
      res.status(200).json({ "error": err, "data": games.reverse() });
    });
};

module.exports.getGameByPublisher = function (req, res) {
  let cond = { "_id": mongoose.Types.ObjectId(req.params.game_id), "p": mongoose.Types.ObjectId(req.payload._id) };
  if (req.payload.user_type == consts.typeAdmin.TYPE) {
    cond = {};
  }
  Game
    .aggregate([
      { $match: cond },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: "$n",
          mode: "$m",
          bundle_id: "$b",
          description: "$d",
          createdAt: 1,
          app_id: "$i",
          // app_secret: "$s",
          platform: "$o"
        }
      }
    ])
    .exec(function (err, game) {
      if (game[0]) {
        game = game[0];
      }
      res.status(200).json({ "error": err, "data": game });
    });
};
module.exports.getGameList = function (req, res) {
  Game
    .find({})
    .exec(function (err, games) {
      res.status(200).json({ "data": games, "error": err });
    });
};


