const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress,toAddress,amount)
    {
        this.fromAddress=fromAddress;
        this.toAddress=toAddress;
        this.amount=amount;
    }
}

class Block {
    constructor(timestamp,transactions,previousHash='') {

        this.timestamp=timestamp;
        this.transactions=transactions;

        this.nonce=0;

        this.previousHash=previousHash;

        this.hash= this.calculateHash();

    }

    calculateHash() {
         return SHA256(this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce).toString();  
                 //JSON.stringify() is used to convert a JS object/array into a string to be sent into web server.
         
    }

    mineBlock() {
        while(this.hash.substring(0,4)!="0000"){
            this.nonce++;
            this.hash=this.calculateHash();
        }

        console.log("Block mined: "+this.hash);
    }
}


class BlockChain {
    
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.createGenesisBlock().mineBlock();
        this.pendingTransactions = [];
        this.miningReward = 1;
    }

    createGenesisBlock() {
        let x = new Block('08-07-22','First block of the chain','0');
        x.mineBlock();
        return x;

    }
    
    getLatestBlock() {
        return this.chain[this.chain.length-1];
    }
    
    addBlock(newBlock) {
        newBlock.previousHash= this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock();  
        this.chain.push(newBlock);
    }

    isChainValid() {
        for(let i=1;i<this.chain.length;i++)
        {
            let currentBlock = this.chain[i];
            let previousBlock = this.chain[i-1];


            if(currentBlock.previousHash!==previousBlock.hash)
            {return false;}

            if(currentBlock.hash!==currentBlock.calculateHash())
            {return false;}
        }
        return true;
    }
}


let DogeCoin = new BlockChain();

DogeCoin.addBlock(new Block('09-07-22','Second Block'));
DogeCoin.addBlock(new Block('10-07-22','Third Block'));
DogeCoin.addBlock(new Block('11-07-22','Fourth Block'));
DogeCoin.addBlock(new Block('12-07-22','Fifth Block'));

console.log(JSON.stringify(DogeCoin,null,6));

console.log(`Is BlockChain valid? `+ DogeCoin.isChainValid());

DogeCoin.chain[2].data="2nd Block";

console.log(`After updating block 2, Is BlockChain valid? `+ DogeCoin.isChainValid());


// console.log(DogeCoin);