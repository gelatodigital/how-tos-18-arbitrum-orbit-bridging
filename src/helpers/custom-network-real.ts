import { ArbitrumNetwork } from "@arbitrum/sdk";

export const realNetwork: ArbitrumNetwork = {
    chainId: 111188    ,
    confirmPeriodBlocks: 20,
    ethBridge: {
      inbox: "0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11",
      bridge: "0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03",
      outbox: "0x8592Ca44dE1D354A20F75160F5602E5933D33761",
      rollup: "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a",
      sequencerInbox: "0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0",
    },
    tokenBridge: {
      parentCustomGateway: "",
      parentErc20Gateway: "0xfC89B875970122E24C6C5ADd4Dea139443943ea7",
      parentGatewayRouter: "0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18",
      parentMultiCall: "",
      parentProxyAdmin: "",
      parentWeth: "",
      parentWethGateway: "",
      childCustomGateway: "",
      childErc20Gateway: "0x326FFa9E3836577C6C46b0aA5A5b223FB4a4067c",
      childGatewayRouter: "0xF0b66c2d7Abb3CbbD26463a971BF62d6c4eaDE34",
      childMultiCall: "",
      childProxyAdmin: "",
      childWeth: "",
      childWethGateway: "",
    },
    parentChainId: 1,
    isTestnet:false,
    isCustom:true,
    name: "fluence",
    retryableLifetimeSeconds: 7 * 24 * 60 * 60,
    nativeToken: "0xC0Cc5eA00cAe0894B441E3B5a3Bb57aa92F15421",
  };


