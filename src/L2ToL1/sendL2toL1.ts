import { utils, providers, Wallet, BigNumber, Contract } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import {
  EthBridger,
  addCustomNetwork

} from "@arbitrum/sdk";

import dotenv from "dotenv";

import { ARB_SYS_ADDRESS } from "@arbitrum/sdk/dist/lib/dataEntities/constants";
import { l2Network } from "../helpers/custom-network-reya";
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



  // register - needed for retryables
  addCustomNetwork({
    customL2Network: l2Network,
  });

  const counter = "0xEEeBe2F778AA186e88dCf2FEb8f8231565769C27";
  const abi = ["function increment()"];
  const iface = new utils.Interface(abi);
  const calldata = iface.encodeFunctionData("increment");

  const ethBridger = new EthBridger(l2Network);
  const inboxAddress = ethBridger.l2Network.ethBridge.inbox;

  const arbSysAbi = ["function sendTxToL1(address destination, bytes calldata data) external payable returns (uint256)"]

  const arbSysContract = new Contract(
    ARB_SYS_ADDRESS,
    arbSysAbi,
    l2Wallet
  );

  let {data} = await arbSysContract.populateTransaction.sendTxToL1(counter,calldata) 
    



const depositTx = await l1Wallet.sendTransaction({
  to:ARB_SYS_ADDRESS,
  data,
  gasLimit:8000000,

})

  let rec = await depositTx.wait();
  console.log(`Tx initiated! 🥳 txHash: ${rec.transactionHash}`)


};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
