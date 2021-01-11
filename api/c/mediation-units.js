const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const AdUnit = mongoose.model('AdUnit');
const cons = require('../i/c');



exports.adUnit = (req, res) => {
  AdUnit.findById(req.params.unit_id).exec((err, au) => {
    console.log(err);
    console.log(au);
    let type = "rewarded";
     if (au.t === 'i'){
      type = "interstitial";
     }

     let adUnit = null;
     let placement = null;

     if (au.a){
      adUnit = au.a;
     }

     if (au.p){
      placement = au.p;
     }

    aunit = { adUnit: adUnit, placement: placement, type: type, mediator_id: au.m };
    console.log(aunit);
    res.status(200).json({ "data": aunit, "error": err });
  });


  cond = { "p": mongoose.Types.ObjectId(req.payload._id) };

  console.log(req.params.unit_id);

  console.log('*******************');
/**
  Game.aggregate([
    { "$match": cond },
    // { "$sort": { "p": 1, "adunits.p": 1 } },
    {
      "$lookup": {
        "from": "mediations",
        "let": { "g": "$_id" },
        "pipeline": [
          { "$match": { "$expr": { "$eq": ["$g", "$$g"] } } },
          {
            "$lookup": {
              "from": "adunits",
              "let": { "m": "$_id" },
              "pipeline": [
                { "$match": { "$expr": { "$eq": ["$m", "$$m"] } } }
              ],
              "as": "units"
            }
          },
          { "$unwind": "$units" }
        ],
        "as": "mediations"
      }
    },
    { "$unwind": "$mediations" },
    {
      $project: {
        _id: 0,
        mode: "$m",
        game_name: "$n",
        platform: "$o",
        appid: "$mediations.i",
        secret: "$mediations.s",
        mediator: "$mediations.a",
        placement: "$mediations.units.p",
        type: {
          $switch:
          {
            branches: [
              {
                case: { $eq: ["$mediations.units.t", "i"] },
                then: "Interstitial"
              },
              {
                case: { $eq: ["$mediations.units.t", "r"] },
                then: "Rewarded"
              },
              {
                case: { $eq: ["$mediations.units.t", "p"] },
                then: "Playable"
              },
              {
                case: { $eq: ["$mediations.units.t", "o"] },
                then: "Offer Wall"
              },

            ],
            default: "Rewarded"
          }
        },
        unit: "$mediations.units.a",
        unit_id: "$mediations.units._id"

      }
    }
  ]).exec((err, ads) => {
    let ad = {};
    if (err) { res.status(401).json({ err: 'Sorry', data: null }); }
    res.status(200).json({ err: null, data: ads });
  });
*/

};
exports.createAdUnit = (req, res) => {
  const fields = ['mediator_id', 'type'];
  const err = 'Mediation id is required';

  if (cons.validateRequest(req, res, fields, err)) {
    const adUnit = new AdUnit();
    adUnit.m = req.body.mediator_id;
    if (req.body.adUnit) {
      adUnit.a = req.body.adUnit;
    }
    if (req.body.placement) {
      adUnit.p = req.body.placement;
    }
    adUnit.t = req.body.type.charAt(0);
    adUnit.save(function (err) {
      console.log(err);
      res.status(200);
      res.json({
        "status": (!err)
      });

    });
  }
};

/**
     * The getAdUnitListByPublisherId method returns a list of adUnits
     * for an publisher, or returns an error message.
     *
     */

module.exports.getMediationAddListByPublisherId = function (req, res) {
  cond = { "p": mongoose.Types.ObjectId(req.payload._id) };

  Game.aggregate([
    { "$match": cond },
    // { "$sort": { "p": 1, "adunits.p": 1 } },
    {
      "$lookup": {
        "from": "mediations",
        "let": { "g": "$_id" },
        "pipeline": [
          { "$match": { "$expr": { "$eq": ["$g", "$$g"] } } },
          {
            "$lookup": {
              "from": "adunits",
              "let": { "m": "$_id" },
              "pipeline": [
                { "$match": { "$expr": { "$eq": ["$m", "$$m"] } } }
              ],
              "as": "units"
            }
          },
          { "$unwind": "$units" }
        ],
        "as": "mediations"
      }
    },
    { "$unwind": "$mediations" },
    {
      $project: {
        _id: 0,
        mode: "$m",
        game_name: "$n",
        platform: "$o",
        appid: "$mediations.i",
        secret: "$mediations.s",
        mediator: "$mediations.a",
        placement: "$mediations.units.p",
        rewarded: "$mediations.units.r",
        unit: "$mediations.units.a",
        unit_id: "$mediations.units._id"

      }
    }
  ]).exec((err, ads) => {

    if (err) { res.status(401).json({ err: 'Sorry', data: null }); }
    res.status(200).json({ err: null, data: ads });
  });
};

module.exports.getAdUnitListByMediationId = function (req, res) {
  const fields = ['mediation_id'];
  const err = 'Mediation id is required';
  if (cons.validateRequest(req, res, fields, err)) {
    const filters = { sort: { p: 1 } };
    const cond = { "m": mongoose.Types.ObjectId(req.body.mediation_id) };
    AdUnit
      .find(cond, filters)
      .exec(function (err, adUnits) {
        res.status(200).json({ "data": adUnits, "error": err });
      });
  }
};

module.exports.getMediationAddListByGameId = function (req, res) {
  let cond = { "p": mongoose.Types.ObjectId(req.body.game_id) };

  Mediation.aggregate([
    { "$match": { cond } },
    { "$sort": { "p": 1 } },
    {
      "$lookup": {
        "from": "mu",
        "localField": "m",
        "foreignField": "_id",
        "as": "adunits"
      }
    }
  ]).exec((err, ads) => {
    if (err) { res.status(401).json(err); }
    res.status(200).json(ads);
  });
};


// adUnit delete verify if user is permited
module.exports.adUnitDelete = function (req, res) {
  if (!req.body.ad_unit) {
    res.status(400);
    res.json({
      "error": "All fields required"
    });
    return;
  }
  AdUnit.findOneAndRemove({ _id: req.body.ad_unit }, function (err, adUnit) {
    res.status(200);
    res.json({
      "status": (adUnit),
      "error": err
    });
  });

};

/**
 * Update Mediation priorities
 */
module.exports.update = function (req, res) {
  if (!req.body.ad_units) {
    res.status(400);
    res.json({
      "error": "All fields required"
    });
    return;
  }



  res.status(200);
  res.json({
    "status": true
  });
};


