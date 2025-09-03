import { ArbitrumNetwork } from "@arbitrum/sdk";

export const fluenceStagingNetwork: ArbitrumNetwork ={
  "chainId": 123420000220,
  "confirmPeriodBlocks": 4352345345,
  "ethBridge": {
      "bridge": "0x1054F3e8dF8B60655eDFA52b546D08032B11888b",
      "inbox": "0x8C9d20e981C23e1dc6EDaf0cc8587748dfaaceA8",
      "outbox": "0x6198eF01e06933FA5E0A8044Cb6ed27076cC5169",
      "rollup": "0xC8203fC394F69D1e88EC49DAD2a1d8F84DF10891",
      "sequencerInbox": "0x90Dc883719Cfa2f33F3398698b48575238a55677"
  },

  "tokenBridge": {
      "parentCustomGateway": "",
      "parentErc20Gateway": "0xFd9fbdde96558EE2389Cf969791dEbF3b2e03533",
      "parentGatewayRouter": "0xC1ffeb6E7adB3d885C00AEE4C59eA681F7799F96",
      "parentMultiCall": "",
      "parentProxyAdmin": "",
      "parentWeth": "",
      "parentWethGateway": "",
      "childCustomGateway": "",
      "childErc20Gateway": "0x4F5149a68D42B1c890761d4791CA1a14043FD87D",
      "childGatewayRouter": "0xc1C51E3c40A23e12312067f409c800a1Ebe450f9",
      "childMultiCall": "",
      "childProxyAdmin": "",
      "childWeth": "",
      "childWethGateway": ""
  },
  "isCustom": true,
  "name": "Fluence Staging",
  "retryableLifetimeSeconds": 604800,
  "parentChainId": 11155111,
  "isTestnet": true,
  "nativeToken": "0x8048d4242BCd08815541380e456E40bE04d16D90"
}


