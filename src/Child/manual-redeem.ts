import { utils, providers, Wallet, BigNumber, Contract } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import {
  EthBridger,
registerCustomArbitrumNetwork

} from "@arbitrum/sdk";
import {
  ParentToChildMessageStatus,
  ParentTransactionReceipt

} from "@arbitrum/sdk";
import dotenv from "dotenv";

import { synfuturesTestnetNetwork as childNetwork} from "../helpers/custom-network-synfutures-testnet"; 

dotenv.config();

console.log("Environment Variables Loaded");

/**
 * Set up: instantiate Parent / Child wallets connected to providers
 */
const walletPrivateKey: string = process.env.DEVNET_PRIVKEY as string;


const parentProvider = new providers.JsonRpcProvider(process.env.ParentRPC);
const childProvider = new providers.JsonRpcProvider(process.env.ChildRPC);
const childWallet = new Wallet(walletPrivateKey, childProvider);

const main = async () => {


  registerCustomArbitrumNetwork(childNetwork);

  const txnHash =
  "0xf222768b0b3b3aa6dd57a45db66b4f5b9955336e8e2f749a954311c381791010";
  const receipt = await parentProvider.getTransactionReceipt(txnHash);

  const parentReceipt = new ParentTransactionReceipt(receipt);



  const messages = await parentReceipt.getParentToChildMessages(childWallet);
  const parentToChildMsg = messages[0];
  


  /**
   * Check if already executed
   */
  const status = await parentToChildMsg.status();



  console.log(ParentToChildMessageStatus.FUNDS_DEPOSITED_ON_CHILD)
  console.log(ParentToChildMessageStatus.REDEEMED)
  // console.log(status);
  if (status == ParentToChildMessageStatus.REDEEMED) {
    console.log(`Message already executed! Nothing else to do here`);
    process.exit(1);
  }

// // // /**
// // //  * Now that its confirmed and not executed, we can execute our message in its outbox entry.
// // //  */
const childTx = await parentToChildMsg.redeem();
const rec = await childTx.waitForRedeem();
console.log(
  "The Child side of your transaction is now executed 🥳 :",
  rec.transactionHash
);




};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
