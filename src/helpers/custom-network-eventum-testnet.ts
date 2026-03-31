import { ArbitrumNetwork } from "@arbitrum/sdk";

export const eventumTestnetNetwork: ArbitrumNetwork ={
  "chainId": 16182,
  "confirmPeriodBlocks": 4352345345,
  "ethBridge": {
      "bridge": "0x1006059Bb86890de3fc0b40FA1fE8f81F59F6932",
      "inbox": "0x4bd2324dcbBCfc6f70d1D9497daF46b5C1Da28c2",
      "outbox": "0xc90B59Da03A117fAe0117b3A7f24a943607731C8",
      "rollup": "0x5B523679D5D15a476BC3E8c1796b885aDCb27a65",
      "sequencerInbox": "0x26c88802D3C335E35989A1BD03AD30Ac4b499BeB"
  },

  "tokenBridge": {
      "parentCustomGateway": "",
      "parentErc20Gateway": "0xD27c3Bef20d90ed68Ca1aB7bfc7fAa4B58223E8f",
      "parentGatewayRouter": "0x4eb7364DC54bA045B17FadE0EB5A7030Dc828e85",
      "parentMultiCall": "",
      "parentProxyAdmin": "",
      "parentWeth": "",
      "parentWethGateway": "",
      "childCustomGateway": "",
      "childErc20Gateway": "0x87841A424d8b8A18627e369fA410Ce470B82ACbC",
      "childGatewayRouter": "0xd3A56528feC4b713726b03a8BFaf9aA929E18d8E",
      "childMultiCall": "",
      "childProxyAdmin": "",
      "childWeth": "",
      "childWethGateway": ""
  },
  "isCustom": true,
  "name": "Evedex Testnett",
  "retryableLifetimeSeconds": 604800,
  "parentChainId": 421614,
  "isTestnet": true,
}


