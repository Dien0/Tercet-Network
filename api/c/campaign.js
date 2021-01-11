const mongoose = require('mongoose');
const Campaign = mongoose.model('Campaign');
const CTracker = mongoose.model('CTracker');
const Game = mongoose.model('Game');
const PubRwds = mongoose.model('PubRwds');
const cons = require('../i/c');


/**
 *
 * Creating campaign
 * deducting balance
 */

exports.createCampaign = (req, res) => {
    const fields = ['game', 'status', 'media', 'daily_budget', 'budget', 'reward'];
    const err = 'Game, Status, video media, daily budget and budget are required';
    if (cons.validateRequest(req, res, fields, err)) {

        Game.find({ _id: req.body.game, p: req.payload._id }).exec(
            (err, game) => {
                if (game.length) {
                    cb = (err, pubrwd) => {
                        if (err) {
                            return res.status(401).json({ err: 'No balance', data: { status: false } });
                        }
                        campaign = new Campaign();
                        campaign.b = req.body.budget;
                        campaign.d = req.body.daily_budget;
                        campaign.u = req.body.media;
                        campaign.g = req.body.game;
                        campaign.r = req.body.reward;
                        campaign.s = req.body.status.charAt(0);
                        campaign.save(err, doc => {
                            if (err | doc) {
                                return res.status(401).json({ err: doc, data: { status: false } });
                            }

                            PubRwds.findOneAndUpdate(
                                {
                                    _id: pubrwd._id  // search query
                                },
                                {
                                    tid: campaign._id   // field:values to update
                                },
                                {
                                    new: true,                       // return updated doc
                                    runValidators: true              // validate before update
                                },
                                (err, doc => {
                                    if (err) {
                                        res.status(401).json({ err: 'No balance', data: { status: false } });
                                    } else {
                                        res.status(200).json({ err: null, data: { status: true } });
                                    }
                                }));
                        });

                    };
                    cons.deduct(req.payload._id, req.body.budget, req.body.game, PubRwds, cb);
                } else {
                    res.status(401).json({ err: 'No balance', data: { status: false } });

                }

            }
        );

    }

};

module.exports.getCampaignsTransByPublisherId = function (req, res) {
    let cond = { "p": mongoose.Types.ObjectId(req.payload._id) };
    Game.aggregate([
        { "$match": cond },
        // { "$sort": { "p": 1, "adunits.p": 1 } },
        {
            "$lookup": {
                "from": "campaigns",
                "localField": "_id",
                "foreignField": "g",
                "as": "campaigns"
            }
        },
        { "$unwind": "$campaigns" },
        {
            "$lookup": {
                "from": "ctrackers",
                "let": { "c": "$campaigns._id" },
                "pipeline": [
                    { "$match": { "$expr": { "$eq": ["$c", "$$c"] } } },
                    {
                        "$lookup": {
                            "from": "rewards",
                            "let": { "t": "$_id" },
                            "pipeline": [
                                { "$match": { "$expr": { "$eq": ["$t", "$$t"] } } },
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
        group = { $group: { _id: { date: "$trackers.rewards.createdAt", platform: "$o", game_name: "$n", game_id: "$_id", reward: "$trackers.rewards.rwd", status: "$trackers.rewards.s", tx_id: "$trackers.rewards.tx" }, rewards: { $sum: "$trackers.rewards.rwd" } } },
        {
            $project: {
                _id: 0,
                date: "$_id.date",
                game_name: "$_id.game_name",
                platform: "$_id.platform",
                reward: "$_id.reward",
                tx_id: "$_id.tx_id"

            }
        }
    ]).exec((err, ads) => {
        if (err) { res.status(401).json({ err: 'Sorry', data: null }); }
        res.status(200).json({ err: null, data: ads });
    });

};

module.exports.getCampaignsListByPublisherId = function (req, res) {
    let cond = { "p": mongoose.Types.ObjectId(req.payload._id) };
    // console.log(cond);
    Game.aggregate([
        { "$match": cond },
        // { "$sort": { "p": 1, "adunits.p": 1 } },
        {
            "$lookup": {
                "from": "campaigns",
                "localField": "_id",
                "foreignField": "g",
                "as": "campaigns"
            }
        },
        { "$unwind": "$campaigns" },
        {
            $project: {
                _id: 0,
                reward: "$campaigns.r",
                game_name: "$n",
                campaign_id: "$campaigns._id",
                status: "$campaigns.s",
                media: "$campaigns.u",
                daily_budget: "$campaigns.d",
                budget: "$campaigns.b"
            }
        }
    ]).exec((err, ads) => {
        if (err) { res.status(401).json({ err: 'Sorry', data: null }); }
        res.status(200).json({ err: null, data: ads });
    });
};


exports.loadAd = (req, res) => {
    const fields = ['appid'];
    const err = 'Campaign id is required';
    if (cons.validateRequest(req, res, fields, err)) {
        cb1 = (err, game) => {
            if ((err)) {
               return res.status(400).json({err: err});
            }

        cb = (err, doc1) => {
            let conds = { s: 'a' };
            let id = 0;
            //  console.log(doc1);
            if ((doc1) && doc1.length && doc1[0].e.r) {
                id = doc1[0]._id;
                conds = { _id: { $gt: id }, s: 'a', g: {$ne: game._id} };
            }
//            console.log(conds);
            Campaign.find(conds).sort({ _id: 1 }).limit(1).exec(
                (err, doc) => {
                    // console.log(err);
                    // console.log(doc);
                    let campaigns = [];
                    if (doc && doc.length) {
                        log = new CTracker();
                        log.p = req.payload._id;
                        log.c = doc[0]._id;
                        log.e = { l: new Date() };
                        log.save();
                        campaigns.push( { reward: doc[0].r, media: doc[0].u, campaign: doc[0]._id, csid: log._id });

                    }
                    res.status(200).json({ err: err, data: campaigns });

                }
            );
        };
        CTracker.find({
            p: req.payload._id
        }).sort({ _id: -1 }).limit(1).exec(cb);
    };
    Game.findOne({i: req.body.appid}, cb1);
    }
};

exports.track = (req, res) => {
    const fields = ['csid', 'e'];
    const err = 'Campaign id is required';

    evts = { start: 'o', stop: 'c', reward: 'r' };

    if (cons.validateRequest(req, res, fields, err)) {
        cond = { _id: req.body.csid, p: req.payload._id };
        fld = "e." + evts[req.body.e];
        update = { "$currentDate": { [fld]: true } };
        options = {};
        CTracker.findOneAndUpdate(cond, update, options, function (error, tracker) {
            if (error) {
                console.log(error);
                return res.status(400).json({ err: error, data: null });

            } else {
                return res.status(200).json({ err: error, data: { status: (tracker != null) } });

            }

        });

    }

};

