/*
const crypto = require('../i/e');
const key = crypto.genKeys();
       // console.log(key);
        console.log(key);
*/
require('../m/db');
const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const AdUnit = mongoose.model('AdUnit');
const MTracker = mongoose.model('MTracker');
const consts = require('../i/c');
const Mediation = mongoose.model('Mediation');
const MReward = mongoose.model('MReward');
const PubRwds = mongoose.model('PubRwds');
const Log = mongoose.model('MLog');

const GamePlayer = mongoose.model('GamePlayer');
// gp();
function gp() {
  id = "5e074dca1275775c11a1407d";
  Log.aggregate([
    { "$match": { "p": mongoose.Types.ObjectId(id) } },
    {
      "$lookup": {
        "from": "games",
        "localField": "g",
        "foreignField": "_id",
        "as": "games"
      }
    },
    { $unwind: '$games' },
    { $group: { _id: { "game_id": "$g" }, uniqueCount: { $addToSet: "$games.n" } } },
    {
      $project: {
        //  _id: "$g",
        game_name: "$games.n",
        createdAt: 1,
        uniqueCount: 1,
        platform: "$o"
      }
    }
  ]).exec((err, games) => {
    if (err) { console.log(err); }
    console.log(games);
  });
}
//gm();
function gm() {
  id = "5de65f77a36a770ad0e67ae3";
  Game.aggregate([
    { "$match": { "p": mongoose.Types.ObjectId(id) } },
    {
      "$lookup": {
        "from": "mediations",
        "localField": "_id",
        "foreignField": "g",
        "as": "mediations"
      }
    },
    { $unwind: '$mediations' },
    {
      $project: {
        _id: 0,
        game_name: "$n",
        game_url: "$u",
        mode: "$m",
        createdAt: 1,
        mediator: "$mediations.a",
        mediator_appid: "$mediations.i",
        appid: "$i",
        secret: "$mediations.s",
        platform: "$o",
        priority: "$mediations.n"
      }
    }
  ]).exec((err, rewards) => {
    if (err) { console.log(err); }
    console.log(rewards);
  });
}


// trewards();
function trewards() {
  id = "5e074dca1275775c11a1407d";
  const cond = { "p": mongoose.Types.ObjectId(id) };
  Log.aggregate([
    { "$match": {} },
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
    { "$unwind": "$trackers" },
    { $group: { _id: { platform: "$games.o", "game_name": "$games.n", "game_id": "$g", "reward": "$games.rwd" }, number: { $sum: "$trackers.rewards.rwd" } } },
    //   {$group:{_id: "$g", number:  { $sum : "$trackers.rewards.rwd"}}},



    {
      $project: {
        platform: "$_id.platform",
        date: "$_id.date",
        _id: 0,
        // id: "$_id",
        total: "$number",
        txId: "$_id.txId",
        reward: "$_id.reward",
        gameName: "$_id.game_name",
        gameId: "$_id.game_id",
        createdAt: "$_id.createdAt"
      }
    }

  ]).exec((err, ads) => {
    if (err) { console.log(err); }
    console.log(ads);
  });


  /**
   *  id = "5e074dca1275775c11a1407d";
  const cond = { "p": mongoose.Types.ObjectId(id) };

    Log.aggregate([
      { "$match":  cond  },
          {

    "$lookup": {
      "from": "games",
      "localField": "g",
      "foreignField": "_id",
      "as": "games"
    }
  },
  { $unwind: '$games' },
  /*
      { "$lookup": {
        "from": "mtrackers",
        "localField": "l",
      "foreignField": "_id",
       "as": "trackers"
      }},
      { "$unwind": "$trackers" },
       { $group: { _id: { platform: "$games.o", "game_name": "$games.n", "game_id": "$g", "reward": "$games.rwd" }, clicked: { $sum: "$trackers.e.o" }, failed: { $sum: "$trackers.e.f" }, loaded: { $sum: "$trackers.e.l" }, rewarded: { $sum: "$trackers.e.r" } } },

     {
      $project: {
        platform: "$_id.platform",
        date: "$_id.date",
        _id: 0,
        // id: "$_id",
        total: "$number",
        txId: "$_id.txId",
        reward: "$_id.reward",
        gameName: "$_id.game_name",
        gameId: "$_id.game_id",
        createdAt: "$_id.createdAt"
      }
    }
    ]).exec((err, ads) => {
      if (err) {  console.log(err); }
     console.log(ads);
    });
   */
}


