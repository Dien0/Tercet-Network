const mongoose = require('mongoose');
const Mediation = mongoose.model('Mediation');
const AdUnit = mongoose.model('AdUnit');
const Game = mongoose.model('Game');
const cons = require('../i/c');

exports.createMediation = (req, res) => {
  const fields = ['game', 'mediator', 'app_id'];
  const err = 'Mediation Ad server, Platform, App id are required';
  if (cons.validateRequest(req, res, fields, err)) {
    const mediation = new Mediation();
      mediation.a = req.body.mediator;
      mediation.i = req.body.app_id;
      mediation.g = req.body.game;
      if(req.body.adunit_id){
        mediation.u = req.body.adunit_id;
      }
      if(req.body.app_secret){
        mediation.s = req.body.app_secret;
      }
      if(req.body.placement){
        mediation.p = req.body.placement;
      }

      mediation.save(
        (err) => {
          if (err) {
            res.status(401).json({ err: err, data: null });
          } else {
            res.status(200);
            res.json({
              data: { "status": true },
              err: err
            });
          }
        }
      );


  }
};


/**
 *  getMediationListByGame
 * app_id, secret, adUnit if is admob
 *
 */

module.exports.getMediationListByGame = function (req, res) {
  let cond = { "i": req.body.app_id };
  Mediation.aggregate([
    { "$match": cond },
    { $sort: { n: 1 } },
    {
      $project: {
        _id: 0,
        game_name: "$g",
        game_url: "$u",
        mode: "$m",
        createdAt: 1,
        mediation_id: "$_id",
        mediator: "$a",
        mediator_appid: "$i",
        appid: "$x",
        secret: "$s",
        placement: "$p",
        unit: "$u"
      }
    }
  ]).exec((err, mediations) => {
    if (err) { res.status(401).json(err); }
    res.status(200).json({ data: mediations, error: err });

  });
};



/**
     * The getMediationListByPublisherId method returns a list of mediations
     * for an publisher, or returns an error message.
     *
     */

module.exports.getMediationListByPublisher = function (req, res) {
  let cond = { "p": mongoose.Types.ObjectId(req.payload._id) };
  Game.aggregate([
    { "$match": cond },
    {
      "$lookup": {
        "from": "mediations",
        let: {
          g: "$_id"
        },
        pipeline: [
          { $match: {
              $expr: { $and: [
                  { $eq: [ "$g", "$$g" ] },
                  { $ne: [ "$a", "_default" ] }
              ] }
          } }
        ],
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
        mediator_id: "$mediations._id",
        mediator_appid: "$mediations.i",
        appid: "$i",
        secret: "$mediations.s",
        platform: "$o",
        placement: "$mediations.p",
        unit: "$mediations.u"
      }
    }
  ]).exec((err, mediations) => {
    console.log(err);
    console.log(mediations);
    if (err) { res.status(401).json(err); }
    res.status(200).json({ data: mediations, error: err });

  });
};

module.exports.getMediation = function (req, res) {
  let cond = { "p": mongoose.Types.ObjectId(req.payload._id) };
  Game.aggregate([
    { "$match": cond },
    {
      "$lookup": {
        "from": "mediations",
    //    "localField": "_id",
     //   "foreignField": "g",
        "as": "mediations",
        let: { gG: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$g', '$$gG'] },
                  { $eq: ['$_id', mongoose.Types.ObjectId(req.params.mediation_id)] },
                ]
              }
            }
          }
        ]
      }
    },
    { $unwind: '$mediations' },
   // {"$match":{"mediations._id": mongoose.Types.ObjectId(req.params.mid)}},
    {
      $project: {
        _id: 0,
        game_name: "$n",
        game: "$_id",
        mediator: "$mediations.a",
        mediator_id: "$mediations._id",
        app_id : "$mediations.i",
        client_secret: "$mediations.s",
        bundle_id: "$mediations.b",
        client_id: "$mediations.c",
        refresh_token: "$mediations.r",
        publisher_id: "$mediations.p",
        adunit_id: "$mediations.u",
        app_secret: "$mediations.s",
        placement: "$mediations.p"
      }
    }
  ]).exec((err, mediations) => {
    if (err) { res.status(401).json(err); } else {
    if(mediations[0]){
      mediations = mediations[0];
    }
      res.status(200).json({ data: mediations, error: err });
    }

  });
};


module.exports.getMediationListByPlatform = function (req, res) {
  const fields = ['game_name', 'platform'];
  const err = 'Game id is required';
  if (cons.validateRequest(req, res, fields, err)) {
    const filters = { sort: { p: 1 } };
    let cond = { "g": mongoose.Types.ObjectId(req.body.game_name), "o": req.body.platform };
    if (req.payload.user_type == consts.typeAdmin.TYPE) {
      cond = {};
    }
    Mediation
      .find(cond, filters)
      .exec(function (err, mediations) {
        res.status(200).json({ "data": mediations, "error": err });
      });
  }
};


// update if user is permited
module.exports.update = function (req, res) {
  const fields = [ 'game', 'mediator_id', 'app_id', 'mediator'];
  const err = 'Mediation Ad server, and App id is required';
  if (cons.validateRequest(req, res, fields, err)) {


      const cond = { "_id": mongoose.Types.ObjectId(req.body.mediator_id) , "g": mongoose.Types.ObjectId(req.body.game) };
      const update = { a: req.body.mediator, i: req.body.app_id};

      if (req.body.app_secret){
        update.s = req.body.app_secret;
      }

      if (req.body.placement){
        update.p = req.body.placement;
      }

      Mediation.findOneAndUpdate(cond, update, function (err, meds) {
        if (err) {
          return res.status(410).json({ err: err, data: { "status": false } });

        }
        res.status(200).json({ err: err, data: { "status": true } });
      });

  }

};

// delete verify if user is permited
module.exports.delete = function (req, res) {
  if (!req.params.mediation_id) {
    res.status(401);
    res.end();
    return;
  }

  Mediation.findById(req.params.mediation_id, (err, mediation) => {
    if (!mediation){
      res.status(200);
      res.json({
        "status": false,
        "error": 'internal error'
    });
    return;
    }
    let cond = { "_id": mediation.g, "p": mongoose.Types.ObjectId(req.payload._id) };

    Game.findOne(cond, function (err, game) {
      if (game) {

        cond = { "_id": mongoose.Types.ObjectId(req.params.mediation_id), "g": mongoose.Types.ObjectId(game._id) };

        Mediation.findOneAndDelete(cond, function (err, mediation) {
          AdUnit.findOneAndRemove({ m: req.params.mediation_id }, function (err, adUnit) {
            res.status(200);
            res.json({
                "status": (adUnit),
                "error": err
            });
        });

        });
      }

    });

  });
};



module.exports.getMediationAddListByGameId = function (req, res) {

  let cond = { "i": mongoose.Types.ObjectId(req.body.app_id) };

  Game.aggregate([
    { "$match": { cond } },
    { "$sort": { "p": 1, "adunits.p": 1 } },
    {
      "$lookup": {
        "from": "m",
        "localField": "g",
        "foreignField": "_id",
        "as": "mediations"
      }
    },
    { $unwind: '$mediations' },
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
