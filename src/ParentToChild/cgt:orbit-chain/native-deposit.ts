import { utils, providers, Wallet } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import {
  EthBridger,
  registerCustomArbitrumNetwork,
  EthDepositMessageStatus,
} from "@arbitrum/sdk";
//import { arbLog, requireEnvVariables } from "arb-shared-dependencies";
import dotenv from "dotenv";
import { synfuturesTestnetNetwork as childNetwork} from "../../helpers/custom-network-synfutures-testnet"; 
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
  // register - needed for retryables
  registerCustomArbitrumNetwork(childNetwork);

  const ethToChildDepositAmount = utils.parseEther("10088.999");
  console.log("Eth deposit amount is:", ethToChildDepositAmount.toString());

  // Set up the Erc20Bridger
  const ethBridger = new EthBridger(childNetwork);
  const approveTx = await ethBridger.approveGasToken({
    parentSigner: parentWallet,
  });
  const approveRec = await approveTx.wait();

  console.log("Eth Bridger Set Up");
  //   console.log(ethBridger);

  const childWalletInitialEthBalance = await childWallet.getBalance();
  const result = utils.formatEther(childWalletInitialEthBalance);

  console.log(`your Child ETH balance is ${result.toString()}`);

  // Optional transaction overrides
  const overrides = {
    gasLimit: 2000000, // Example gas limit
  };

  // Create the deposit parameters object
  const depositParams = {
    parentSigner: parentWallet,
    amount: ethToChildDepositAmount,
    overrides: overrides, // This is optional
  };

  const depositTx = await ethBridger.deposit(depositParams);

  const depositRec = await depositTx.wait();
  console.warn("deposit Parent receipt is:", depositRec.transactionHash);

  /**
   * With the transaction confirmed on Parent, we now wait for the Child side (i.e., balance credited to Child) to be confirmed as well.
   * Here we're waiting for the Sequencer to include the Child message in its off-chain queue. The Sequencer should include it in under 10 minutes.
   */
  console.warn(
    "Now we wait for Child side of the transaction to be executed ⏳"
  );
  const childResult = await depositRec.waitForChildTransactionReceipt(
    childProvider
  );
  /**
   * The `complete` boolean tells us if the parent to child message was successful
   */
  childResult.complete
    ? console.log(
        `Child message successful: status: ${
          EthDepositMessageStatus[await childResult.message.status()]
        }`
      )
    : console.log(
        `Child message failed: status ${
          EthDepositMessageStatus[await childResult.message.status()]
        }`
      );

  /**
   * Our childWallet ETH balance should be updated now
   */
  const childWalletUpdatedEthBalance = await childWallet.getBalance();
  console.log(
    `your Child ETH balance is updated from ${childWalletInitialEthBalance.toString()} to ${childWalletUpdatedEthBalance.toString()}`
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
