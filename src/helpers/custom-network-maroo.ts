import { ArbitrumNetwork } from "@arbitrum/sdk";

export const marooNetwork: ArbitrumNetwork ={
  "chainId": 815,
  "confirmPeriodBlocks": 4352345345,
  "ethBridge": {
      "bridge": "0x8814E01b1D5817182AAE924043cb7871731116c6",
      "inbox": "0x52C12f0242F858b9F5F88E3151E1F1099D2523b2",
      "outbox": "0xb4e80F0f009CdC5e0faA59f974dDCc4D046Ed47C",
      "rollup": "0x44492C247bEBF2cd1AbDB6537Fcb7c23A33Bae3a",
      "sequencerInbox": "0xEfE6A392560FF613bDc687CCb952FCa7d4734DFa"
  },

  "tokenBridge": {
      "parentCustomGateway": "",
      "parentErc20Gateway": "0x3095Ac75033a6041A8289a73394283DEC1f4fbaA",
      "parentGatewayRouter": "0xb030bCB6d202F51F9d258352b589F7Cb92D9eB7e",
      "parentMultiCall": "",
      "parentProxyAdmin": "",
      "parentWeth": "",
      "parentWethGateway": "",
      "childCustomGateway": "",
      "childErc20Gateway": "0x906dC3478fbD066b1fb5543C925A0892F05eaD96",
      "childGatewayRouter": "0xebd68C5E60F2E8d9C60a1F6bE4f142E937C67023",
      "childMultiCall": "",
      "childProxyAdmin": "",
      "childWeth": "",
      "childWethGateway": ""
  },
  "isCustom": true,
  "name": "Maroo Testnet",
  "retryableLifetimeSeconds": 604800,
  "parentChainId": 1,
  "isTestnet": false,
}


