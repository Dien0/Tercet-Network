const nodemailer = require('nodemailer');

module.exports = class Mailer {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'youremail@gmail.com',
              pass: 'yourpassword'
            }
          });
    }
    send(mailOptions){
        this.transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              //console.log(error);
            } else {
              //console.log('Email sent: ' + info.response);
            }
          });
    }
    sendTextMail(from, to, subject, textContents) {
        let mailOptions = {
            from: from,
            to: to,
            subject: subject,
            text: textContents
          };
          this.send(mailOptions);
       }
    sendHtmlMail(from,to, subject, htmlContents) {
        let mailOptions = {
            from: from,
            to: to,
            subject: subject,
            html: htmlContents
          };
          this.send(mailOptions);
        }
};