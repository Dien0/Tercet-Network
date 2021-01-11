var app = {
  secret: 'MYJHY*(7LL:K_))KP_SECRET3EAF2FE85F7DEB7E8F8EBFE93C657617A6B851720B8050C7212A65CD97743AEE',
  refresh_secret: 'MY_REFRESH_U^*^&&*((*)ctt33',
  url: 'https://gemul.ga/api/',
  rwd: 1
};

exports.app = app;

var TYPE_ADMIN = 'admin';
module.exports.typeAdmin = {
  TYPE: TYPE_ADMIN
};

var TYPE_PUBLISHER = 'publisher';
module.exports.typePublisher = {
  TYPE: TYPE_PUBLISHER
};

var TYPE_PLAYER = 'player';
module.exports.typePlayer = {
  TYPE: TYPE_PLAYER
};

exports.admobTestAdUnit = {
  appId: 'ca-app-pub-3940256099942544~3347511713',
  unit: 'ca-app-pub-3940256099942544/5224354917'
};



exports.TestAdUnit = (mediator) => {


}
  ;

exports.populateUser = function (req, user) {
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  return user;
};

exports.populateGame = function (req, game) {
  game.n = req.body.name;
  game.rwd = req.body.reward;
  game.b = req.body.bundle_id;
  game.o = req.body.platform;
  if (req.body.mode) {
    game.m = req.body.mode;
  }
  return game;
};

/**
 * Get preauth
 *
 * Ad opened last 5 minutes and not rewarded or failed yet
 *
 */

exports.totalAuth = (CTracker, cid, cb) => {

  cb1 = (err, balance) => {
    if (!err) {
      cb2 = (error, bal) => {
        cb(error, balance + bal);
      };
      this.getTotalCampaignSpending(CTracker, cid, cb2);
    }
  };

  this.preauth(CTracker, cid, cb1);
};
exports.preauth = (CTracker, cid, cb) => {

  gt = new Date(ISODate().getTime() - 1000 * 60 * 5);
  let balance = 0;
  CTracker.find({ c: cid, created_on: { $gte: gt } }, { e: 1 }).exec(function (err, trans) {
    trans.forEach(tx => {
      if (tx.e) {
        if (tx.e.o && !(tx.e.r) && !(tx.e.f)) {
          balance++;
        }
      }
    });
    cb(err, balance);
  });

};

/**
 * Get today spending of Campaign
 */

exports.getTodayCampaignSpending = (CTracker, cid, cb) => {
  start = new Date();
  start.setHours(0, 0, 0, 0);
  end = new Date();
  end.setHours(23, 59, 59, 999);
  let balance = 0;
  CTracker.find({ c: cid, e: { r: { $gte: start, $lt: end } } }, { s: 1 }).exec(function (err, trans) {
    trans.forEach(tx => {
      balance++;
    });
    cb(err, balance);
  });
};

/**
 * Get total spending of Campaign
 */

exports.getTotalCampaignSpending = (CampTrans, cid, cb) => {
  let balance = 0;
  CTracker.find({ c: cid }, { s: 1 }).exec(function (err, trans) {
    trans.forEach(tx => {
      if (tx.e.r) { balance++; }
    });
    cb(err, balance);
  });
};

/**
 * Balnce of tokens
 */

exports.getBalance = (PubRwds, uid, cb) => {

  let balance = 0;
  PubRwds.find({ p: uid }).sort({ _id: 1 }).exec(
    (err, trans) => {
      if (trans) {
        trans.forEach(tran => {
          balance += tran.i;
          balance -= tran.o;
        });
      }
      cb(err, balance);
    }
  );

};

/**
 *
 * Deduct Balance
 * Publisher id, reward, transaction id, PubRwds, callback
 */

exports.deduct = (pubid, rwd, tid, PubRwds, cb) => {
  let prewards = new PubRwds();
  prewards.p = pubid;
  prewards.o = rwd;
  prewards.t = tid;
  prewards.save(err => {
    cb(err, prewards);
  });
};

/**
 *  getMediationListByGame
 * app_id, secret, adUnit if is admob
 *
 */

exports.reqAds = () => {
  return { app_id: '', secret: '', adUnit: '', priority: 0 };
};

// editing objects
exports.populateEditUser = function (req, userType) {
  var user = new User();
  user.user_type = userType;
  user.setPassword(req.body.password);
  return { password: user.password, name: req.body.name, contact_name: req.body.contact_name, email: req.body.email };
};

exports.validateRequest = (req, res, fields, err) => {
  let valid = true;
  fields.forEach(element => {
    if (!req.body[element] && !req.query[element]) {
      res.status(400);
      res.json({
        "error": err
      });
      valid = false;
      res.end();
    }
  });
  return valid;
};
exports.setPriority = (doc, priority, cb) => {
  doc.update(
    { p: { $gte: priority } },
    { $inc: { p: 1 } }, function (err, docs) {
      if (err) {
        cb(err, null);
        return;
      }
      cb(null, docs);
      return true;
    });
};
exports.campaignRewards = (cid, cb, Campaign, Prwd, Game) => {
  if (!cid) {
    cb('Campion id required', null, null, null);
    return;
  }

  Campaign.findById(cid).exec((err, campaign) => {
    if (err || !campaign) {
      cb('Campaign not found', null, null);
      return;
    }
    Game.findById(campaign.g).exec((err, game) => {
      if (err) {
        cb('Campaign not found', null, null);
        return;
      }


    Prwd.find({ p: game.p }).sort({ createdAt: 1 }).exec((err, rwds) => {
      if (err || !rwds.length) { return cb('Game is out of fund', null, null); }
      let ins = 0;
      let out = 0;
      rwds.forEach(rwd => {
        ins += rwd.i;
        out += rwd.o;
      });
      if ((ins - out) > campaign.r) {
        cb(null, rwds[0], campaign);
      } else {
        cb('Campaign is out of fund', rwds[0], campaign);
      }
    });
  });
});
};