function cb(err, rwds, rs) {
  console.log(err);
  console.log(rwds);
  //console.log(rs);
}
// tquery();
function tquery() {
  game_id = '5df32ef399e29603fca23582';
  u = 'ca-app-pub-3940256099942544/5224354917';
  AdUnit.findOne({ a: u }).exec((err, unit) => {
    Game.findById(game_id).exec((err, game) => {
      PubRwds.find({ p: game.p }).sort({ createdAt: -1 }).limit(1).exec((err, rwds) => {
        if (err || !rwds.length) { return cb('Game is out of fund', null, null); }
        MReward.find({ g: game_id }).sort({ createdAt: -1 }).exec((errS, rs) => {
          if (errS || !rs.length) { return cb('Game is out of fund', rwds, rs); }
          if (rwds[0].rwd > rs[0].rwd) {
            cb(null, rwds[0], rs[0]);
          } else {
            cb('R Game is out of fund', rwds[0], rs[0]);
          }
        });
      });
    });
  });
}



// createRWDS("5e074122514012346c6af970");
function createRWDS(p) {
  pubrwd = new PubRwds();
  pubrwd.t = p;
  pubrwd.p = p;
  pubrwd.i = 3456;
  pubrwd.rwd = 3456;
  pubrwd.save();
}

// createPubRwd("5df32ef399e29603fca23582");
function createPubRwd(game_id) {
  mrwd = new MReward();
  mrwd.g = game_id;
  mrwd.rwd = consts.app.rwd;
  mrwd.save();
}

function getGame() {
  let cond = {};
  Game.aggregate([
    { "$match": cond },
    {
      "$lookup": {
        "from": "mediations",
        "localField": "_id",
        "foreignField": "g",
        "as": "mediations"
      }
    },
    { $unwind: '$mediations' },
    {
      $project: {
        _id: 0,
        game_id: "$_id",
        name: "$n",
        mode: "$m",
        description: "$d",
        createdAt: 1,
        app_id: "$i",
        mediations_id: "$mediations._id",
        mediator: "$mediations.a",
        mediation_appid: "$mediations.i",
        mediation_secret: "$mediations.s"
      }
    }
  ]).exec((err, mediations) => {
    if (err) { console.log(err); }
    console.log(mediations);
  });
}

function createGame() {
  let req = { body: {}, payload: {} };
  req.body.platform = 'android';
  req.body.description = 'No descript';
  req.body.name = 'Test Game';
  req.payload._id = '5de65f77a36a770ad0e67ae3';
  req.body.mode = 'test';

  let game = new Game();
  game = consts.populateGame(req, game);
  game.p = mongoose.Types.ObjectId(req.payload._id);
  game.save(function (err) {
    console.log(err);
    console.log({
      "status": (!err)
    });
  });
}

//createGame();


/**
 *
 */
function newMediation() {

  let req = { body: {}, payload: {} };
  req.body.priority = 1;
  req.body.game = '5df32ef399e29603fca23582';
  req.body.mediator = 'admob';
  req.body.app_id = '5dd699e26c653809e6156cdb';
  req.body.app_secret = 'e7232cd0f255ea92070324fcca82d40543596cb5';
  req.body.url = '';
  req.body.mode = 'test';

  let res = {};
  res.status = console.log;
  res.json = console.log;

  const fields = ['game', 'priority', 'mode', 'mediator', 'app_id', 'app_secret'];
  const err = 'Mediation Ad server, Platform, App id And App secret are required';
  if (consts.validateRequest(req, res, fields, err)) {
    const mediation = new Mediation();
    mediation.a = req.body.mediator;
    mediation.o = req.body.platform;
    mediation.i = req.body.app_id;
    mediation.s = req.body.app_secret;
    mediation.n = req.body.priority;
    mediation.u = req.body.url;
    mediation.m = req.body.mode;
    mediation.g = mongoose.Types.ObjectId(req.body.game);
    mediation.save(function (err) {
      console.log({
        "status": (!err)
      });

    });
  }
}

