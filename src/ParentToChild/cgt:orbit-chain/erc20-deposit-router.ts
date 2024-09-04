import { BigNumber, Contract, Wallet, ethers } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import { defaultAbiCoder } from "ethers/lib/utils";
import {
  registerCustomArbitrumNetwork,
  Erc20Bridger
} from "@arbitrum/sdk";

import dotenv from "dotenv";

import {novastroNetwork as childNetwork} from "../../helpers/custom-network-novastro";
dotenv.config();


/**
 * Set up: instantiate Parent / Child wallets connected to providers
 */
const walletPrivateKey: string = process.env.DEVNET_PRIVKEY as string;
let parentProvider = new ethers.providers.JsonRpcProvider(process.env.ParentRPC);
const childProvider = new ethers.providers.JsonRpcProvider(process.env.ChildRPC);
const parentWallet = new Wallet(walletPrivateKey, parentProvider);

const main = async () => {
  console.log("Child Network Reached");

  // register - needed for retryables
  registerCustomArbitrumNetwork(childNetwork);

  console.log("Custom Network Added");

  // Set up the Erc20Bridger
  const parentErc20Address = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d";
  const tokenAmount = BigNumber.from(100000);

  const erc20Bridger = new Erc20Bridger(childNetwork);

  console.log("Erc20 Bridger Set Up");

  // We get the address of Parent Gateway for our DappToken

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

  console.log(
    "Expected Parent Gateway Address Retrieved: ",
    expectedParentGatewayAddress
  );

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

  const walletAddress = await parentWallet.address;

  //  Approve the token transfer
  console.log("Approving:");
  const approveTx = await erc20Bridger.approveToken({
    parentSigner: parentWallet,
    erc20ParentAddress: parentErc20Address,
  });
  const approveRec = await approveTx.wait();

    /// Native TOKEN
  const approveTx2 = await erc20Bridger.approveToken({
    parentSigner: parentWallet,
    erc20ParentAddress: childNetwork.nativeToken!
  });
  const approveRec2 = await approveTx2.wait();
  console.log(
    `You successfully allowed the Arbitrum Bridge to spend ${approveRec2.transactionHash}`
  );

  const depositRequest = (await erc20Bridger.getDepositRequest({
    amount: tokenAmount,
    erc20ParentAddress: parentErc20Address,
    parentProvider: parentProvider,
    from: parentWallet.address,
    childProvider: childProvider,
  })) as any;

  let retryableData = depositRequest.retryableData;
  let childGaslimit = retryableData.gasLimit;
  let maxFeePerGas = retryableData.maxFeePerGas;
  let maxSubmissionCost = retryableData.maxSubmissionCost;
  let deposit = depositRequest.retryableData.deposit;

  let data1 = defaultAbiCoder.encode(
    ["uint256", "bytes", "uint256"],
    [+maxSubmissionCost.toString(), "0x", deposit]
  );

  let routerABI = [
    "function outboundTransferCustomRefund( address _parentToken,address _refundTo,   address _to,   uint256 _amount,    uint256 _maxGas, uint256 _gasPriceBid, bytes calldata _data) external payable returns (bytes memory)",
  ];
  const routerContract = new Contract(
    childNetwork.tokenBridge?.parentGatewayRouter!,
    routerABI,
    parentWallet
  );

  //Deposit the token to Child
  console.log("Transferring DappToken to Child:");
  console.log(tokenAmount.toString());
  const { data } =
    await routerContract.populateTransaction.outboundTransferCustomRefund(
      parentErc20Address,
      walletAddress,
      walletAddress,
      tokenAmount,
      childGaslimit,
      maxFeePerGas,
      data1
    );

  const depositTx = await parentWallet.sendTransaction({
    to: routerContract.address,
    data,
  });

  let rec = await depositTx.wait();
  console.log(rec);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
