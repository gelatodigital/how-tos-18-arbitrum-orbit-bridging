import { ArbitrumNetwork } from "@arbitrum/sdk";

export const fluenceTestnetNetwork: ArbitrumNetwork ={
  "chainId": 52164803,
  "confirmPeriodBlocks": 4352345345,
  "ethBridge": {
      "bridge": "0x8aE1671D4091CAb41b1eeFb468e6fb6AF3760165",
      "inbox": "0x957B4794e5c7168b244f6346fE8F80b22CdEa9f8",
      "outbox": "0x60CEee1c3616a4533638413764E0a2Af3aAA27c8",
      "rollup": "0xABe31dfC0a5371EAa7D065e70869a25506c09304",
      "sequencerInbox": "0x014E9Ea50d19Dd78463D0BC62BA75985D08Aa1d7"
  },

  "tokenBridge": {
      "parentCustomGateway": "",
      "parentErc20Gateway": "0xa6aC19cBD305e98a70cf0F42Ea2d37316dfD7B32",
      "parentGatewayRouter": "0xCCE3d84f480EB465424B7B78676619C767D11bf8",
      "parentMultiCall": "",
      "parentProxyAdmin": "",
      "parentWeth": "",
      "parentWethGateway": "",
      "childCustomGateway": "",
      "childErc20Gateway": "0x02bC5BEDa82Cf1067368999923a56C0478c050f4",
      "childGatewayRouter": "0xE905DC3CdddC0867608F8D42F0c52c69DAdeCEe3",
      "childMultiCall": "",
      "childProxyAdmin": "",
      "childWeth": "",
      "childWethGateway": ""
  },
  "isCustom": true,
  "name": "Fluence Testnet",
  "retryableLifetimeSeconds": 604800,
  "parentChainId": 11155111,
  "isTestnet": true,
  "nativeToken": "0x8048d4242BCd08815541380e456E40bE04d16D90"
}


