import { utils, providers, Wallet } from "ethers";
import {
  EthBridger,
 registerCustomArbitrumNetwork
} from "@arbitrum/sdk";
//import { arbLog, requireEnvVariables } from "arb-shared-dependencies";
import dotenv from "dotenv";
import { parseEther } from "ethers/lib/utils";
import { synfuturesTestnetNetwork as childNetwork } from "../helpers/custom-network-synfutures-testnet";

dotenv.config();
//requireEnvVariables(["DEVNET_PRIVKEY", "ParentRPC", "ChildRPC", "TOKEN_ADDRESS"]);

console.log("Environment Variables Loaded");

/**
 * Set up: instantiate Parent / Child wallets connected to providers
 */
const walletPrivateKey: string = process.env.DEVNET_PRIVKEY as string;

const parentProvider = new providers.JsonRpcProvider(process.env.ParentRPC);
const childProvider = new providers.JsonRpcProvider(process.env.ChildRPC);
const childWallet = new Wallet(walletPrivateKey, childProvider);

// const childWallet = new Wallet(walletPrivateKey, childProvider);
const ethFromChildWithdrawAmount = parseEther('0.000001')
const main = async () => {
  // await arbLog("Deposit token using Arbitrum SDK");
  const from = await childWallet.getAddress()

  // register - needed for retryables
   // register - needed for retryables
  registerCustomArbitrumNetwork(childNetwork);


  const ethBridger = new EthBridger(childNetwork)

  /**
   * First, let's check our Child wallet's initial ETH balance and ensure there's some ETH to withdraw
   */
  const childWalletInitialEthBalance = await childWallet.getBalance()

  if (childWalletInitialEthBalance.lt(ethFromChildWithdrawAmount)) {
    console.log(
      `Oops - not enough ether; fund your account Child wallet currently ${childWallet.address} with at least 0.000001 ether`
    )
    process.exit(1)
  }
  console.log('Wallet properly funded: initiating withdrawal now')

  /**
   * We're ready to withdraw ETH using the ethBridger instance from Arbitrum SDK
   * It will use our current wallet's address as the default destination
   */

  const withdrawTx = await ethBridger.withdraw({
    from,
    amount: ethFromChildWithdrawAmount,
    childSigner: childWallet,
    destinationAddress: childWallet.address,
  })
  const withdrawRec = await withdrawTx.wait()

  /**
   * And with that, our withdrawal is initiated! No additional time-sensitive actions are required.
   * Any time after the transaction's assertion is confirmed, funds can be transferred out of the bridge via the outbox contract
   * We'll display the withdrawals event data here:
   */
  console.log(`Ether withdrawal initiated! 🥳 txHash: ${withdrawRec.transactionHash}`)

  const withdrawEventsData = await withdrawRec.getChildToParentEvents()
  console.log('Withdrawal data:', withdrawEventsData)
  console.log(
    `To claim funds (after dispute period), see outbox-execute repo 🫡`
  )
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
