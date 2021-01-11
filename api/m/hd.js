require('../m/db');
/**
 * 0xa07284f85eec197ace35b4d7b7f897572afb14f8
 */
// const BigNumber = require('bignumber.js');
const mnemonic = 'memory expire desk kitchen digital obey crouch slot pony bachelor theme divide';
var hdkey = require("ethereumjs-wallet/hdkey");
var bip39 = require("bip39");
var path = "m/44'/60'/0'/0/5de65f77a36a770ad0e67ae3";
var Web3 = require("web3");
// var web3 = new Web3('ws://localhost:8546');
var web3 = new Web3(new Web3.providers.HttpProvider(
  'https://ropsten.infura.io/v3/6de2c68b12bb4fe4b8310a32ebf51b04'
));
bip39.mnemonicToSeed(mnemonic).then((mnm) => {
  //console.log(mnm);
  console.log('-----____-----');
  const hdwallet = hdkey.fromMasterSeed(mnm);
  const wallet = hdwallet.derivePath(path).getWallet();
  var address = "0x" + wallet.getAddress().toString("hex");

  if(address){
    console.log(address);
    return;
  }
  let tokenAddress = "0x050BF8922Ad892D71f0D583cE487f91114719b02";
  let walletAddress = address;
  /**
   *  balanceOf is mapping of uint256 at storage 0
    allowance is mapping of uint256 at storage 1
    totalSupply is uint256 at storage 2
    name is array of uint256 at storage 3
    symbol is array of uint256 at storage 4
    decimals is uint8 at storage 5
   */

  let tAbi = [
    {
      "indexed": true,
      "name": "from",
      "type": "address"
    },
    {
      "indexed": true,
      "name": "to",
      "type": "address"
    },
    {
      "indexed": false,
      "name": "value",
      "type": "uint256"
    }
  ];

  let bAbi = [{
    type: 'string',
    name: 'myString'
  }, {
    type: 'uint256',
    name: 'balanceOf',
    indexed: true
  }, {
    type: 'uint256',
    name: 'allowance',
    indexed: true
  }, {
    type: 'address',
    name: '_owner'
  }, {
    type: 'uint8',
    name: 'decimals',
    indexed: true
  }];
  // The minimum ABI to get ERC20 Token balance
  let minABI = [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_spender",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_from",
          "type": "address"
        },
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_from",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "burnFrom",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_spender",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        },
        {
          "name": "_extraData",
          "type": "bytes"
        }
      ],
      "name": "approveAndCall",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "initialSupply",
          "type": "uint256"
        },
        {
          "name": "tokenName",
          "type": "string"
        },
        {
          "name": "tokenSymbol",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "_owner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "_spender",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Burn",
      "type": "event"
    }
  ];

  transfers = {
    f: {
      type: String,
      required: true
    },
    t: {
      type: String,
      required: true
    },
    v: {
      type: Number,
      required: true
    },
    th: {
      type: String,
      required: true
    },
    bn: {
      type: Number,
      required: true
    },
    bh: {
      type: String,
      required: true
    }
  };
  const mongoose = require('mongoose');
const Transfer = mongoose.model('Transfer');

  // Get ERC20 Token contract instance
  // console.log(( new web3.eth.Contract(minABI)));
  let contract = new web3.eth.Contract(minABI, tokenAddress);
  contract.methods.balanceOf(walletAddress).call()
    .then((balance) => {
      contract.methods.decimals().call()
        .then((decimals) => {
          let x = new web3.utils.BN(balance);
          x = x.div(10 ** decimals);
          console.log(decimals);
          cb(null, x.toString());

        }).catch((err) => {
          cb(err, null);
        });
    }).catch(console.log);

  contract.getPastEvents("Transfer", { fromBlock: 2 })
    .then((logs) => {
      // console.log(logs[0].raw.topics);
      //console.log(web3.utils.hexToAscii(web3.utils.bytesToHex(logs[0].raw.data)));
      logs.forEach(log => {
        lg = web3.eth.abi.decodeLog(tAbi, log.raw.data, log.raw.topics); //.then(console.log).catch(console.log);
        console.log(log);

        let value = new BigNumber(log.returnValues.value);
        decimals = 18;
          value = parseFloat(value.div(10 ** decimals).toString());
         cond = {f: log.returnValues.from, t: log.returnValues.to, v: value, th: log.transactionHash};

        tr = {
          f: log.returnValues.from,
          t: log.returnValues.to,
          v: value,
          th: log.transactionHash,
          bn: log.blockNumber,
          bh: log.blockHash
        };
console.log(tr);
/*
        Transfer.updateOne(cond, tr, { upsert: true }, function (err, transfer) {
          if (err) {
            console.log(err);
          }
        });

        */
        // console.log(lg);
      });

    }).catch(console.log);


  // console.log();
  // Call balanceOf function
  /**
  contract.balanceOf(walletAddress, (error, balance) => {
    // Get decimals
    contract.decimals((error, decimals) => {
      // calculate a balance
      balance = balance.div(10**decimals);
      console.log(balance.toString());
    });
  });
  */
  console.log(address);
}).catch(console.log);


