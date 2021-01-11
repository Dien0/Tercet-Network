const {google} = require('googleapis');
const REDIRECT_URL = 'https://developers.google.com/oauthplayground';

const clientId = '478783424383-83kg46icr4gcjd48l0iap9j1v6krt9ki.apps.googleusercontent.com';
const clientSecret = 'dh3Bh9w9RygYcZeuxyk_0OH6';
const refreshToken = '1//04fT2MunuuMBOCgYIARAAGAQSNwF-L9IriFUMr7OCIbRjqQcg61BQjeSOtkACpCS5HAC6pZurRaZkVzdetVnde71EQMpcr_PahKY';

exports.getClient = function(clientId, clientSecret, refreshToken) {
const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    REDIRECT_URL
  );
  oauth2Client.setCredentials({
    refresh_token: refreshToken
  });

  return google.gmail({
    version: 'v1',
    auth: oauth2Client
  });
};

exports.getMessagesList = function(gmail, q, cb){
    const params = {
        userId: 'me',
         q: q
      };
      gmail.users.messages.list(params, (err, res) => {
        cb(err, res);
      });

};

exports.getMessage = function(gmail, id, cb){
    const params = {
        userId: 'me',
        id: id
      };
      gmail.users.messages.get(params, (err, res) => {
        cb(err, res);
      });

};

db.pubrwds.find({t: {$exists: true}}).forEach(function(obj) {
  obj.t =  "test no tx id";
  db.pubrwds.save(obj);
});

exports.delMessage(gmail, id, cb) {
    const params = {
        userId: 'me',
        id: id
      };
      gmail.users.messages.delete(params, (err, res) => {
        cb(err, res);
      });

};

exports.getAttachments = function(gmail, message, callback) {
    var parts = message.payload.parts;
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      if (part.filename && part.filename.length > 0) {
        var attachId = part.body.attachmentId;

        gmail.users.messages.attachments.get({
          'id': attachId,
          'messageId': message.id,
          'userId': 'me'
        }, (err, res) => {
            data = {filename: message.id+'_'+part.filename, mimeType: part.mimeType, response:res};
            callback(err, data);

        });

      }
    }
  };

  const fs = require("fs");
const PATH = 'D:\\lab\\test\\messa\\';

cb0 = (err, res) => {
 if(res.response){
    // console.log(res.response.data.data);
    console.log('res.filename');
    console.log(res.filename);
   console.log(res.mimeType);
   fs.stat(PATH + res.filename, function(err, stat) {
    if(err == null) {
        console.log('File exists');
    } else if(err.code === 'ENOENT') {
        // file does not exist
        fs.writeFile(PATH + res.filename, Buffer.from(res.response.data.data, "base64"), function(err) {});
    } else {
        console.log('Some other error: ', err.code);
    }
});



 }

};
cb = (err, res) => {

    if(res.data){
        if(res.data.payload){
           // console.log(res.data.payload.headers);
        }
        if(res.data.payload){
         //   console.log(res.data.labelIds);
         //   console.log(res.data.snippet);
//            delMessage(client, res.data.id, cb0);
            getAttachments(client, res.data, cb0);


    }
}
};

cb1 = (err, res) => {
   // console.log(err);
   // console.log(res);
    if(res.data){
      //  console.log(res.data);
        res.data.messages.forEach(msg => {

            getMessage(client, msg.id, cb);
        });
    }
};

callback = (err, data) =>{
// data.filename;
// data.mimeType;

};


const client = getClient(clientId, clientSecret, refreshToken);
// console.log(client);
getMessagesList(client, cb1);

