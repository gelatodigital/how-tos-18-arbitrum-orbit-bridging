import { BigNumber, Wallet, ethers } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import {
  Erc20Bridger,
  registerCustomArbitrumNetwork,
 
} from "@arbitrum/sdk";
//import { arbLog, requireEnvVariables } from "arb-shared-dependencies";
import dotenv from "dotenv";
import { blueberryNetwork as childNetwork} from "../helpers/custom-network";

dotenv.config();
//requireEnvVariables(["DEVNET_PRIVKEY", "ParentRPC", "ChildRPC", "TOKEN_ADDRESS"]);

console.log("Environment Variables Loaded");

/**
 * Set up: instantiate Parent / Child wallets connected to providers
 */
const walletPrivateKey: string = process.env.DEVNET_PRIVKEY as string;

//const parentProvider = new ethers.providers.JsonRpcProvider(process.env.ParentRPC);
const parentProvider = new ethers.providers.JsonRpcProvider(process.env.ParentRPC);

const childProvider = new ethers.providers.JsonRpcProvider(process.env.ChildRPC);
const parentWallet = new Wallet(walletPrivateKey, parentProvider);
 const childWallet = new Wallet(walletPrivateKey, childProvider);

const main = async () => {

  // register - needed for retryables
  registerCustomArbitrumNetwork(childNetwork);
  console.log("Custom Network Added");



  // Set up the Erc20Bridger
  const erc20Bridger = new Erc20Bridger(childNetwork);

  console.log("Erc20 Bridger Set Up");

  // We get the address of Parent Gateway for our DappToken
  const parentErc20Address = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"; // "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; 

  // Validate that the token address is correctly set
  if (!parentErc20Address) {
    throw new Error("Invalid ERC20 token address.");
  }

  console.log("Parent ERC20 Address Validated");

  // Define the ERC20 contract interface
  const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
  ];

  //Get the ERC20 contract instance
  const erc20Contract = new ethers.Contract(
    parentErc20Address,
    ERC20_ABI,
    parentWallet
  );


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

  //Get the token decimals and compute the deposit amount
  const tokenAmount = BigNumber.from(1000000)
  console.log('Withdrawing:')
  const withdrawTx = await erc20Bridger.withdraw({
    amount: tokenAmount,
    destinationAddress: childWallet.address,
    erc20ParentAddress:  parentErc20Address,
    childSigner: childWallet,
  })
  const withdrawRec = await withdrawTx.wait()
  console.log(`Token withdrawal initiated! 🥳 ${withdrawRec.transactionHash}`)


};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
