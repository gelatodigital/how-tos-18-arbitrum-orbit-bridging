import { ArbitrumNetwork } from "@arbitrum/sdk";

export const citronusCitroNetwork: ArbitrumNetwork = {
  chainId: 34949059,
  confirmPeriodBlocks: 4352345345,
  ethBridge: {
    bridge: "0x1EB442D8626fA3B2dE6B070DEB0BF587e400845d",
    inbox: "0x0958cC05A797e74cc726bEf4A157ba2c569b82a4",
    outbox: "0x511c04e385a51a1632e47534b928A62548527951",
    rollup: "0xc87d897647bA24C0b4efE3CD6dDddbDFa0b503D6",
    sequencerInbox: "0x336cf2282F0E50eD7b3Fa64c50bB0dD231327793",
  },

  tokenBridge: {
    parentCustomGateway: "0x534e23958FD9EAA8f54f284167231fF6F5544b57",
    parentErc20Gateway: "",
    parentGatewayRouter: "0x92f41E1aF21DA3a4C151df32D6040A79fcea38B2",
    parentMultiCall: "0x73465577E9FD7Cd585E4270F23A9eBa99B92b6eD",
    parentProxyAdmin: "0x8aCDEb77266D99d0dC63c2b0BE5A9B8bA953F2d6",
    parentWeth: "0x0000000000000000000000000000000000000000",
    parentWethGateway: "0x0000000000000000000000000000000000000000",
    childCustomGateway: "0x4904D329f7c5c99106a263550Ccee916f2637902",
    childErc20Gateway: "",
    childGatewayRouter: "0x7a9971e1329C242010A080aF74b1057267366f19",
    childMultiCall: "0xf1689379621Ff988ADD4e2d0305E8ed60a6b8d82",
    childProxyAdmin: "0x2C271A270828816e9DD5362761806ADf582C7B10",
    childWeth: "0x0000000000000000000000000000000000000000",
    childWethGateway: "0x0000000000000000000000000000000000000000",
  },
  isCustom: true,
  name: "Citro",
  parentChainId: 11155111,
  isTestnet: true,
  nativeToken: "0xD5e28344C86C7dA2C291e20603AeB2ec624dd3C7",
};
