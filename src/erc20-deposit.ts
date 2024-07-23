import { BigNumber, Wallet, ethers } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import {
  Erc20Bridger,
  L1ToL2MessageStatus,
  addCustomNetwork,
  EthBridger,
 
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

const l1Provider = new ethers.providers.JsonRpcProvider(process.env.L1RPC);

const l2Provider = new ethers.providers.JsonRpcProvider(process.env.L2RPC);
const l1Wallet = new Wallet(walletPrivateKey, l1Provider);
// const l2Wallet = new Wallet(walletPrivateKey, l2Provider);

const main = async () => {

  // register - needed for retryables
   addCustomNetwork({
    customL2Network: l2Network,
  });

  console.log("Custom Network Added");

  // Add the default local network configuration to the SDK
 // addDefaultLocalNetwork();

  //console.log("Default Local Network Added");

  // Set up the Erc20Bridger
  const erc20Bridger = new Erc20Bridger(l2Network);

  console.log("Erc20 Bridger Set Up");

  // We get the address of L1 Gateway for USDC on ARbitrum Sepolia
  const l1Erc20Address = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"; 

  // Validate that the token address is correctly set
  if (!l1Erc20Address) {
    throw new Error("Invalid ERC20 token address.");
  }

  console.log("L1 ERC20 Address Validated");

  // Define the ERC20 contract interface
  const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
  ];

  //Get the ERC20 contract instance
  const erc20Contract = new ethers.Contract(
    l1Erc20Address,
    ERC20_ABI,
    l1Wallet
  );

  let L1Balance = await erc20Contract.balanceOf(l1Wallet.address)
  console.log('Current Balance on L1: ', L1Balance.toString())
  // Get the expected L1 Gateway address
  const expectedL1GatewayAddress = await erc20Bridger.getL1GatewayAddress(
    l1Erc20Address,
    l1Provider as Provider
  );

  console.log("Expected L1 Gateway Address Retrieved: ", expectedL1GatewayAddress);

  // Check if the expectedL1GatewayAddress is valid
  if (!expectedL1GatewayAddress || expectedL1GatewayAddress === "") {
    throw new Error("Failed to get L1 Gateway address.");
  }

  // Get the initial token balance of the Bridge
  const initialBridgeTokenBalance = await erc20Contract.balanceOf(
    expectedL1GatewayAddress
  );

  // Log the initial balance
  console.log(
    `Initial Bridge Token Balance: ${initialBridgeTokenBalance.toString()}`
  );


  const tokenAmount = BigNumber.from(1000000)


  const approveTxGas = await erc20Bridger.approveToken({
    l1Signer: l1Wallet,
    erc20L1Address: "0x9c5EB9723728123AF896089b902CB17B44Fd09e6",
  });
  const approveRecGas = await approveTxGas.wait();


  const approveTx = await erc20Bridger.approveToken({
    l1Signer: l1Wallet,
    erc20L1Address: l1Erc20Address,
  });
  const approveRec = await approveTx.wait();


  // console.log(
  //   `You successfully allowed the Arbitrum Bridge to spend ERC20 ${approveRec.transactionHash}`
  // );

  // Deposit the token to L2
  console.log("Transferring DappToken to L2:");
  const depositTx = await erc20Bridger.deposit({
    amount: tokenAmount,
    erc20L1Address: l1Erc20Address,
    l1Signer: l1Wallet,
    l2Provider: l2Provider,
  });


  
  // Wait for L1 and L2 side of transactions to be confirmed
  console.log(
    `Deposit initiated: waiting for L2 retryable (takes 10-15 minutes; current time: ${new Date().toTimeString()}) `
  );
  const depositRec = await depositTx.wait();
  const l2Result = await depositRec.waitForL2(l2Provider);

  // Check if the L1 to L2 message was successful
  l2Result.complete
    ? console.log(
        `L2 message successful: status: ${L1ToL2MessageStatus[l2Result.status]}`
      )
    : console.log(
        `L2 message failed: status ${L1ToL2MessageStatus[l2Result.status]}`
      );

  // Get the final token balance of the Bridge
  const finalBridgeTokenBalance = await erc20Contract.balanceOf(
    expectedL1GatewayAddress
  );

  console.log(
    `Final Bridge Token Balance: ${finalBridgeTokenBalance.toString()}`
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
