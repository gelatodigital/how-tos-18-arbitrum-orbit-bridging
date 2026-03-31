import { ArbitrumNetwork } from "@arbitrum/sdk";
// https://rpc.kai.now
export const kardiaNetwork: ArbitrumNetwork ={
  "chainId": 2989,
  "confirmPeriodBlocks": 4352345345,
  "ethBridge": {
      "bridge": "0xcF5a231Dcf25aFFEc0C55d64ac82a79e1b4d7124",
      "inbox": "0x4f9e98eCE5D6cf8db0098e614D8B9ab8498d3728",
      "outbox": "0xd69Fd975e11dd44e4957d445623426C475fa7647",
      "rollup": "0xBDC16cccD30ced069Cc9E332D40662D8C476B6cb",
      "sequencerInbox": "0x45AAd28Dcd75AAf83cd6d8D8031696b8D82FddA9"
  },

  "tokenBridge": {
      "parentCustomGateway": "",
      "parentErc20Gateway": "0x28e6a2ede87D031B8F0672a0F6eb1535813b2574",
      "parentGatewayRouter": "0x000F643F933f70D0E1093639b203e7Da0586832e",
      "parentMultiCall": "",
      "parentProxyAdmin": "",
      "parentWeth": "",
      "parentWethGateway": "",
      "childCustomGateway": "",
      "childErc20Gateway": "0xB2176847FC3A6FCc55F77f6B4855B58ebA21e9c5",
      "childGatewayRouter": "0x67d5a7aAf8d2f35D75Abee274a506c21bde5CE99",
      "childMultiCall": "",
      "childProxyAdmin": "",
      "childWeth": "",
      "childWethGateway": ""
  },
  "isCustom": true,
  "name": "Kai",
  "retryableLifetimeSeconds": 604800,
  "parentChainId": 42161,
  "isTestnet": false,
  nativeToken: "0xa891B374942cdE9061e044c1D19c5b5dE06a68e1",
}


