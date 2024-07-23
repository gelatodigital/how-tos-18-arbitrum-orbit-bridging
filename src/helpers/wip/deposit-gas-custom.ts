import { Contract, Wallet, ethers } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import { defaultAbiCoder } from 'ethers/lib/utils'
import {
  Erc20Bridger,
  L1ToL2MessageStatus,
  addCustomNetwork,
  L2Network,
  addDefaultLocalNetwork,
 
} from "@arbitrum/sdk";
//import { arbLog, requireEnvVariables } from "arb-shared-dependencies";
import dotenv from "dotenv";
import { getL1ToL2GasParams } from "./helpter";
import { l2Network } from "../custom-network";
dotenv.config();
//requireEnvVariables(["DEVNET_PRIVKEY", "L1RPC", "L2RPC", "TOKEN_ADDRESS"]);

console.log("Environment Variables Loaded");

/**
 * Set up: instantiate L1 / L2 wallets connected to providers
 */
const walletPrivateKey: string = process.env.DEVNET_PRIVKEY as string;
let l1Provider = new ethers.providers.JsonRpcProvider(process.env.L1RPC);
const l2Provider = new ethers.providers.JsonRpcProvider(process.env.L2RPC);
const l1Wallet = new Wallet(walletPrivateKey, l1Provider);


const main = async () => {



  console.log("L2 Network Reached");
  // register - needed for retryables
   addCustomNetwork({
    customL2Network: l2Network,
  });

  console.log("Custom Network Added");


  // Set up the Erc20Bridger
  const l1Erc20Address = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"; 
  const tokenAmount = ethers.utils.parseEther("1")

  const erc20Bridger = new Erc20Bridger(l2Network);
 

  console.log("Erc20 Bridger Set Up");

  // We get the address of L1 Gateway for our DappToken


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

  //Get the token decimals and compute the deposit amount
  const tokenDecimals = await erc20Contract.decimals();
 
  const walletAddress = await l1Wallet.address;




//  Approve the token transfer
  console.log("Approving:");
  const approveTx = await erc20Bridger.approveToken({
    l1Signer: l1Wallet,
    erc20L1Address: l1Erc20Address,
    amount:tokenAmount
  });
  const approveRec = await approveTx.wait();
  const approveTx2 = await erc20Bridger.approveToken({
    l1Signer: l1Wallet,
    erc20L1Address: "0xf5055e7C5Ea7b941E4ebad2F028Cb29962a3168C",
    amount:tokenAmount.mul(2)
  });
  const approveRec2 = await approveTx2.wait();
  console.log(
    `You successfully allowed the Arbitrum Bridge to spend CGT ${approveRec2.transactionHash}`
  );


  const depositRequest = await erc20Bridger.getDepositRequest({
    amount: tokenAmount,
    erc20L1Address: l1Erc20Address,
    l1Provider: l1Provider,
    from:l1Wallet.address,
    l2Provider: l2Provider,
  }) as any;
  let retryableData = depositRequest.retryableData;
  let l2Gaslimit = retryableData.gasLimit
  let maxFeePerGas = retryableData.maxFeePerGas
  let maxSubmissionCost = retryableData.maxSubmissionCost


  let data1 = defaultAbiCoder.encode(
    ['uint256', 'bytes','uint256'],
    [
      +depositRequest. retryableData.maxSubmissionCost.toString(),
      '0x',
      depositRequest.retryableData.deposit
    ]
  )
  
  let routerABI  = ["function outboundTransferCustomRefund( address _l1Token,address _refundTo,   address _to,   uint256 _amount,    uint256 _maxGas, uint256 _gasPriceBid, bytes calldata _data) external payable returns (bytes memory)"]
  const routerContract = new Contract("0xf446986e261E84aB2A55159F3Fba60F7E8AeDdAF",routerABI,l1Wallet)
  

  //Deposit the token to L2
  console.log("Transferring DappToken to L2:");
  console.log(tokenAmount.toString())
  const {data}= await routerContract.populateTransaction.outboundTransferCustomRefund(

  l1Erc20Address,walletAddress,walletAddress,tokenAmount,depositRequest.retryableData.gasLimit,depositRequest.retryableData.maxFeePerGas,data1 );
 
const depositTx = await l1Wallet.sendTransaction({
  to:routerContract.address,
  data
})

  let rec = await depositTx.wait();
  console.log(rec)

};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
