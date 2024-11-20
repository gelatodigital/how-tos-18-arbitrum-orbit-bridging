import { ArbitrumNetwork } from "@arbitrum/sdk";

export const alephZero:ArbitrumNetwork = {
  "chainId": 41455,
  "confirmPeriodBlocks": 4352345345,
  "ethBridge": {
      "bridge": "0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9",
      "inbox": "0x56D8EC76a421063e1907503aDd3794c395256AEb",
      "outbox": "0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e",
      "rollup": "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98",
      "sequencerInbox": "0xF75206c49c1694594E3e69252E519434f1579876"
  },
  "tokenBridge": {
      "parentCustomGateway": "",
      "parentErc20Gateway": "0xccaF21F002EAF230c9Fa810B34837a3739B70F7B",
      "parentGatewayRouter": "0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812",
      "parentMultiCall": "",
      "parentProxyAdmin": "",
      "parentWeth": "",
      "parentWethGateway": "",
      "childCustomGateway": "",
      "childErc20Gateway": "0x2A5a79061b723BBF453ef7E07c583C750AFb9BD6",
      "childGatewayRouter": "0xD296d45171B97720D3aBdb68B0232be01F1A9216",
      "childMultiCall": "",
      "childProxyAdmin": "",
      "childWeth": "",
      "childWethGateway": ""
  },
  "parentChainId":1,
  "isCustom": true,
  "name": "Aleph Zero EVM",
  "retryableLifetimeSeconds": 604800,
  "nativeToken": "0xdD0ae774F7E300CdAA4EA371cD55169665Ee6AFe",
  "isTestnet": false
}


