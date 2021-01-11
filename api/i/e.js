const EC = require('elliptic').ec;
const ec = new EC('curve25519');
const asn1 = require('asn1.js');
const BN = require('bn.js');
 /** Elliptic curve types.
 public enum CurveType {
    P256,
    P384,
    P521
  }
  */
 const p256 = new EC('p256');
 const p384 = new EC('p384');
 const p521 = new EC('p521');
 const EcdsaDerPub = asn1.define('ECPublicKey', function() {
    return this.seq().obj(
        this.key('r').int(),
        this.key('s').int()
    );
});

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

function concatPubToAsn1Pub(concatSigBuffer) {
    const r = new BN(concatSigBuffer.slice(0, 32).toString('hex'), 16, 'be');
    const s = new BN(concatSigBuffer.slice(32).toString('hex'), 16, 'be');
    return EcdsaDerPub.encode({r, s}, 'der');
}

exports.reverseString = function(str) {
    var newString = "";
    for (var i = str.length / 2; i >= 0; i--) {
        newString += str[i];
    }
    return newString;
};

exports.verifySign = (pub64, msg, signature) =>{
    let buff = new Buffer.from(pub64, 'base64');
    let pub = buff.toString('hex');
    var key = ec.keyFromPublic(pub, 'hex');
//console.log(key);


    var shaMsg = crypto.createHash('sha256').update(msg).digest();
    msgHash = Buffer.from(shaMsg);
    publ = Buffer.from(pub, 'hex');
//    verifier.update(msgHash);
   // const ver = verifier.verify(pub, signature,'base64');
   //
   sig  = Buffer.from(signature, 'utf-8');
   ver = key.verify(msgHash, concatPubToAsn1Pub(sig));
   console.log(ver);
    return ver;
};

exports.genRandomBytes = function(length){
    return crypto.randomBytes(length);
};

exports.genKeys = function(){
/*
    let sec = this.reverseString(this.genRandomBytes(32).toString('hex'));
 sec += this.reverseString(this.genRandomBytes(32).toString('hex'));
 sec += this.reverseString(this.genRandomBytes(64).toString('hex'));
    const key = ec.keyFromSecret(sec);
console.log(key.secret());
*/
const key = ec.genKeyPair();

    return {
        s:key.getPrivate().toString('hex'),
        i:key.getPublic().getX().toString('hex')
};
};

exports.encrypt = function(key, data){
    let cipher = crypto.createCipher(algorithm, Buffer.from(key));
    let crypted = cipher.update(data);
    crypted = Buffer.concat([crypted, cipher.final()]);
    return crypted;
};

exports.decrypt = function(key, encryptedData){
    let encryptedText = Buffer.from(encryptedData, 'hex');
    let decipher = crypto.createDecipher(algorithm, Buffer.from(key));
    let decrypted = decipher.update(encryptedText,'hex','utf8');
    return decrypted.toString();
};