exports.activeRewards = (game_id, cb, Game, Prwd) => {
  if (!game_id) {
    cb('Session id required', null, null, null);
    return;
  }

  Game.findById(game_id).exec((err, game) => {
    if (err) {
      cb('Game not found', null, null);
      return;
    }
    Prwd.find({ p: game.p }).sort({ createdAt: 1 }).exec((err, rwds) => {
      if (err || !rwds.length) { return cb('Game is out of fund', null, null); }
      let ins = 0;
      let out = 0;
      rwds.forEach(rwd => {
        ins += rwd.i;
        out += rwd.o;
      });
      if ((ins - out) > game.rwd) {
        cb(null, rwds[0], game);
      } else {
        cb('Game is out of fund', rwds[0], game);
      }
    });
  });
};

exports.createSession = (app_id, pid, cb, Game, log) => {
  Game.findOne({ i: app_id }).exec(
    (err, game) => {
      if (err) {
        return cb(err, null);
      }
      if (game) {
        log.g = game._id;
        log.p = pid;
        log.l = 'adreq';
        log.save(
          (err) => {
            return cb(err, log._id);
          }
        );
      } else {
        return cb(err, null);
      }
    }
  );

};

exports.getPublisherBalance = (PubRwds, cond, cb) => {
  PubRwds.find(cond).sort({ b: -1 }).limit(1).exec(
    (err, balances) => {
      if (err) {
        cb(err, null);
        return;
      }
      if (balances[0]) {
        cb(null, balances[0]);
      } else {
        cb(null, { rwd: 0, b: 2, p: cond.p });
      }
    });
};

exports.getLastPublisherBlock = (PubRwds, cb) => {
  PubRwds.find({}, { b: 1, _id: 1 }).sort({ b: -1 }).limit(1).exec(
    (err, balances) => {
      if (err) {
        cb(err, null);
        return;
      }
      if (balances[0]) {
        cb(null, balances[0]);
      } else {
        cb(null, { b: 2 });
      }
    });
};

exports.pendingTransactions = (PubRwds, cb) => {
  PubRwds.find({ c: false }).sort({ createdAt: -1 }).exec(
    (err, transactions) => {
      if (err) {
        cb(err, null);
        return;
      }
      cb(null, transactions);
    });
};

exports.getRewards = (Log, status, startDate, endDate, cond, project, group, cb) => {
  let tmatch = { "$match": { "$expr": { "$eq": ["$l", "$$l"] } } };
  let rmatch = { "$match": { "$expr": { "$eq": ["$t", "$$t"] } } };

  if (status) {
    tmatch = { "$match": { "$expr": { "$and": [{ "$eq": ["$l", "$$l"] }, { "$eq": ["$s", status] }] } } };
  }

  if (startDate && endDate) {
    rmatch = {
      "$match": {
        "$expr": {
          "$and": [
            { "$eq": ["$t", "$$t"] },
            { "$gte": ["$createdAt", startDate] },
            { "$lt": ["$createdAt", endDate] }
          ]
        }
      }
    };
  }
  Log.aggregate([
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
      "$lookup": {
        "from": "mtrackers",
        "let": { "l": "$_id" },
        "pipeline": [
          tmatch,
          {
            "$lookup": {
              "from": "rewards",
              "let": { "t": "$_id" },
              "pipeline": [
                rmatch,
              ],
              "as": "rewards"
            }
          },
          { "$unwind": "$rewards" }
        ],
        "as": "trackers"
      }
    },
    { "$unwind": "$trackers" },
    group,
    project
  ]).exec((err, rewards) => {
    cb(err, rewards);
  });

};

exports.getGameRewards = (Game, status, cond, startDate, endDate, project, group, cb) => {
  let tmatch = { "$match": { "$expr": { "$eq": ["$l", "$$l"] } } };
  let rmatch = { "$match": { "$expr": { "$eq": ["$t", "$$t"] } } };
  let umatch = { "$match": { "$expr": { "$eq": ["$u", "$$u"] } } };


  if (status) {
    tmatch = { "$match": { "$expr": { "$and": [{ "$eq": ["$l", "$$l"] }, { "$eq": ["$s", status] }] } } };
  }

  if (startDate && endDate) {
    rmatch = {
      "$match": {
        "$expr": {
          "$and": [
            { "$eq": ["$t", "$$t"] },
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
        "localField": "_id",
        "foreignField": "g",
        "as": "logs"
      }
    },
    { "$unwind": '$logs' },
    {
      "$lookup": {
        "from": "mtrackers",
        "let": { "l": "$logs._id" },
        "pipeline": [
          tmatch,
          {
            "$lookup": {
              "from": "rewards",
              "let": { "t": "$_id" },
              "pipeline": [
                rmatch,
              ],
              "as": "rewards"
            }
          },
          { "$unwind": "$rewards" }
        ],
        "as": "trackers"
      }
    },
    { "$unwind": "$trackers" },
    {
      "$lookup": {
        "from": "mediations",
        "let": { "u": "$logs.u" },
        "pipeline": [
          umatch,
        ],
        "as": "mediators"
      }
    },
    { "$unwind": "$mediators" },
    group,
    project
  ]).exec((err, rewards) => {
    cb(err, rewards);
  });

};
