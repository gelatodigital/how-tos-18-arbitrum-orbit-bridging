import { BigNumber, Contract, Wallet, ethers, utils } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import { defaultAbiCoder } from "ethers/lib/utils";
import {
  Erc20Bridger,
  ParentToChildMessageGasEstimator,
  registerCustomArbitrumNetwork,
} from "@arbitrum/sdk";

import dotenv from "dotenv";
import { eventumTestnetNetwork as childNetwork } from "../../helpers/custom-network-eventum-testnet";
import { getBaseFee } from "../../helpers/helpter";

dotenv.config();
const encodeTokenInitData = (
  name: string,
  symbol: string,
  decimals: number | string
) => {
  return utils.defaultAbiCoder.encode(
    ["bytes", "bytes", "bytes"],
    [
      utils.defaultAbiCoder.encode(["string"], [name]),
      utils.defaultAbiCoder.encode(["string"], [symbol]),
      utils.defaultAbiCoder.encode(["uint8"], [decimals]),
    ]
  );
};

/**
 * Set up: instantiate Parent / Child wallets connected to providers
 */
const walletPrivateKey: string = process.env.DEVNET_PRIVKEY as string;
let parentProvider = new ethers.providers.JsonRpcProvider(
  process.env.ParentRPC
);
const childProvider = new ethers.providers.JsonRpcProvider(
  process.env.ChildRPC
);
const parentWallet = new Wallet(walletPrivateKey, parentProvider);
const childWallet = new Wallet(walletPrivateKey, childProvider);
const main = async () => {
  console.log("Child Network Reached");

  // register - needed for retryables
  registerCustomArbitrumNetwork(childNetwork);

  console.log("Custom Network Added");

  // Set up the Erc20Bridger
  const parentErc20Address = "0x39a18914C79eC77DB7d17B0AB0F2a750D794b128";
  const tokenAmount = BigNumber.from(1000000);

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
  const expectedParentGatewayAddress =
    await erc20Bridger.getParentGatewayAddress(
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

  console.log(
    `You successfully allowed the Arbitrum Bridge to spend USDC ${approveRec.transactionHash}`
  );

  // const depositRequest = (await erc20Bridger.getDepositRequest({
  //   amount: tokenAmount,
  //   erc20ParentAddress: parentErc20Address,
  //   parentProvider: parentProvider,
  //   from: parentWallet.address,
  //   childProvider: childProvider,
  // })) as any;

  const parentToChildMessageGasEstimate = new ParentToChildMessageGasEstimator(
    childProvider
  );

  const l2gateway = "0x2a5302C754f0DcDe224Cd26F887b9B976CBeD972";
  const deployData = encodeTokenInitData("USDC", "USDC", 6);
  const dataEst = utils.defaultAbiCoder.encode(
    ["bytes", "bytes"],
    [deployData, "0x"]
  );
  const abiL2 = [
    "function finalizeInboundTransfer(address _token,address _from,address _to, uint256 _amount,bytes calldata _data)",
  ];
  const iface = new utils.Interface(abiL2);
  const calldata = iface.encodeFunctionData("finalizeInboundTransfer", [
    parentErc20Address,
    childWallet.address,
    childWallet.address,
    1000,
    dataEst,
  ]);
  const RetryablesGasOverrides = {
    gasLimit: {
      base: undefined, // when undefined, the value will be estimated from rpc
      min: BigNumber.from(10000), // set a minimum gas limit, using 10000 as an example
      percentIncrease: BigNumber.from(30), // how much to increase the base for buffer
    },
    maxSubmissionFee: {
      base: undefined,
      percentIncrease: BigNumber.from(30),
    },
    maxFeePerGas: {
      base: undefined,
      percentIncrease: BigNumber.from(30),
    },
  };

  const ParentToChildMessageGasParams =
    await parentToChildMessageGasEstimate.estimateAll(
      {
        from: childNetwork.tokenBridge?.parentErc20Gateway as string,
        to: l2gateway,
        l2CallValue: BigNumber.from(0),
        excessFeeRefundAddress: await childWallet.address,
        callValueRefundAddress: await childWallet.address,
        data: calldata,
      },
      await getBaseFee(parentProvider),
      parentProvider,
      RetryablesGasOverrides //if provided, it will override the estimated values. Note that providing "RetryablesGasOverrides" is totally optional.
    );

  let childGaslimit = ParentToChildMessageGasParams.gasLimit;
  let maxFeePerGas = ParentToChildMessageGasParams.maxFeePerGas;
  let maxSubmissionCost = ParentToChildMessageGasParams.maxSubmissionCost;
  let deposit = ParentToChildMessageGasParams.deposit;
  console.log("Deposit/gas on l2:  ", deposit.toString());

  let data1 = defaultAbiCoder.encode(
    ["uint256", "bytes"],
    [+maxSubmissionCost.toString(), "0x"]
  );

  let routerABI = [
    "function outboundTransferCustomRefund( address _parentToken,address _refundTo,   address _to,   uint256 _amount,    uint256 _maxGas, uint256 _gasPriceBid, bytes calldata _data) external payable returns (bytes memory)",
    "function outboundTransfer( address _parentToken,  address _to,   uint256 _amount,    uint256 _maxGas, uint256 _gasPriceBid, bytes calldata _data) external payable returns (bytes memory)",
  ];
  const routerContract = new Contract(
    childNetwork.tokenBridge?.parentGatewayRouter!,
    routerABI,
    parentWallet
  );

  //Deposit the token to Child
  console.log("Transferring DappToken to Child:");

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
    value: deposit,
  });

  let rec = await depositTx.wait();
  console.log(rec);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