// newAdUnit();

function newAdUnit() {
  let req = { body: {}, payload: {} };
  req.body.priority = 1;
  req.body.mediation_id = '5df3325c9e12bb23d4e90e50';
  req.body.adUnit = 'ca-app-pub-3940256099942544/5224354917';

  let res = {};
  res.status = console.log;
  res.json = console.log;

  const fields = ['priority', 'adUnit', 'mediation_id'];
  const err = 'AdUnit, priority and Mediation id are required';
  if (consts.validateRequest(req, res, fields, err)) {
    const adUnit = new AdUnit();
    adUnit.m = req.body.mediation_id;
    adUnit.a = req.body.adUnit;
    adUnit.p = req.body.priority;
    adUnit.save(function (err) {
      res.status(200);
      res.json({
        "status": (!err)
      });

    });
  }
}

// newAdUnit();
// getAds();
function getAds() {
  let req = { body: {}, payload: {} };
  // req.body.app_id = '3cb2e435a6db4ae9928e97943f6a1085e5e82d24ac70b15f8dab0b656ed87b68';
  req.body.app_id = '310cf80defb9a8081c03b3a05cfdc59f3ce52b34403bd7fe62f8033a57d2f52a';

  id = "5df5e6b91275775c119e3ac9";
  let cond = { "i": req.body.app_id };

  Game.aggregate([
    { "$match": cond },
    {
      "$lookup": {
        "from": "mediations",
        "localField": "g",
        "foreignField": "_id.str",
        "as": "mediations"
      }
    },
    { $unwind: '$mediations' },
    {
      $project: {
        _id: 0,
        mode: "$m",
        xappid: "$mediations.i",
        adserver: "$mediations.a",
        xunit: "$mediations.u",
        appid: {
          $cond: {
            if: { $eq: ["test", "$m"] },
            then: consts.admobTestAdUnit.appId,
            else: "$mediations.i"
          }
        },
        unit: {
          $cond: {
            if: { $eq: ["test", "$m"] },
            then: consts.admobTestAdUnit.unit,
            else: "$mediations.u"
          }
        },
        secret: "$mediations.s"
      }
    }

  ]).exec((err, ads) => {
    if (err) { console.log(err); }
    console.log(ads);
  });


}


/**
app_id = '3cb2e435a6db4ae9928e97943f6a1085e5e82d24ac70b15f8dab0b656ed87b68';
let cond = { "i": app_id };
let date_ob = new Date();
console.log(date_ob);

date_ob = new Date();
console.log(date_ob);
*/

/**
 * APP_ID
 *
 */
/*
 app_id = '3cb2e435a6db4ae9928e97943f6a1085e5e82d24ac70b15f8dab0b656ed87b68';
 cond = { "i": app_id };


  Game.aggregate([
  { "$match":  cond  },
  // { "$sort": { "p": 1, "adunits.p": 1 } },
  { "$lookup": {
    "from": "mediations",
    "let": { "g": "$_id" },
    "pipeline": [
      { "$match": { "$expr": { "$eq": ["$g", "$$g"]  }}},
      { "$lookup": {
        "from": "adunits",
        "let": { "m": "$_id" },
        "pipeline": [
          { "$match": { "$expr": { "$eq": ["$m", "$$m"] }}}
        ],
        "as": "units"
      }},
     { "$unwind": "$units" }
    ],
    "as": "mediations"
  }},
  { "$unwind": "$mediations" },
  {
    $project: {
      _id: 0,
      mode: "$m",
      appid: "$mediations.i",
      adserver: "$mediations.a",
      unit: {
        $cond: {
           if: { $eq: [ "test", "$m" ] },
           then: consts.getAdmobTestAdUnit,
           else: "$mediations.units.a"
        }
     },
      secret: "$mediations.s"
    }
  }
]).exec((err, ads) => {
  console.log(ads);
  console.log(err);
  console.log("OOOhoo");
  if (err) {  console.log({err: 'wrong'}); }
  console.log({ads: ads});
});
*/


