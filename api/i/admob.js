const {google} = require('googleapis');
const REDIRECT_URL = 'https://developers.google.com/oauthplayground';


exports.getAdsenseApiClient = function(clientId, clientSecret, refreshToken) {
const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    REDIRECT_URL
  );
  oauth2Client.setCredentials({
    refresh_token: refreshToken
  });

  return google.adsense({
    version: 'v1.4',
    auth: oauth2Client
  });
};

exports.getAdmobAccount = function(adsense, accountId, cb){
    const params = {
        accountId: accountId
      };
    adsense.accounts.get(params, (err, res) => {
        cb(err, res);
      });

};

exports.getAdmobAdunit = function(adsense, accountId, adClientId,adUnitId, cb){
    const params = {
        accountId: accountId,
        adClientId: adClientId,
        adUnitId: adUnitId
      };
    adsense.accounts.adunits.get(params, (err, res) => {
        cb(err, res);
      });

};

exports.getAdmobReport = function(adsense, accountId, adClientId, adUnitId,startDate, endDate, cb){
    const params = {
        accountId: accountId,
        metric: 'EARNINGS',
        dimensions: 'DATE',
        filter: 'AD_UNIT_ID=='+ adUnitId,
        startDate: startDate,
        endDate: endDate
      };
    adsense.accounts.reports.generate(params, (err, res) => {
        cb(err, res);
      });


};
