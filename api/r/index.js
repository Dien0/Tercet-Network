const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const consts = require('../i/c');

const auth = jwt({
  secret: consts.app.secret,
  userProperty: 'payload'
});
const permissions = require('../i/p');
// [SH] Bring in the data model
require('../m/db');
// [SH] Bring in the Passport config after model is defined

require('../i/passport');
require('../i/passport-setup');

const passport = require('passport');

const ctrlAuth = require('../c/auth');
//Google Authantication
const ctrlGAuth = require('../c/gauth');
const ctrlPlay = require('../c/play');
const ctrlPlayer = require('../c/player');
const ctrlGame = require('../c/game');
const ctrlCamp = require('../c/campaign');
const ctrlMed = require('../c/mediation');
const ctrlUnit = require('../c/mediation-units');
const ctrlBlockChain = require('../c/bct');

router.post('/login', ctrlAuth.login);

/** Google Authantication creates new player */
router.get('/auth-success', ctrlAuth.glogin);
router.post('/auth/verify', ctrlGAuth.login);



// publisher
var ctrlPublisher = require('../c/publisher');
router.post('/publisher/create', ctrlPublisher.register);
router.get('/publisher/profile', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlPublisher.profileRead);
router.get('/publisher/balance', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlPlay.publisherBalance);
router.get('/publisher/wallet/address', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlPublisher.walletAddress);
router.get('/publisher/wallet/refresh', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlBlockChain.refreshWallet);
router.get('/processTX', ctrlBlockChain.processTransactions);


router.post('/login', ctrlAuth.login);
router.post('/changePassword', auth, ctrlAuth.changePassword);
router.post('/resetPassword', ctrlAuth.resetPassword);

// Advertiser
router.post('/advertiser/campaign/create', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlCamp.createCampaign);
router.get('/advertiser/campaign/list', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlCamp.getCampaignsListByPublisherId);
router.get('/advertiser/campaign/activity', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlCamp.getCampaignsTransByPublisherId);

router.post('/ad/request', [auth, permissions.permit(consts.typePlayer.TYPE)], ctrlCamp.loadAd);
router.post('/ad/track', [auth, permissions.permit(consts.typePlayer.TYPE)], ctrlCamp.track);



// Game
router.post('/publisher/game/create', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlGame.gameCreate);
router.put('/publisher/game/:game_id/update', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlGame.gameUpdate);
router.get('/game/:game_id', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlGame.getGameByPublisher);

router.delete('/publisher/game/:game_id/delete', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlGame.gameDelete);
router.get('/publisher/game/list', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlGame.getGameListByPublisher);
router.get('/publisher/game/activity', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlGame.getGameActivityByPublisher);
router.get('/publisher/game/stat', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlGame.getGameStatForPublisher);
router.get('/publisher/player/list', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlGame.getGamePlayerListByPublisher);
router.get('/publisher/reward/:status', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlGame.getGameRewardListByPublisher);


// Mediation
router.post('/publisher/mediation/create', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlMed.createMediation);
router.put('/publisher/mediation/:mediation_id/update', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlMed.update);
router.get('/mediation/:mediation_id', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlMed.getMediation);
router.delete('/publisher/mediation/:mediation_id/delete', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlMed.delete);
router.get('/publisher/mediation/list', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlMed.getMediationListByPublisher);

//Ad units
router.post('/publisher/adUnit/create', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlUnit.createAdUnit);
router.put('/publisher/adUnit/:unit_id/update', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlUnit.update);
router.get('/adUnit/:unit_id', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlUnit.adUnit);
router.delete('/publisher/adUnit/:unit_id/delete', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlUnit.adUnitDelete);
router.get('/publisher/adUnit/list', [auth, permissions.permit(consts.typePublisher.TYPE)], ctrlUnit.getMediationAddListByPublisherId);


// Ad List

router.post('/ads', [auth, permissions.permit(consts.typePlayer.TYPE)], ctrlPlay.loadAds);
router.post('/track', [auth, permissions.permit(consts.typePlayer.TYPE)], ctrlPlay.trackProgress);


// Player

router.post('/player/start', [auth, permissions.permit(consts.typePlayer.TYPE)], ctrlPlay.initiateSDK);
router.post('/player/end', [auth, permissions.permit(consts.typePlayer.TYPE)], ctrlPlay.destroySDK);
router.get('/player/profile', [auth, permissions.permit(consts.typePlayer.TYPE)], ctrlPlayer.profileRead);
router.get('/player/reward/list', [auth, permissions.permit(consts.typePlayer.TYPE)], ctrlPlayer.rewardsList);
router.get('/player/game/stat', [auth, permissions.permit(consts.typePlayer.TYPE)], ctrlPlayer.gameStat);
router.get('/player/top/games', [auth, permissions.permit(consts.typePlayer.TYPE)], ctrlGame.getTopPayingGames);
router.get('/player/featured/games', [auth, permissions.permit(consts.typePlayer.TYPE)], ctrlGame.getFeaturedGames);

// router.get('/dbg', ctrlGame.getFeaturedGames);


// ############# GOOGLE AUTHENTICATION ################
// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback

router.get('/auth/google/:appid/', function(request, response) {
  passport.authenticate('google', {
    scope:
    [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    state: `${request.params.appid}`
  })(request, response);
});

module.exports = router;
