import { ArbitrumNetwork } from "@arbitrum/sdk";

export const alephZeroTest:ArbitrumNetwork = {
  "chainId": 2039,
  "confirmPeriodBlocks": 4352345345,
  "ethBridge": {
      "bridge": "0xCB5c0B38C45Fad0C20591E26b0b3C3809123994A",
      "inbox": "0xb27fd27987a71a6B77Fb8705bFb6010C411083EB",
      "outbox": "0x1aE032759B823A71e08675Bab2bBaf9d6f26549C",
      "rollup": "0xC8C08A4DbbF3367c8441151591c3d935947CB42F",
      "sequencerInbox": "0x16Ef70c48EF4BaaCfdaa4AfdD37F69332832a0bD"
  },
  "tokenBridge": {
      "parentCustomGateway": "",
      "parentErc20Gateway": "0xa4FB064D61c993FCa95251fc94AbAd6b57dD87DB",
      "parentGatewayRouter": "0x834082BD7cF3DaE7e892B4d259DaE8Ed33623f47",
      "parentMultiCall": "",
      "parentProxyAdmin": "",
      "parentWeth": "",
      "parentWethGateway": "",
      "childCustomGateway": "",
      "childErc20Gateway": "0x55804f8400F25434626c18BcCBF932BFD0675cC6",
      "childGatewayRouter": "0x39420aF084d60834F5BCbF29717cFf9EA57a0a6d",
      "childMultiCall": "",
      "childProxyAdmin": "",
      "childWeth": "",
      "childWethGateway": ""
  },
  "parentChainId": 11155111,
  "isCustom": true,
  "name": "Aleph Zero EVM testnet",
  "retryableLifetimeSeconds": 604800,
  "nativeToken": "0x88607eBfa048E7898db5ECA9A0fbFf6bd9f959ee",
  "isTestnet": true
}


