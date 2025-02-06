import { BigNumber, Wallet, ethers } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import {
  Erc20Bridger,
  registerCustomArbitrumNetwork,
 
} from "@arbitrum/sdk";
//import { arbLog, requireEnvVariables } from "arb-shared-dependencies";
import dotenv from "dotenv";
import { alephZero as childNetwork} from "../helpers/custom-network-aleph";
import { parseEther } from "ethers/lib/utils";

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
const childWallet = new Wallet(walletPrivateKey, childProvider);

const main = async () => {

  // register - needed for retryables
  registerCustomArbitrumNetwork(childNetwork);
  console.log("Custom Network Added");



  // Set up the Erc20Bridger
  const erc20Bridger = new Erc20Bridger(childNetwork);

  console.log("Erc20 Bridger Set Up");

  // We get the address of Parent Gateway for our DappToken
  const parentErc20Address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC token on Ethereum
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

  const childUsdc = await erc20Bridger.getChildErc20Address(
    parentErc20Address,
    parentProvider
  )

  //Get the ERC20 contract instance
  const erc20Contract = new ethers.Contract(
   childUsdc,
    ERC20_ABI,
    childWallet
  );
  // Get the initial token balance of the Bridge
  const initialBridgeTokenBalance = await erc20Contract.balanceOf(
    childWallet.address
  );
  const tokenAmount = parseEther("100")
  const childGateway = await erc20Bridger.getChildGatewayAddress(
    parentErc20Address,
    childProvider
  )

  let tx = await erc20Contract.approve(childGateway, tokenAmount)
  await tx.wait()


  // Log the initial balance
  console.log(
    `Initial Bridge Token Balance: ${initialBridgeTokenBalance.toString()}`
  );

  //Get the token decimals and compute the deposit amount
 
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
