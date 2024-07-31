import { utils, providers, Wallet } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import {
  addCustomNetwork,
  L2Network,
  L2TransactionReceipt,
  L2ToL1MessageStatus,
} from "@arbitrum/sdk";
//import { arbLog, requireEnvVariables } from "arb-shared-dependencies";
import dotenv from "dotenv";
import { l2Network } from "../helpers/custom-network";


dotenv.config();
//requireEnvVariables(["DEVNET_PRIVKEY", "L1RPC", "L2RPC", "TOKEN_ADDRESS"]);

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
  // await arbLog("Deposit token using Arbitrum SDK");
  // register - needed for retryables
  addCustomNetwork({
    customL2Network: l2Network,
  });
  //Token withdrawal initiated! 🥳 0x9d5934fcc8e81aff01513bb538556628530683da95ce9b56413436b66e429299
  //Ether withdrawal initiated! 🥳 txHash: 0x430aed51521830ad1d256dc1049498d0eb31f9f4a2d49a94d0e7882fac558ee3
  //Tx initiated! 🥳 txHash: 0x2a849f6f107f78e5a6fe30724eabba1e71a008bd76fca6db96684f15d356fb46
  // 0x8f00de58994c7feb8354b98b1e2c17c184ea46185be96aa73b42462bf394f56b tx
  let txnHash= "0x2a849f6f107f78e5a6fe30724eabba1e71a008bd76fca6db96684f15d356fb46" 


  const receipt = await l2Provider.getTransactionReceipt(txnHash)

  const l2Receipt = new L2TransactionReceipt(receipt)


  const messages = await l2Receipt.getL2ToL1Messages(l1Wallet)
  const l2ToL1Msg = messages[0]

  if ((await l2ToL1Msg.status(l2Provider)) == L2ToL1MessageStatus.EXECUTED) {
    console.log(`Message already executed! Nothing else to do here`)
    process.exit(1)
  }

 //console.log(await l2ToL1Msg.status(hre.ethers.provider))
 const timeToWaitMs = 1000 * 60
 console.log(
   "Waiting for the outbox entry to be created. This only happens when the L2 block is confirmed on L1, ~1 week after it's creation on Mainnet."
 )
 await l2ToL1Msg.waitUntilReadyToExecute(l2Provider, timeToWaitMs)
 console.log('Outbox entry exists! Trying to execute now')
 const res = await l2ToL1Msg.execute(l2Provider)

  const rec = await res.wait()
  console.log('Done! Your transaction is executed', rec)

};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
