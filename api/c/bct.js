const blockChain = require("../i/bc");
require('../m/db');
const consts = require('../i/c');
const mongoose = require('mongoose');
const PubRwds = mongoose.model('PubRwds');
const User = mongoose.model('User');
const Wallet = require("ethereumjs-wallet");
const masterAddress = '0x19A88E27B584f7e20a6Bb3554d66f5afbdcC8d14';
const gPrivKey = '3eaf2fe85f7deb7e8f8ebfe93c657617a6b851720b8050c7212a65cd97743aee';
const gWallet = Wallet.fromPrivateKey(Buffer.from(gPrivKey, 'hex'));

exports.refreshWallet = (req, res) => {
    id = req.payload._id;
    const callBack = (err, balance) => {
        if (err) {
            res.status(401).json({ data: null, err: err });
        }
        if (!balance) {
            res.status(401).json({ data: null, err: err });
        } else {
            cb = (err, result) => {
                if (err) {
                    res.status(200).json({ data: { status: false }, err: err });
                } else {
                    res.status(401).json({ data: { status: result }, err: null });
                }
            };
            setBalance(balance, cb);
        }
    };
    cond = { "p": mongoose.Types.ObjectId(id) };
    consts.getPublisherBalance(PubRwds, cond, callBack);

};

exports.processTransactions = (req, res) => {
    const cbc = (err, contract) => {
        if (err) {
            res.status(401).json({ data: null, err: err });
            return;
        }
        console.log('Got Contract');

        const cb = (err, transactions) => {
            if (!transactions.length || err) {
                res.status(304).json({ data: { status: false }, err: err });
                return;
            }

            transaction = transactions[0];
            let txs = [];

            transactions.forEach(transaction => {
                txs.push(transaction.th);
            });

            cbw = (err, wallet) => {
                if (wallet) {
                    cbb = (err, balance) => {
                        if (balance > 1) {
                            tcb = (err, hash) => {
                                if (hash) {

                                    PubRwds.updateMany({ p: transaction.p, t: {$in: txs} }, { $set: { c: true } }, (err, trans) => {
                                        res.status(200).json({ data: { process: true }, err: err });

                                    });
                                } else res.status(200).json({ data: { process: true }, err: err });

                            };

                            blockChain.send(wallet, masterAddress, balance, contract, tcb);
                        } else res.status(200).json({ data: { process: balance }, err: err });


                    };
                    blockChain.getBalance(contract, blockChain.parseAddress(wallet), cbb);

                }
            };

            wallet = getWallet(transaction.p, cbw);

        };
        consts.pendingTransactions(PubRwds, cb);

    };

    blockChain.getContract(cbc);
};

function getWallet(pubid, callBack) {

    User.find({ _id: { $lte: pubid } }).countDocuments((err, pos) => {
        if (err) {
            return false;
        }
        blockChain.getWallet(pos, callBack);


    });
}


function setBalance(balance, cb) {
    const cb1 = (err, transactions) => {
        if (err) {
            cb(err, null);
            return;
        }
        if (!transactions.length) {
            cb(err, null);
            return;
        }
        transactions.forEach(transaction => {
            gcb = (err, hash) => {
                if (err) {
                    cb(err, null);
                    return;
                }
                pubrwd = new PubRwds();
                pubrwd.t = transaction.th;
                pubrwd.p = balance.p;
                pubrwd.i = transaction.v;
                pubrwd.b = transaction.bn;
                pubrwd.c = false;
                if (hash) {
                    pubrwd.hash = hash;
                }
                pubrwd.save();
                if (transactions[transactions.length - 1] === transaction) {
                    cb(err, pubrwd._id);
                    return;
                }
            };
            blockChain.fillGas(gWallet, transaction.t, gcb);

        });

    };


    const CB = (err, contract) => {
        if (err) {
            res.status(401).json({ data: null, err: err });
            return;
        }
        console.log('Got Contract');

        cb0 = (err, wallet) => {
            if (!wallet) {
                console.log(err);
                console.log('No Wallet Selected');
            }
            console.log('got wallet');
            if (err) {
                res.status(401).json({ data: null, err: err });

            }
            blockChain.getNewConfirmTransactions(contract, blockChain.parseAddress(wallet), (balance.b + 1), cb1);
        };

        getWallet(balance.p, cb0);
    };

    blockChain.getContract(CB);
}

