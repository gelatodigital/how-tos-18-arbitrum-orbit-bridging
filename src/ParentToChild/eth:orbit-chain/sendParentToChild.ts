import { utils, providers, Wallet, BigNumber, Contract } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import {
  EthBridger,
  registerCustomArbitrumNetwork,
  ParentToChildMessageGasEstimator,
} from "@arbitrum/sdk";
import dotenv from "dotenv";
import { reyaNetwork as childNetwork } from "../../helpers/custom-network-reya";
import { getBaseFee } from "../../helpers/helpter";

dotenv.config();

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
  const parentToChildMessageGasEstimate = new ParentToChildMessageGasEstimator(
    childProvider
  );

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

  const ParentToChildMessageGasParams =
    await parentToChildMessageGasEstimate.estimateAll(
      {
        from: await parentWallet.address,
        to: await counter,
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
  const inboxAddress = ethBridger.childNetwork.ethBridge.inbox;


  const inboxAbi = [
    "function createRetryableTicket(address to,uint256 childCallValue, uint256 maxSubmissionCost, address excessFeeRefundAddress,address callValueRefundAddress,uint256 gasLimit,uint256 maxFeePerGas,bytes calldata data) external payable returns (uint256) ",
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
    calldata
  );

  const depositTx = await parentWallet.sendTransaction({
    to: inboxAddress,
    data,
    value: ParentToChildMessageGasParams.deposit,
    gasLimit: 8000000,
  });

  let rec = await depositTx.wait();

  console.log(rec);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
