import { ArbitrumNetwork } from "@arbitrum/sdk";

export const eduTestnetNetwork: ArbitrumNetwork ={
  "chainId": 656476,
  "confirmPeriodBlocks": 4352345345,
  "ethBridge": {
      "bridge": "0xbf3D64671154D1FB0b27Cb1decbE1094d7016448",
      "inbox": "0x67F231eDC83a66556148673863e73D705422A678",
      "outbox": "0x0FcCC9dC3E128fFFc2c4d01E523e05FcF28629B3",
      "rollup": "0x0A94003d3482128c89395aBd94a41DA8eeBB59f7",
      "sequencerInbox": "0xd5131c1924f080D45CA3Ae97262c0015F675004b"
  },

  "tokenBridge": {
      "parentCustomGateway": "",
      "parentErc20Gateway": "0xd16E8b904BE8Db6FaB0C375c4eeA5BCDC6dcAa91",
      "parentGatewayRouter": "0x962170D0A0D123061D8A8D344eEB5664aa62C407",
      "parentMultiCall": "",
      "parentProxyAdmin": "",
      "parentWeth": "",
      "parentWethGateway": "",
      "childCustomGateway": "",
      "childErc20Gateway": "0x2a5302C754f0DcDe224Cd26F887b9B976CBeD972",
      "childGatewayRouter": "0xFc94235bbfaC6b8BB6CAE49297c8a1D70a69b484",
      "childMultiCall": "",
      "childProxyAdmin": "",
      "childWeth": "",
      "childWethGateway": ""
  },
  "isCustom": true,
  "name": "Fluence Testnet",
  "retryableLifetimeSeconds": 604800,
  "parentChainId": 421614,
  "isTestnet": true,
  "nativeToken": "0x4489254947C9027bA6506c57DaC86bECc9c25384"
}


