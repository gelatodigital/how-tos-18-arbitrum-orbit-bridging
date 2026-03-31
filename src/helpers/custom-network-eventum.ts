import { ArbitrumNetwork } from "@arbitrum/sdk";

export const EventumNetwork: ArbitrumNetwork ={
  "chainId": 161803,
  "confirmPeriodBlocks": 4352345345,
  "ethBridge": {
      "bridge": "0xAD3026961087eccEC0508D411bb9fb405E086B38",
      "inbox": "0xA0a1B42Dcb62d371D5ABf4523bD614b0Eaa11296",
      "outbox": "0xEC32Bd08fAf9533371384AD13045116930DBC040",
      "rollup": "0xD226Bd8D36725f4CE12961370211DFeEef1AbBbC",
      "sequencerInbox": "0x8696D32899e59F8a2ed76463cC0A0B07e56db025"
  },

  "tokenBridge": {
      "parentCustomGateway": "",
      "parentErc20Gateway": "0x8D21dfEA9231Db85dCe72b8d9F18e917d833d4B1",
      "parentGatewayRouter": "0x1628CE6477221fdD1CD88ea3D15d587DfC59E66A",
      "parentMultiCall": "",
      "parentProxyAdmin": "",
      "parentWeth": "",
      "parentWethGateway": "",
      "childCustomGateway": "",
      "childErc20Gateway": "0x58dEBCB8DB514aa446D63808F7afC1625f251A33",
      "childGatewayRouter": "0xb87eCb9984Ecff97859cdcf14F15c9A219Abd2dD",
      "childMultiCall": "",
      "childProxyAdmin": "",
      "childWeth": "",
      "childWethGateway": ""
  },
  "isCustom": true,
  "name": "Eventum",
  "retryableLifetimeSeconds": 604800,
  "parentChainId": 42161,
  "isTestnet": false,
}


