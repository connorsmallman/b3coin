
import SHA256 from 'crypto-js/sha256';

export class Transaction{
  constructor(fromAddress, toAddress, amount){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, data, previousHash = '') {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(`${this.index}${this.previousHash}${this.timestamp}${JSON.stringify(this.data)}${this.nonce}`).toString();
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`BLOCK MINED: ${this.hash}`);
  }
}

export default class Blockchain{
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block(0, '01/01/2018', 'Genesis block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++){
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  minePendingTransactions(miningRewardAddress) {
    const block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  getBalanceOfAddress(address){
    let balance = 0;

    for (const block of this.chain){
      for (const trans of block.transactions){
        if (trans.fromAddress === address){
          balance -= trans.amount;
        }

        if (trans.toAddress === address){
          balance += trans.amount;
        }
      }
    }

    return balance;
  }
}

