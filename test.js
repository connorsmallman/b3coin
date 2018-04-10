import Blockchain, { Transaction } from './main';

const b3Coin = new Blockchain();

b3Coin.createTransaction(new Transaction('address1', 'address2', 100));
b3Coin.createTransaction(new Transaction('address2', 'address1', 50));

b3Coin.minePendingTransactions('new-address');