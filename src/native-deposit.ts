import { utils, providers, Wallet } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import {
  Erc20Bridger,
  EthBridger,
  L1ToL2MessageStatus,
  EthDepositStatus,
  addCustomNetwork,
  L2Network,
  addDefaultLocalNetwork,
} from "@arbitrum/sdk";
//import { arbLog, requireEnvVariables } from "arb-shared-dependencies";
import dotenv from "dotenv";
import { l2Network } from "./helpers/custom-network";
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

  let bal1 = await l1Provider

  console.log()
  // register - needed for retryables
  addCustomNetwork({
    customL2Network: l2Network,
  });

  const ethToL2DepositAmount = utils.parseEther("0.001");
  console.log("Eth deposit amount is:", ethToL2DepositAmount.toString());

  // Set up the Erc20Bridger
  const ethBridger = new EthBridger(l2Network);
  const approveTx = await ethBridger.approveGasToken({
    l1Signer: l1Wallet
  });
  const approveRec = await approveTx.wait();

  console.log("Eth Bridger Set Up");
  //   console.log(ethBridger);

  const l2WalletInitialEthBalance = await l2Wallet.getBalance();
  const result = utils.formatEther(l2WalletInitialEthBalance);

  console.log(`your L1 ETH balance is ${result.toString()}`);

  // Optional transaction overrides
  const overrides = {
    gasLimit: 2000000, // Example gas limit
  };

  // Create the deposit parameters object
  const depositParams = {
    l1Signer: l1Wallet,
    amount: ethToL2DepositAmount,
    overrides: overrides, // This is optional
  };

  const depositTx = await ethBridger.deposit(depositParams);

  const depositRec = await depositTx.wait();
  console.warn("deposit L1 receipt is:", depositRec.transactionHash);

  /**
   * With the transaction confirmed on L1, we now wait for the L2 side (i.e., balance credited to L2) to be confirmed as well.
   * Here we're waiting for the Sequencer to include the L2 message in its off-chain queue. The Sequencer should include it in under 10 minutes.
   */
  console.warn("Now we wait for L2 side of the transaction to be executed ⏳");
  const l2Result = await depositRec.waitForL2(l2Provider);
  /**
   * The `complete` boolean tells us if the l1 to l2 message was successful
   */
  l2Result.complete
    ? console.log(
        `L2 message successful: status: ${
          EthDepositStatus[await l2Result.message.status()]
        }`
      )
    : console.log(
        `L2 message failed: status ${
          EthDepositStatus[await l2Result.message.status()]
        }`
      );

  /**
   * Our l2Wallet ETH balance should be updated now
   */
  const l2WalletUpdatedEthBalance = await l2Wallet.getBalance();
  console.log(
    `your L2 ETH balance is updated from ${l2WalletInitialEthBalance.toString()} to ${l2WalletUpdatedEthBalance.toString()}`
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
