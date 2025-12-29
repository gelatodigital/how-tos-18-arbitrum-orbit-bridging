import { providers, Wallet } from "ethers";

import {
 registerCustomArbitrumNetwork, 
  ChildTransactionReceipt,
  ChildToParentMessageStatus,
} from "@arbitrum/sdk";

import dotenv from "dotenv";
import { fluenceNetwork as childNetwork} from "../helpers/custom-network-fluence";
dotenv.config();
//requireEnvVariables(["DEVNET_PRIVKEY", "ParentRPC", "ChildRPC", "TOKEN_ADDRESS"]);

console.log("Environment Variables Loaded");

/**
 * Set up: instantiate Parent / Child wallets connected to providers
 */
const walletPrivateKey: string = process.env.DEVNET_PRIVKEY as string;

const parentProvider = new providers.JsonRpcProvider(process.env.ParentRPC);
const childProvider = new providers.JsonRpcProvider(process.env.ChildRPC);
const parentWallet = new Wallet(walletPrivateKey, parentProvider);
const childWallet = new Wallet(walletPrivateKey, childProvider);

const main = async () => {
  // await arbLog("Deposit token using Arbitrum SDK");
  // register - needed for retryables
  registerCustomArbitrumNetwork(childNetwork);

  let txnHash= "0xce35fc3c3c78c95d807cc4bf45fa491e67778bd59cc4fc5227b0d5793e552054"


  const receipt = await childProvider.getTransactionReceipt(txnHash)

  const childReceipt = new ChildTransactionReceipt(receipt)


  const messages = await childReceipt.getChildToParentMessages(parentWallet)
  const childToParentMsg = messages[0]

  if ((await childToParentMsg.status(childProvider)) == ChildToParentMessageStatus.EXECUTED) {
    console.log(`Message already executed! Nothing else to do here`)
    process.exit(1)
  }

 //console.log(await childToParentMsg.status(hre.ethers.provider))
 const timeToWaitMs = 1000 * 60
 console.log(
   "Waiting for the outbox entry to be created. This only happens when the Child block is confirmed on Parent, ~1 week after it's creation on Mainnet."
 )
 await childToParentMsg.waitUntilReadyToExecute(childProvider, timeToWaitMs)
 console.log('Outbox entry exists! Trying to execute now')


 const res = await childToParentMsg.execute(childProvider)

  const rec = await res.wait()
  console.log('Done! Your transaction is executed', rec)

};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
