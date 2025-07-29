import { ArbitrumNetwork } from "@arbitrum/sdk";

export const FreeqTestnetNetwork: ArbitrumNetwork ={
  "chainId": 80087,
  "confirmPeriodBlocks": 45818,
  "ethBridge": {
      "bridge": "0x4Ab1dFf63Ed7d86293b6c7B22FB3dd35D0d892C7",
      "inbox": "0x1b348C3c08938B4b753fF1700AE7B2C2bd0c5074",
      "outbox": "0x08C8dc6533a7D06d0F6188Edd4fb026ae0a174EE",
      "rollup": "0x631522305A0e84e59726ba1816329987b3a6737f",
      "sequencerInbox": "0x382d83DC4a4958dD70919752ADD49fFb2382f9a9"
  },

  "tokenBridge": {
      "parentCustomGateway": "",
      "parentErc20Gateway": "0x5a2338B09873c1A054a0361ad61ddb83652faB3d",
      "parentGatewayRouter": "0x3903942Def038B4a19D40F194BD5ea04D72dd750",
      "parentMultiCall": "",
      "parentProxyAdmin": "",
      "parentWeth": "",
      "parentWethGateway": "",
      "childCustomGateway": "",
      "childErc20Gateway": "0xa9b5f77E6fAc3CF349dA9caFD2F757EbaF551291",
      "childGatewayRouter": "0x529CE318439E131a3A95d54302ed2a358e0Fe8A5",
      "childMultiCall": "",
      "childProxyAdmin": "",
      "childWeth": "",
      "childWethGateway": ""
  },
  "isCustom": true,
  "name": "Freeq Testnet",
  "retryableLifetimeSeconds": 604800,
  "parentChainId": 80069,
  "isTestnet": true,
  "nativeToken": "0xFCBD14DC51f0A4d49d5E53C2E0950e0bC26d0Dce"
}


