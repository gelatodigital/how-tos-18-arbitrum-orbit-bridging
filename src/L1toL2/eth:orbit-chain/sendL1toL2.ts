import { utils, providers, Wallet, BigNumber, Contract } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import {
  Erc20Bridger,
  EthBridger,
  addCustomNetwork,
  L2Network,
  L1ToL2MessageGasEstimator
} from "@arbitrum/sdk";
import dotenv from "dotenv";
import { l2Network } from "../../helpers/custom-network-reya";
import { getBaseFee } from "../../helpers/helpter";

dotenv.config();


console.log("Environment Variables Loaded");

/**
 * Set up: instantiate L1 / L2 wallets connected to providers
 */
const walletPrivateKey: string = process.env.DEVNET_PRIVKEY as string;

const l1Provider = new providers.JsonRpcProvider(process.env.L1RPC);
const l2Provider = new providers.JsonRpcProvider(process.env.L2RPC);
const l1Wallet = new Wallet(walletPrivateKey, l1Provider);
const l2Wallet = new Wallet(walletPrivateKey, l2Provider);


const main = async () => {



  // register - needed for retryables
  addCustomNetwork({
    customL2Network: l2Network,
  });

  const l1ToL2MessageGasEstimate = new L1ToL2MessageGasEstimator(l2Provider);

  const counter = "0xEEeBe2F778AA186e88dCf2FEb8f8231565769C27";
  const abi = ["function increment()"];
  const iface = new utils.Interface(abi);
  const calldata = iface.encodeFunctionData("increment");
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

  const L1ToL2MessageGasParams = await l1ToL2MessageGasEstimate.estimateAll(
    {
      from: await l1Wallet.address,
      to: await counter,
      l2CallValue: BigNumber.from(0),
      excessFeeRefundAddress: await l2Wallet.address,
      callValueRefundAddress: await l2Wallet.address,
      data: calldata,
    },
    await getBaseFee(l1Provider),
    l1Provider,
    RetryablesGasOverrides //if provided, it will override the estimated values. Note that providing "RetryablesGasOverrides" is totally optional.
  );
  const walletAddress = await l1Wallet.address;

  const ethBridger = new EthBridger(l2Network);
  const inboxAddress = ethBridger.l2Network.ethBridge.inbox;

  console.log(inboxAddress);
  const inboxAbi = [
    "function createRetryableTicket(address to,uint256 l2CallValue, uint256 maxSubmissionCost, address excessFeeRefundAddress,address callValueRefundAddress,uint256 gasLimit,uint256 maxFeePerGas,bytes calldata data) external payable returns (uint256) ",
  ];

  const inboxContract = new Contract(inboxAddress, inboxAbi, l1Wallet);


  let { data } = await inboxContract.populateTransaction.createRetryableTicket(
    counter,
    0,
    L1ToL2MessageGasParams.maxSubmissionCost,
    walletAddress,
    walletAddress,
    L1ToL2MessageGasParams.gasLimit,
    L1ToL2MessageGasParams.maxFeePerGas,
    calldata
  );


  const depositTx = await l1Wallet.sendTransaction({
    to: inboxAddress,
    data,
    value:L1ToL2MessageGasParams.deposit,
    gasLimit: 8000000,
  });

  let rec = await depositTx.wait();

  console.log(rec);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
