import { ArbitrumNetwork } from "@arbitrum/sdk";

export const marooTestnetNetwork: ArbitrumNetwork ={
  "chainId": 250815,
  "confirmPeriodBlocks": 4352345345,
  "ethBridge": {
      "bridge": "0x3F5F4EDBa4251746130D848742DA8a50A9dB6e98",
      "inbox": "0x971B40168C26eD14120cC9B0F0D2F1BfD795e276",
      "outbox": "0xfF1537D258Ef296261acce2BC50A24eFE59E16C0",
      "rollup": "0x80189a89c9cA0B00C146eEc29c36D046D388adD9",
      "sequencerInbox": "0xcf6e502ABD3817e4c1214c56d546cf7918445C69"
  },

  "tokenBridge": {
      "parentCustomGateway": "",
      "parentErc20Gateway": "0x28E7bcaC83bbfdB23B009e9CBc29a7B46186613e",
      "parentGatewayRouter": "0xA389bE974164BDaf8Bed86935BE5E4C6131464F4",
      "parentMultiCall": "",
      "parentProxyAdmin": "",
      "parentWeth": "",
      "parentWethGateway": "",
      "childCustomGateway": "",
      "childErc20Gateway": "0xE9E0cB3358bfcc79Fc9e1de2E1e98c4D605991cd",
      "childGatewayRouter": "0xF4a00e22518f9C855E0D7FBC4436f2fA5D362a14",
      "childMultiCall": "",
      "childProxyAdmin": "",
      "childWeth": "",
      "childWethGateway": ""
  },
  "isCustom": true,
  "name": "Maroo Testnet",
  "retryableLifetimeSeconds": 604800,
  "parentChainId": 11155111,
  "isTestnet": true,
}