// getA();
function getA() {
  id = '5e072c4b4bc9a41e243dc5a7';
  status = false;
  let cond = { "p": mongoose.Types.ObjectId(id) };
  cond = {};
  // cond = { "p": mongoose.Types.ObjectId('5e074dca1275775c11a1407d') };

  let tmatch = { "$match": { "$expr": { "$eq": ["$l", "$$l"] } } };

  if (status) {
    tmatch = { "$match": { "$expr": { "$and": [{ "$eq": ["$l", "$$l"] }, { "$eq": ["$s", status] }] } } };
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
    { $unwind: '$logs' },

    {
      "$lookup": {
        "from": "mtrackers",
        "let": { "l": "$logs._id" },
        "pipeline": [
          tmatch,
          //  { "$match": { "$expr": { "$and": [ {"$eq": ["$l", "$$l"] } , {"$eq": ["$s", status]} ]} } },
          //  { "$match": { "$expr": { "$eq": ["$l", "$$l"] } } },
          {
            "$lookup": {
              "from": "rewards",
              "let": { "t": "$_id" },
              "pipeline": [
                {
                  "$match": {
                    "$expr": {
                      "$and": [
                        { "$eq": ["$t", "$$t"] },
                        //                { "$gte": [ "$createdAt", startDate ] },
                        //               { "$lt": [ "$createdAt", endDate ] }
                      ]
                    }
                  }
                }
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
    // group,
    // project
  ]).exec((err, ads) => {
    console.log(err);
    console.log("OOOhoo");
    if (err) { console.log({ err: 'wrong' }); }
    console.log(ads);
  });


}
// const {google} = require('googleapis');

/**
const REDIRECT_URL = 'https://developers.google.com/oauthplayground';
const CLIENT_ID = '737425481133-dbq3o6m2jkf9di7hvc2jsnmif208gdgu.apps.googleusercontent.com';
const CLIENT_SECRET = 'F-FFyp_vFWsA4zC_iFBTnf1z';
const admob = require('../i/admob');
const STORED_REFRESH_TOKEN = '1//04dQQAjGtfhUfCgYIARAAGAQSNwF-L9IrNcwmeesBdyenGRdFptXJacpCf1F-jvsey3i8Kt6_W0B4FfrxMPzphB9fdnCmZM4HME4';
const publisher_id = 'pub-3624249148694235';

const cb1 = (err, res) =>{

  if(err){
    console.log("error7777");
    console.log(err);
  }else{
  console.log("Response");
  console.log(res.data);
}
};
const startDate = 'today';
const endDate = 'today';
const adUnit = 'ca-app-pub-3624249148694235/9948361183';
 const adsense = admob.getAdsenseApiClient(CLIENT_ID, CLIENT_SECRET, STORED_REFRESH_TOKEN);
admob.getAdmobAccount(adsense,publisher_id, cb1);
 admob.getAdmobAdunit(adsense, publisher_id, adsense, adUnit, cb1);
 admob.getAdmobReport(adsense, publisher_id,CLIENT_ID, adUnit, startDate, endDate, cb1);



let oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

const STORED_REFRESH_TOKEN = '01//04dQQAjGtfhUfCgYIARAAGAQSNwF-L9IrNcwmeesBdyenGRdFptXJacpCf1F-jvsey3i8Kt6_W0B4FfrxMPzphB9fdnCmZM4HME4';

oauth2Client.setCredentials({
  refresh_token: STORED_REFRESH_TOKEN
});

const adsense = google.adsense({
  version: 'v1.4',
  auth: oauth2Client
});
const params = {
  accountId: 'pub-3624249148694235'
};

//
adsense.accounts.get(params, (err, res) => {
  if (err) {
    console.log('err');
    console.log(err);
   // throw err;
  }
 if(res){
    console.log(res.data);
 }
});
*/
// rwtest();
function rwtest() {
  // cond = { "p": mongoose.Types.ObjectId('5e074dca1275775c11a1407d') };
  cond = {};
  from = '2018-01-13';
  to = '2020-01-14';
  createdAt = {
    "$gte": new Date(from + "T00:00:00.000Z"),
    "$lt": new Date(to + "T23:59:59.999Z")
  };

  startDate = new Date(from + "T00:00:00.000Z");
  endDate = new Date(to + "T23:59:59.999Z");

  //cond = {"trackers.createdAt" : createdAt};

  cond = {};
  console.log(cond);
  group = { $group: { _id: { date: "$createdAt", platform: "$o", game_name: "$n", game_id: "$_id", reward: "$rwd" }, rewards: { $sum: "$trackers.rewards.rwd" }, date: { $addToSet: "$createdAt" } } };
  project = {
    $project: {
      _id: 0,
      game_name: "$_id.game_name",
      platform: "$_id.platform",
      reward: "$_id.reward",
      rewards: "$rewards",
      date: "$date",
      game_id: "$_id.game_id"
    }
  };
  let cb = (err, rewards) => {
    if (err) { console.log(err); }
    console.log(rewards);
  };
  consts.getGameRewards(Game, cond, startDate, endDate, project, group, cb);

}

// rwtest();
/*
const mnemonic = 'memory expire desk kitchen digital obey crouch slot pony bachelor theme divide';
var hdkey = require("ethereumjs-wallet/hdkey");
var bip39 = require("bip39");
var path = "m/44'/60'/0'/0/5de65f77a36a770ad0e67ae3";

bip39.mnemonicToSeed(mnemonic).then((mnm)=>{
//console.log(mnm);
console.log('-----____-----');
const hdwallet = hdkey.fromMasterSeed(mnm);
const wallet = hdwallet.derivePath(path).getWallet();
var address = "0x" + wallet.getAddress().toString("hex");

console.log(address);

}).catch(console.log);

/*
var hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
var wallet = hdwallet.derivePath(path).getWallet();
var address = "0x" + wallet.getAddress().toString("hex");

console.log(address);

*/

function getDate(plus, num) {
  if (plus) {
    return new Date(new Date().getTime() + num * 60 * 60 * 24 * 1000);
  } else {
    return new Date(new Date() - num * 60 * 60 * 24 * 1000);
  }
}
/**
fgame = new FGame();
fgame.g = '';
fgame.s = getDate(false, 1);
fgame.e = getDate(true, 7);

fgame.save(

  (err) => {
    if (err) {
      console.log(err);
    } else {
      fg();
    }
  }
);
*/
//fg();
function fg() {

  cond = {
    s: {
      "$lt": new Date()
    },
    e: {
      "$gt": new Date()
    }
  };
  Game.aggregate([
    { "$sort": { "games.rwd": 1 } },
    { "$limit": 2 },

    {
      $project: {
        _id: 0,
        id: "$_id",
        name: "$n",
        platform: "$o",
        rewards: "$rwd",
        app_id: "$i",
        started: "$createdAt"
      }
    }
  ]).exec((err, games) => {
    if (err) { console.log(err); }
    console.log(games);
  });

}
// rewardslog();
function rewardslog() {
  from = '2017-12-12';
  to = '2020-01-17';
  id = '5e074122514012346c6af970';
  // cond = { "p": mongoose.Types.ObjectId(id) };
  cond = {};
  startDate = new Date(from + "T00:00:00.000Z");
  endDate = new Date(to + "T23:59:59.999Z");
  console.log(startDate);
  console.log(endDate);
  let status = false;
  if (status === 'pending') {
    status = 'p';
  } else if (status === 'inprogress') {
    status = 'i';
  } else if (status === 'paid') {
    status = 'r';
  } else if (status === 'disputed') {
    status = 'd';
  }
  group = { $group: { _id: { date: "$trackers.rewards.createdAt", platform: "$o", game_name: "$n", game_id: "$_id", reward: "$trackers.rewards.rwd", status: "$trackers.s", tx_id: "$trackers.rewards.tx" }, rewards: { $sum: "$trackers.rewards.rwd" } } };
  project = {
    $project: {
      _id: 0,
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
      reward: "$_id.reward",
      tx_id: "$_id.tx_id",
      createdAt: "$_id.date",
    }
  };



  let cb = (err, rewards) => {
    if (err) { console.log(err); }
    console.log(rewards);
  };
  consts.getGameRewards(Game, status, cond, startDate, endDate, project, group, cb);


}

bln();
function bln() {
  addr = '0xa07284f85eec197ace35b4d7b7f897572afb14f8';
  //proj = { from: "f", f: 1, to: "$t", value: "$v", transactionHash: "$th", blockNumber: "$bn", blockHash: "bh" };
  ///cond = { $or: [{ t: { $regex: new RegExp(addr, "i") } }, { f: { $regex: new RegExp(addr, "i") } }] };

  cond = {};

  tcb = (err, block) => {
    if (err) {
      console.log("Down");
      return false;
    }
    if (block[0]) {
      console.log(block[0].bn);
    }
  };

  // get max block number  from transfers.
  // get transfer event for blocknum + 1
  // process transactions
  // save transactions in db

  // process transaction
  // get current balance of user
  // add balance to pubrwds if not already added

  group = {
    $group: {
      _id: 0, to: "$t", value: "$v", transactionHash: "$th", blockNumber: "$bn", blockHash: "bh"
    }
  };

  PubRwds.find(cond).sort({ createdAt: -1 }).limit(1).exec(
    (err, balances) => {

      if (err) {
        console.log(err);
        return;
      }
      let balance = 0;
      if (balances[0]) {
        balance = balances[0];
      }
      console.log(balance);
      rwds = new PubRwds();
      rwds.in = 0;
      rwds.rwd = rwds.rwd;
      //  rwds.t =
      rwds.save();

    });




  }
cond = {};

PubRwds.aggregate([
  { "$match": cond },
  /*
  {
    $group: {
      _id: {date: "$createdAt", credit: "$i", debit: "$o", txId: "$t"},
      out: { $sum: "$o" },
      in: { $sum: "$i" },
      total: { $sum: { $sum: { $subtract: [ "$i", "$o" ] } }},
    }
  },
  */
   {
    $project: {
    date: "$createdAt", credit: "$i", debit: "$0",
    balance: { $cond: { if: "$i", then: { $sum: "$i" }, else: { $sum: { $subtract: [ "$i", "$o" ] } } } },
     txId: "$t"
    }
  }
]).exec((err, transactions) => {
  if (err) {
    console.log(err);
  }
  console.log(transactions);
});




logs find game

login time
logout time

track

loaded
rewarded
failed
requests


 id = "5e54cf9063596234cb867140";
  const cond = { "p": mongoose.Types.ObjectId(id) };

cond = { "p": id };
    Game.aggregate([
      { "$match":  cond  },
          {

    "$lookup": {
      "from": "mlogs",
      "localField": "_id",
      "foreignField": "g",
      "as": "logs"
    }
  },
  { $unwind: "$logs" },

      { "$lookup": {
        "from": "mtrackers",
         "let": { "l": "$logs._id" },
       "pipeline": [
	   { "$match": { "$expr": { "$eq": ["$l", "$$l"] } } }
	   ],
       "as": "trackers"
      }},
      { "$unwind": "$trackers" },
       { $group: { _id: { platform: "$o", "game_name": "$n", "game_id": "$g", "reward": "$trackers.e" }, clicked: { $sum: "$trackers.e.o" }, requests: { $sum: "$trackers.createdAt" }, failed: { $sum: "$trackers.e.f" }, loaded: { $sum: "$trackers.e.l" }, rewarded: { $sum: "$trackers.e.r" } } },

     {
      $project: {
        platform: "$_id.platform",
        date: "$_id.date",
        gameName: "$_id.game_name",
        gameId: "$_id.game_id",
        createdAt: "$_id.createdAt"
      }
    }
    ]).exec((err, ads) => {
      if (err) {  console.log(err); }
     console.log(ads);
    });
