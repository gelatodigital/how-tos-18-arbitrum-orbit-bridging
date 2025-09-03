import { ArbitrumNetwork } from "@arbitrum/sdk";

export const synfuturesTestnetNetwork: ArbitrumNetwork ={
  "chainId": 420001846,
  "confirmPeriodBlocks": 4352345345,
  "ethBridge": {
      "bridge": "0xf0B4b4A8ee950ED656301E13Cb4c524939480d8b",
      "inbox": "0xb1BDA88e8F452f83A72Ebb793e1E30Ec4b7d248e",
      "outbox": "0xAa4e26Ffd1E88198682edF4Cd4E70373665a3C66",
      "rollup": "0xdc39b6C651FDeAA186b084f794ab28f3Da18E2D9",
      "sequencerInbox": "0x062373449A47a931f03522E8c7269916C1707965"
  },

  "tokenBridge": {
      "parentCustomGateway": "",
      "parentErc20Gateway": "0x27Ece334E8F84FC63848b334BC94C4C33D04E97C",
      "parentGatewayRouter": "0x2Ed7412fdB4c2218A744058851670496751411Fc",
      "parentMultiCall": "",
      "parentProxyAdmin": "",
      "parentWeth": "",
      "parentWethGateway": "",
      "childCustomGateway": "",
      "childErc20Gateway": "0xA387162C155a547f24152DF94c2058fb704385ba",
      "childGatewayRouter": "0xFC5eB11244Ee269a3C5e6Cc3C38650af254d07d6",
      "childMultiCall": "",
      "childProxyAdmin": "",
      "childWeth": "",
      "childWethGateway": ""
  },
  "isCustom": true,
  "name": "SynFutures Testnet",
  "retryableLifetimeSeconds": 604800,
  "parentChainId": 421614,
  "isTestnet": true,
  "nativeToken": "0x62D95e394397E415A8205295b6C9ae2C0e31a025"
}


