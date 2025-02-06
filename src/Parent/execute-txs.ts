import { providers, Wallet } from "ethers";

import {
 registerCustomArbitrumNetwork, 
  ChildTransactionReceipt,
  ChildToParentMessageStatus,
} from "@arbitrum/sdk";

import dotenv from "dotenv";
import {fluenceNetwork as childNetwork} from "../helpers/custom-network-fluence"; 


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

  let txnHash= "0xf49ee64bb3bdeb1bba05ce21f343512c7d50696087aff1ca600b58944d06d276"//"0xfd1e52e5db6b0227e9c0efa74dc5f7af3cf35061a199488187deae5bf4d6642d"//"0x0f8cc7933d6943db34427c82a406ee009fe41078daa46aef1c95bda861331308"//"0x86cc4b3157dd5fba34dd8f50008f18b9ba54b432cc002797a724cb42dcfaac49" 


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


//  const res = await childToParentMsg.execute(childProvider)

//   const rec = await res.wait()
//   console.log('Done! Your transaction is executed', rec)

};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
