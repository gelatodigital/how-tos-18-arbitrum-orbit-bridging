import { utils, providers, Wallet } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import {
  Erc20Bridger,
  EthBridger,
  addCustomNetwork,
  L2Network,
} from "@arbitrum/sdk";
//import { arbLog, requireEnvVariables } from "arb-shared-dependencies";
import dotenv from "dotenv";
import { parseEther } from "ethers/lib/utils";
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

// const l2Wallet = new Wallet(walletPrivateKey, l2Provider);
const ethFromL2WithdrawAmount = parseEther('0.000001')
const main = async () => {
  // await arbLog("Deposit token using Arbitrum SDK");
  const from = await l2Wallet.getAddress()

  // register - needed for retryables
  addCustomNetwork({
    customL2Network: l2Network,
  });



  const ethBridger = new EthBridger(l2Network)

  /**
   * First, let's check our L2 wallet's initial ETH balance and ensure there's some ETH to withdraw
   */
  const l2WalletInitialEthBalance = await l2Wallet.getBalance()

  if (l2WalletInitialEthBalance.lt(ethFromL2WithdrawAmount)) {
    console.log(
      `Oops - not enough ether; fund your account L2 wallet currently ${l2Wallet.address} with at least 0.000001 ether`
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
    amount: ethFromL2WithdrawAmount,
    l2Signer: l2Wallet,
    destinationAddress: l2Wallet.address,
  })
  const withdrawRec = await withdrawTx.wait()

  /**
   * And with that, our withdrawal is initiated! No additional time-sensitive actions are required.
   * Any time after the transaction's assertion is confirmed, funds can be transferred out of the bridge via the outbox contract
   * We'll display the withdrawals event data here:
   */
  console.log(`Ether withdrawal initiated! 🥳 txHash: ${withdrawRec.transactionHash}`)

  const withdrawEventsData = await withdrawRec.getL2ToL1Events()
  console.log('Withdrawal data:', withdrawEventsData)
  console.log(
    `To claim funds (after dispute period), see outbox-execute repo 🫡`
  )
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
