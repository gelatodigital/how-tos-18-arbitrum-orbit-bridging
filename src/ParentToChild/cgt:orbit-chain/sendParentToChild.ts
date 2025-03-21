import { utils, providers, Wallet, BigNumber, Contract } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import {
  EthBridger,
  registerCustomArbitrumNetwork,
  ParentToChildMessageGasEstimator
} from "@arbitrum/sdk";
import dotenv from "dotenv";
import { eduTestnetNetwork as  childNetwork } from "../../helpers/custom-network-edu-testnet";
import { getBaseFee } from "../../helpers/helpter";

dotenv.config();

const encodeTokenInitData = (
  name: string,
  symbol: string,
  decimals: number | string
) => {
  return utils.defaultAbiCoder.encode(
    ['bytes', 'bytes', 'bytes'],
    [
      utils.defaultAbiCoder.encode(['string'], [name]),
      utils.defaultAbiCoder.encode(['string'], [symbol]),
      utils.defaultAbiCoder.encode(['uint8'], [decimals]),
    ]
  )
}

console.log("Environment Variables Loaded");

/**
 * Set up: instantiate Parent / Child wallets connected to providers
 */
const walletPrivateKey: string = process.env.DEVNET_PRIVKEY as string;

const parentProvider = new providers.JsonRpcProvider(process.env.ParentRPC);
const childProvider = new providers.JsonRpcProvider(process.env.ChildRPC);
const parentWallet = new Wallet(walletPrivateKey, parentProvider);
const childWallet = new Wallet(walletPrivateKey, childProvider);


const main = async () => {



  // register - needed for retryables
  registerCustomArbitrumNetwork(childNetwork);

  const parentToChildMessageGasEstimate = new ParentToChildMessageGasEstimator(childProvider);

  const counter = "0xEEeBe2F778AA186e88dCf2FEb8f8231565769C27";
  const abi = ["function increment()"];

  const parentErc20Address = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"
  const l2gateway = "0x2a5302C754f0DcDe224Cd26F887b9B976CBeD972"
  const deployData = encodeTokenInitData("USDC", "USDC", 6)
  const data1 = utils.defaultAbiCoder.encode(
    ['bytes', 'bytes'],
    [deployData, '0x']
  )

  const abiL2 = ["function finalizeInboundTransfer(address _token,address _from,address _to, uint256 _amount,bytes calldata _data)"]
  const iface = new utils.Interface(abiL2);
  const calldata = iface.encodeFunctionData("finalizeInboundTransfer",[parentErc20Address,childWallet.address,childWallet.address,1000,data1]);
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

  const ParentToChildMessageGasParams = await parentToChildMessageGasEstimate.estimateAll(
    {
      from: "0xd16E8b904BE8Db6FaB0C375c4eeA5BCDC6dcAa91",
      to:  l2gateway,
      l2CallValue: BigNumber.from(0),
      excessFeeRefundAddress: await childWallet.address,
      callValueRefundAddress: await childWallet.address,
      data: calldata,
    },
    await getBaseFee(parentProvider),
    parentProvider,
    RetryablesGasOverrides //if provided, it will override the estimated values. Note that providing "RetryablesGasOverrides" is totally optional.
  );
  const walletAddress = await parentWallet.address;

  const ethBridger = new EthBridger(childNetwork);
  const approveTxGas = await ethBridger.approveGasToken({
    parentSigner: parentWallet,
  });
  const approveRecGas = await approveTxGas.wait();
  const inboxAddress = ethBridger.childNetwork.ethBridge.inbox;

  const inboxAbi = [
    "function createRetryableTicket(address to,uint256 childCallValue, uint256 maxSubmissionCost, address excessFeeRefundAddress,address callValueRefundAddress,uint256 gasLimit,uint256 maxFeePerGas,uint256 tokenTotalFeeAmount,bytes calldata data) external payable returns (uint256) ",
  ];

  const inboxContract = new Contract(inboxAddress, inboxAbi, parentWallet);


  let { data } = await inboxContract.populateTransaction.createRetryableTicket(
    counter,
    0,
    ParentToChildMessageGasParams.maxSubmissionCost,
    walletAddress,
    walletAddress,
    ParentToChildMessageGasParams.gasLimit,
    ParentToChildMessageGasParams.maxFeePerGas,
    ParentToChildMessageGasParams.deposit,
    calldata
  );


  const depositTx = await parentWallet.sendTransaction({
    to: inboxAddress,
    data,
    gasLimit: 8000000,
  });

  let rec = await depositTx.wait();

  console.log(rec);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

