import { BigNumber, Wallet, ethers } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import {
  Erc20Bridger,
  ParentToChildMessageStatus,
registerCustomArbitrumNetwork,
 
} from "@arbitrum/sdk";
//import { arbLog, requireEnvVariables } from "arb-shared-dependencies";
import dotenv from "dotenv";

import { synfuturesTestnetNetwork as childNetwork} from "../../helpers/custom-network-synfutures-testnet"
dotenv.config();
//requireEnvVariables(["DEVNET_PRIVKEY", "ParentRPC", "ChildRPC", "TOKEN_ADDRESS"]);

console.log("Environment Variables Loaded");

/**
 * Set up: instantiate Parent / Child wallets connected to providers
 */
const walletPrivateKey: string = process.env.DEVNET_PRIVKEY as string;

const parentProvider = new ethers.providers.JsonRpcProvider(process.env.ParentRPC);

const childProvider = new ethers.providers.JsonRpcProvider(process.env.ChildRPC);
const parentWallet = new Wallet(walletPrivateKey, parentProvider);
// const childWallet = new Wallet(walletPrivateKey, childProvider);

const main = async () => {

  // register - needed for retryables
  registerCustomArbitrumNetwork(childNetwork);

  console.log("Custom Network Added");


  // Set up the Erc20Bridger
  const erc20Bridger = new Erc20Bridger(childNetwork);

  console.log("Erc20 Bridger Set Up");

  // We get the address of Parent Gateway for USDC on  Sepolia
  const parentErc20Address = "0x39a18914c79ec77db7d17b0ab0f2a750d794b128"//"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; 

  // Validate that the token address is correctly set
  if (!parentErc20Address) {
    throw new Error("Invalid ERC20 token address.");
  }

  console.log("Parent ERC20 Address Validated");

  // Define the ERC20 contract interface
  const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function approve(address spender, uint256 value) public returns (bool)"
  ];

  //Get the ERC20 contract instance
  const erc20Contract = new ethers.Contract(
    parentErc20Address,
    ERC20_ABI,
    parentWallet
  );

  let ParentBalance = await erc20Contract.balanceOf(parentWallet.address)

  console.log('Current Balance on Parent: ', ParentBalance.toString())
  // Get the expected Parent Gateway address
  const expectedParentGatewayAddress = await erc20Bridger.getParentGatewayAddress(
    parentErc20Address,
    parentProvider as Provider
  );

  console.log("Expected Parent Gateway Address Retrieved: ", expectedParentGatewayAddress);

  // Check if the expectedParentGatewayAddress is valid
  if (!expectedParentGatewayAddress || expectedParentGatewayAddress === "") {
    throw new Error("Failed to get Parent Gateway address.");
  }

  // Get the initial token balance of the Bridge
  const initialBridgeTokenBalance = await erc20Contract.balanceOf(
    expectedParentGatewayAddress
  );

  // Log the initial balance
  console.log(
    `Initial Bridge Token Balance: ${initialBridgeTokenBalance.toString()}`
  );

  const tokenAmount = BigNumber.from(1000)

  const approveTxGas = await erc20Bridger.approveToken({
    parentSigner: parentWallet,
    erc20ParentAddress: parentErc20Address,
    amount:tokenAmount
  });
  const approveRecGas = await approveTxGas.wait();


  // Native TOKEN
  const approveTx = await erc20Bridger.approveToken({
    parentSigner: parentWallet,
    erc20ParentAddress: childNetwork.nativeToken!
  });
  const approveRec = await approveTx.wait();


  // console.log(
  //   `You successfully allowed the Arbitrum Bridge to spend ERC20 ${approveRec.transactionHash}`
  // );

  // Deposit the token to Child
  console.log("Transferring DappToken to Child:");
  const depositTx = await erc20Bridger.deposit({
    amount: tokenAmount,
    erc20ParentAddress: parentErc20Address,
    parentSigner: parentWallet,
    childProvider: childProvider,
  });

  
  // Wait for Parent and Child side of transactions to be confirmed
  console.log(
    `Deposit initiated: waiting for Child retryable (takes 10-15 minutes; current time: ${new Date().toTimeString()}) `
  );
  const depositRec = await depositTx.wait();
  const childResult = await depositRec.waitForChildTransactionReceipt(childProvider);

  // Check if the Parent to Child message was successful
  childResult.complete
    ? console.log(
        `Child message successful: status: ${ParentToChildMessageStatus[childResult.status]}`
      )
    : console.log(
        `Child message failed: status ${ParentToChildMessageStatus[childResult.status]}`
      );

  // Get the final token balance of the Bridge
  const finalBridgeTokenBalance = await erc20Contract.balanceOf(
    expectedParentGatewayAddress
  );

  console.log(
    `Final Bridge Token Balance: ${finalBridgeTokenBalance.toString()}`
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
