import { utils, providers, Wallet, BigNumber, Contract } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import {
  EthBridger,
  addCustomNetwork

} from "@arbitrum/sdk";
import {
  L1ToL2MessageStatus,
  L1TransactionReceipt

} from "@arbitrum/sdk";
import dotenv from "dotenv";

import { l2Network } from "../helpers/custom-network";

dotenv.config();

console.log("Environment Variables Loaded");

/**
 * Set up: instantiate L1 / L2 wallets connected to providers
 */
const walletPrivateKey: string = process.env.DEVNET_PRIVKEY as string;


const l1Provider = new providers.JsonRpcProvider(process.env.L1RPC);
const l2Provider = new providers.JsonRpcProvider(process.env.L2RPC);
const l1Wallet = new Wallet(walletPrivateKey, l1Provider);
const l2Wallet = new Wallet(walletPrivateKey, l2Provider);

const main = async () => {


  addCustomNetwork({
    customL2Network: l2Network,
  });
  const txnHash =
  "0xb9a8cda9eed9fdbf2ccfc4b64120e395b3adab48c2b9832323f474de0508db01";
  const receipt = await l1Provider.getTransactionReceipt(txnHash);

  const l1Receipt = new L1TransactionReceipt(receipt);



  const messages = await l1Receipt.getL1ToL2Messages(l2Wallet);
  const l1ToL2Msg = messages[0];
  
  // console.log(messages);

  // console.log(await l1ToL2Msg.status());
  //console.log(await l1ToL2Msg.getSuccessfulRedeem());
  // console.log(await l1ToL2Msg.getRetryableCreationReceipt());

  // // /**
  // //  * Check if already executed
  // //  */
  const status = await l1ToL2Msg.status();

console.log(status)

  console.log(L1ToL2MessageStatus.FUNDS_DEPOSITED_ON_L2)
  console.log(L1ToL2MessageStatus.REDEEMED)
  // console.log(status);
  if (status == L1ToL2MessageStatus.REDEEMED) {
    console.log(`Message already executed! Nothing else to do here`);
    process.exit(1);
  }

// // // /**
// // //  * Now that its confirmed and not executed, we can execute our message in its outbox entry.
// // //  */
const l2Tx = await l1ToL2Msg.redeem();
const rec = await l2Tx.waitForRedeem();
console.log(
  "The L2 side of your transaction is now executed 🥳 :",
  rec.transactionHash
);




};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
