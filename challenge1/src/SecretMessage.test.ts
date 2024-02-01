import { Add } from './SecretMessage';
import { Field, Mina, PrivateKey, PublicKey, AccountUpdate } from 'o1js';

/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

let proofsEnabled = false;

describe('Add', () => {
  let deployerAccount: PublicKey,
    deployerKey: PrivateKey,
    senderAccount: PublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: Add;

  beforeAll(async () => {
    if (proofsEnabled) await Add.compile();
  });

  beforeEach(() => {
    const Local = Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    ({ privateKey: deployerKey, publicKey: deployerAccount } =
      Local.testAccounts[0]);
    ({ privateKey: senderKey, publicKey: senderAccount } =
      Local.testAccounts[1]);
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new Add(zkAppAddress);
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      zkApp.deploy();
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  it('generates and deploys the `Add` smart contract', async () => {
    await localDeploy();
    //const num = zkApp.num.get();
    const counter = zkApp.counter.get();
    //expect(num).toEqual(Field(1));
    expect(counter).toEqual(Field(0));
  });

  it('correctly updates the num state on the `Add` smart contract', async () => {
    await localDeploy();

    // update transaction
    const txn = await Mina.transaction(senderAccount, () => {
      //zkApp.update();
      zkApp.addValidMessage();
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    // const updatedNum = zkApp.num.get();
    // expect(updatedNum).toEqual(Field(3));
    const updatedCounter = zkApp.counter.get();
    expect(updatedCounter).toEqual(Field(1));
  });

  it('should allow one address to submit one test message only', async () => {

  });

  it('should store eligible admin address only', async () => {
    //use merkle tree/map for storage
    //investigate height prop
  });

  it('should not allow more than 100 eligible admin addresses to be stored', async () => {
    //use merkle tree/map for storage with max height?
    //investigate height prop
  });

  it('should set all other flags in message to be false if flag 1 is false', async () => {
    
  });

  it('should set flag 3 to be true in message if flag 2 is true', async () => {
    
  });
  
  it('should set flag 5 and 6 to be true in message if flag 4 is true', async () => {
    
  });
});
