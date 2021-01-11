const Web3 = require("web3");
const fs = require('fs');
const tokenAddress = "0x050BF8922Ad892D71f0D583cE487f91114719b02";
const BigNumber = require('bignumber.js');
const web3 = new Web3(new Web3.providers.HttpProvider(
    'https://ropsten.infura.io/v3/6de2c68b12bb4fe4b8310a32ebf51b04'
));
const decimals = 18;
const pathABI = '../wallet/json/abi.json';
const rpath = require("path");
const mnemonic = 'memory expire desk kitchen digital obey crouch slot pony bachelor theme divide';
const hdkey = require("ethereumjs-wallet/hdkey");
const bip39 = require("bip39");
// const path = "m/44'/60'/999999999'/";
const self = this;
const Tx = require('ethereumjs-tx').Transaction;

exports.readFileJson = (fileName, cb) => {
    fs.readFile(fileName, 'utf8', function (err, data) {
        let obj = null;
        if (data) {
            obj = JSON.parse(data);
        }
        cb(err, obj);
    });
};

function getAddress(id, cb) {
    path = "m/44'/60'/0'/" + id;
   console.log(path);
    bip39.mnemonicToSeed(mnemonic).then((mnm) => {
        const hdwallet = hdkey.fromMasterSeed(mnm);
        const wallet = hdwallet.derivePath(path).getWallet();
        cb(null, "0x" + wallet.getAddress().toString("hex"));

    }).catch(err => {
        cb(null, err);
    });

}

exports.getAddress = (id, cb) => {
    getAddress(id, cb);
};

exports.parseAddress = (wallet) => {
    return "0x" + wallet.getAddress().toString("hex");
};

function send(wallet, addr, tamt, contract, nonce, cb) {
    amt = tamt;
    if (contract) {
        amt = 0;
    }
    waddr = "0x" + wallet.getAddress().toString("hex");
    gasPrice = 21000;//web3.eth.gasPrice;
    gasLimit = 3000000;
    rawTransaction = {
        "to": addr,
        "nonce": web3.utils.toHex(nonce),
        "gasPrice": web3.utils.toHex(gasPrice),
        "gasLimit": web3.utils.toHex(gasLimit),
        "from": waddr,
        "value": web3.utils.toHex(amt),
        "chainId": 3 //remember to change this
    };
    if (contract) {
        rawTransaction.to = tokenAddress;
        rawTransaction.data = contract.methods.transfer(addr, tamt).encodeABI();
    } else {
        rawTransaction.data = "0x";
    }
    privKey = Buffer.from(wallet.getPrivateKey(), 'hex');
    const tx = new Tx(rawTransaction, { chain: 'ropsten', hardfork: 'petersburg' });


    tx.sign(privKey);
    if (!tx.validate()) {
        console.log("not valid");
        console.log(tx.verifySignature());
        cb("err", null);
        return;
    }
    serializedTx = tx.serialize();
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        if (!err) {
            console.log('Txn Sent and hash is ' + hash);

            cb(null, hash);
        }
        else {
            console.log("error");
            console.error(err);
            cb(err, null);
        }
    });

}

exports.fillGas = (wallet, addr, cb) => {
    gas = 21000; // web3.eth.gasPrice
    callBack = (err, balance) => {
        if (err) {
            cb(err, false);
        }
        balance = new BigNumber(balance);
        if (balance < gas) {
            waddr = "0x" + wallet.getAddress().toString("hex");
            nonce = web3.eth.getTransactionCount(waddr, 'pending').then(nonce => {
                send(wallet, addr, balance, false, nonce, cb);
            });
        } else {
            console.log("NO Gas needed");
            cb(null, false);
        }
    };
    web3.eth.getBalance(addr, callBack);
};

exports.send = (wallet, addr, amt, contract, cb) => {
    waddr = "0x" + wallet.getAddress().toString("hex");
    nonce = web3.eth.getTransactionCount(waddr, 'pending').then(nonce => {
        send(wallet, addr, amt, contract, nonce, cb);
    });
};
exports.getWallet = (id, cb) => {
    bip39.mnemonicToSeed(mnemonic).then((mnm) => {
        hdwallet = hdkey.fromMasterSeed(mnm);
        path = "m/44'/60'/0'/" + id;
        cb(null, hdwallet.derivePath(path).getWallet());

    }).catch((err) => {
        cb(err, null);
    });

};

exports.getContract = (cb) => {

    cb1 = (err, doc) => {
        if (doc) {
            cb(null, new web3.eth.Contract(doc, tokenAddress));

        } else {
            cb(err, doc);
        }
    };

    self.readFileJson(rpath.resolve(__dirname, pathABI), cb1);

};

exports.getBalance = (contract, walletAddress, cb) => {
    contract.methods.decimals().call()
        .then((decimals) => {
            contract.methods.balanceOf(walletAddress).call()
                .then((balance) => {
                    let x = new BigNumber(balance);
                    x = x.div(10 ** decimals);
                    cb(null, balance);
                }).catch((err) => {
                    cb(err, null);
                });
        }).catch((err) => {
            cb(err, null);
        });
};

exports.transferToken = (contract, walletAddress, cb) => {
    contract.methods.decimals().call()
        .then((decimals) => {
            contract.methods.balanceOf(walletAddress).call()
                .then((balance) => {
                    let x = new BigNumber(balance);
                    x = x.div(10 ** decimals);
                    console.log(x.toString());
                    cb(null, balance);
                }).catch((err) => {
                    cb(err, null);
                });
        }).catch((err) => {
            cb(err, null);
        });
};

exports.getBlockNum = (cb) => {
    web3.eth.getBlockNumber(cb);
};

exports.getNewConfirmTransactions = (contract, addr, blk, cb) => {
    let filter = { fromBlock: blk };
    if (addr) {
        filter = { fromBlock: blk, filter: { to: addr } };
    }
    cb1 = (err, blockNumber) => {
        if (err) {
            cb(err, null);
        }
        trans = [];
        contract.getPastEvents("Transfer", filter)
            .then((logs) => {
                logs.forEach(log => {
                    if ((blockNumber - log.blockNumber) >= 3) {
                        let value = new BigNumber(log.returnValues.value);
                        value = parseFloat(value.div(10 ** decimals).toString());
                        trans.push({ f: log.returnValues.from, t: log.returnValues.to, v: value, th: log.transactionHash, bn: log.blockNumber });
                    }
                });
                cb(null, trans);
            }).catch((err) => {
                cb(err, trans);
            });
    };
    self.getBlockNum(cb1);
};
/*
blk = web3.eth.getBlockNumber((err, blk) =>{
console.log(blk);

if(err){
    process.exit(0);
}

addr = "0xB6Ac28c057FFb40731e588f61990e48a927a40CE";
web3.eth.getBalance(addr).then( (wei) => {

    balance = web3.utils.fromWei(wei, 'ether');
        console.log(balance + " ETH");

if(wei === '0'){
    console.log("check transaction");
    web3.eth.getTransactionCount(addr).then((num) =>{
console.log(num);
if(num === 0){
    console.log("No Transactions yet send ETH");
}
    }).catch(err =>{
        console.log(err);
    });
}
        console.log(wei); // instanceof BigNumber

});
});
*/


