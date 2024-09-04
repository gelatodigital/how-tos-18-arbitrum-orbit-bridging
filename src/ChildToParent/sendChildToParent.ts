import { utils, providers, Wallet, BigNumber, Contract } from "ethers";
import { EthBridger, registerCustomArbitrumNetwork } from "@arbitrum/sdk";

import dotenv from "dotenv";

import { ARB_SYS_ADDRESS } from "@arbitrum/sdk/dist/lib/dataEntities/constants";
import { novastroNetwork as childNetwork } from "../helpers/custom-network-novastro";
dotenv.config();

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
  // register - needed for retryables
  registerCustomArbitrumNetwork(childNetwork);

  const counter = "0xEEeBe2F778AA186e88dCf2FEb8f8231565769C27";
  const abi = ["function increment()"];
  const iface = new utils.Interface(abi);
  const calldata = iface.encodeFunctionData("increment");

  const ethBridger = new EthBridger(childNetwork);
  const inboxAddress = ethBridger.childNetwork.ethBridge.inbox;

  const arbSysAbi = [
    "function sendTxToL1(address destination, bytes calldata data) external payable returns (uint256)",
  ];

  const arbSysContract = new Contract(ARB_SYS_ADDRESS, arbSysAbi, childWallet);

  let { data } = await arbSysContract.populateTransaction.sendTxToL1(
    counter,
    calldata
  );

  const depositTx = await parentWallet.sendTransaction({
    to: ARB_SYS_ADDRESS,
    data,
    gasLimit: 8000000,
  });

  let rec = await depositTx.wait();
  console.log(`Tx initiated! 🥳 txHash: ${rec.transactionHash}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
