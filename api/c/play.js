const mongoose = require('mongoose');
const Tracker = mongoose.model('MTracker');
const Game = mongoose.model('Game');
const Log = mongoose.model('MLog');
const cons = require('../i/c');
const PubRwds = mongoose.model('PubRwds');
const Reward = mongoose.model('Reward');
const  request = require('request');
const Mediation = mongoose.model('Mediation');

const enc = require('../i/e');

/**
 *  Publisher balance
 */

exports.publisherBalance = (req, res) => {
data = [];


let balance = 0;
  PubRwds.find({p: req.payload._id}).sort({ _id : 1 }).exec(
    (err, trans) =>{
      if(trans){
        trans.forEach(tran => {
          balance += tran.i;
          balance -= tran.o;
          data.push({date: tran.createdAt, credit: tran.i, debit: tran.o, balance: balance, txId: tran.t});
        });
      }
      res.status(200).json({data: data.reverse(), err: err });
    }
  );

};

/**
 * SDK Initiated
 */

exports.initiateSDK = (req, res) => {

    const fields = ['app_id'];
    const err = 'App id is required';
    if (cons.validateRequest(req, res, fields, err)) {
        Game.findOne({i: req.body.app_id}).exec(
            (err, game) => {
                if (err){
                   return res.status(410).json({err: 'wrong'});
                }
                if (game){
                    log = new Log();
                    log.g = game._id;
                    log.p = req.payload._id;
                    log.e = { i: new Date() };
                    log.save(
                        (err) => {
                            res.status(200);
                            res.json({sid: log._id});
                        }
                    );
                }else{
                  res.status(401).json({err: "Something wrong"});
                }
            }
        );
    }

};


/**
 * SDK Destroyed
 */

exports.destroySDK = (req, res) => {
  const fields = ['sid'];
    const err = 'Session id is required';
    if (cons.validateRequest(req, res, fields, err)) {
      update = { "$currentDate": { 'e.o' : true } };
      Log.findByIdAndUpdate(req.body.sid, update, (err, log) => {
              if (err){
                 return res.status(410).json({err: 'wrong'});
              }
              res.status(200);
              res.json({sid: log._id});
          }
      );
        }
};


/**
 *  getMediationListByGame
 * appid, secret, unit if is admob
 *
 * [adserver, appid, secret, unit, mode]
 *
 */

module.exports.loadAds = function (req, res) {
  const fields = ['app_id', 'sid'];
  const err = 'App id and session id is required';
  console.log(req.body);

  if (cons.validateRequest(req, res, fields, err)) {

    let cond = { "i": req.body.app_id };

    Game.aggregate([
      { "$match": cond },
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
            sid: req.body.sid,
            mode: "$m",
            xappid: "$mediations.i",
            adserver: "$mediations.a",
            xunit: "$mediations.units.a",
            appid: {
              $cond: {
                 if: { $and: [{ $eq: [ "test", "$m" ]}, { $eq: [ "admob", "$a" ]} ] },
                 then: cons.admobTestAdUnit.appId,
                 else: "$mediations.i"
              }
           },
           type: {
            $cond: {
               if: { $eq: [ "i", "$mediations.units.t" ] },
               then: "Interstitial",
               else: "Rewarded"
            }
         },
           secret: { $ifNull: [ "$mediations.s", "" ] },
           placement: { $ifNull: [ "$mediations.units.p", "" ] },

            unit: {
              $cond: {
                if: { $and: [{ $eq: [ "test", "$m" ]}, { $eq: [ "admob", "$a" ]} ] },
                 then: cons.admobTestAdUnit.unit,
                 else: { $ifNull: [ "$mediations.units.a", "" ] },
              }
           },

          }
        }
      ]).exec((err, ads) => {
        console.log(ads);
        console.log(err);
        if (err) {  return res.status(410).json({err: 'wrong'}); }
        update = { $push:{ "$currentDate": { 'e.r' : true } }};
        Log.findByIdAndUpdate(req.body.sid, update, (err, log) => {
                if (err){
                   return res.status(410).json({err: 'wrong'});
                }
                res.status(200).json({ads: ads});
            }
        );


      });



  }
  };

/**
 * Track progress
 */

exports.trackProgress = (req, res) => {
console.log(req.body);
  const fields = ['sid', 'e', 'u'];
  const err = 'Session id is required';
  if (cons.validateRequest(req, res, fields, err)) {
    lcond = {_id: req.body.sid, p: req.payload._id};
    loptions = { new: true };

    Mediation.findOne({u: req.body.u}).exec((err, unit) => {
      if(!unit || req.body.u === cons.admobTestAdUnit){
       // return res.status(410).json({err: 'wrong', data: null});
      }
      lupdate = {u: req.body.u};
                Log.findOneAndUpdate(lcond, lupdate, loptions).exec(
          (err, log) => {
              if (err){
                console.log(err);
                 return res.status(410).json({err: 'wrong', data: null});
              }
              if (log){
                const options = { upsert: true,  new: true };
                cond = {l: log._id};
                fld = "e."+ req.body.e.charAt(0);
                update = { "$currentDate": { [fld] : true } };
                Tracker.findOneAndUpdate(cond, update, options, function (error, tracker) {
                  if (error) {
                    res.status(400).json({err: error, data: null});
                    return;
                  }
                  if (req.body.e.charAt(0) == 'r') {
                  const cb = (err, rwds, game) => {
                    console.log(err);
                      if (err !== null) {
                       res.status(401).json({
                          "err": err, data: null
                        });
                        return;
                      }

                      let prewards = new PubRwds();
                      prewards.p = rwds.p;
                      prewards.o = game.rwd;
                      prewards.t = tracker._id;
                      prewards.save(function (err) {
                        if (err) {
                          res.status(400).json({
                            "err": err, data: null
                          });
                          return;
                        }
                        let reward = new Reward();
                        reward.t = tracker._id;
                        reward.rwd = game.rwd;
                        reward.s = 'i';
                        reward.tx = req.body.sid;
                        reward.save(function (err) {
                          if (err) {
                            res.status(400).json({
                              "err": err, data: null
                            });
                            return;
                          }
                          res.status(200).json({err: null, data: true});
                        });

                      });

                    };
                    /**
                     * CB Created lets reward now
                     * */

                    cons.activeRewards(log.g, cb, Game, PubRwds);
                  }else{
                    res.status(200).json({err: null, data: true});
                  }
                });
              }else {
                res.status(401).json({err: "Something went wrong", data: null});
              }
          }
      );
  }
    );
}

};


/**
 * Verify Reward
 * http://localhost:3000/api/cb8897sas?ad_network=54...55&ad_unit=12345678&reward_amount=10&reward_item=coins
&timestamp=150777823&transaction_id=12...DEF&user_id=1234567&signature=ME...Z1c&key_id=1268887

 */

exports.activateReward = (req, res) => {

 const  i = req.url.indexOf('signature=');
 if (i == -1) {
res.status(401).json({});
return false;
}
//console.log(i);
const reqdata = req.url.substring(0, i - 1);


  const url = 'https://www.gstatic.com/admob/reward/verifier-keys.json';

  request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      //console.log(data.keys);
      data.keys.forEach(key => {
        if(enc.verifySign(key.base64, reqdata.replace('/cb8897sas?', ''), req.query.signature)){
// keys verified
console.log('Verified');

        }
      });
    }
});

};

