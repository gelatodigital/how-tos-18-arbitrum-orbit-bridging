import { BigNumber, Wallet, ethers } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import {
  Erc20Bridger,
  registerCustomArbitrumNetwork,
 
} from "@arbitrum/sdk";
//import { arbLog, requireEnvVariables } from "arb-shared-dependencies";
import dotenv from "dotenv";
import { eduTestnetNetwork as childNetwork} from "../helpers/custom-network-edu-testnet";
import { parseEther } from "ethers/lib/utils";

dotenv.config();
//requireEnvVariables(["DEVNET_PRIVKEY", "ParentRPC", "ChildRPC", "TOKEN_ADDRESS"]);

console.log("Environment Variables Loaded");

/**
 * Set up: instantiate Parent / Child wallets connected to providers
 */
const walletPrivateKey: string = process.env.DEVNET_PRIVKEY as string;


const childProvider = new ethers.providers.JsonRpcProvider(process.env.ChildRPC);
const childWallet = new Wallet(walletPrivateKey, childProvider);

const childGateway = "0x2A5a79061b723BBF453ef7E07c583C750AFb9BD6"
const childUsdc = "0x4Ca4B85Ead5EA49892d3a81DbfAE2f5c2F75d53D"


const main = async () => {

  // register - needed for retryables
  registerCustomArbitrumNetwork(childNetwork);
  console.log("Custom Network Added");


  // We get the address of Parent Gateway for our DappToken
  const parentErc20Address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC token on Ethereum
  // Validate that the token address is correctly set
  if (!parentErc20Address) {
    throw new Error("Invalid ERC20 token address.");
  }
  console.log("Parent ERC20 Address Validated");

  const standardERCABI = ["function outboundTransfer( address _token,address _to, uint256 _amount, uint256 _maxGas,   uint256 _gasPriceBid, bytes calldata _data) external payable returns (bytes memory)"]


  // Define the ERC20 contract interface
  const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
     "function approve(address spender, uint256 value) public returns (bool)"
  ];


  //Get the ERC20 contract instance
  const erc20Contract = new ethers.Contract(
   childUsdc,
    ERC20_ABI,
    childWallet
  );

  const tokenAmount = ethers.utils.parseUnits("1",6)
  // aproving the token
  let tx = await erc20Contract.approve(childGateway, tokenAmount)
  await tx.wait()

 
  const standardGateway = new ethers.Contract(childGateway, standardERCABI,childWallet)

  let txWithdraw = await standardGateway.outboundTransfer(parentErc20Address,childWallet.address,tokenAmount,0,0,"0x")
  await txWithdraw.wait()
  //Get the token decimals and compute the deposit amount

  console.log(`Token withdrawal initiated! 🥳 ${txWithdraw.transactionHash}`)


};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
