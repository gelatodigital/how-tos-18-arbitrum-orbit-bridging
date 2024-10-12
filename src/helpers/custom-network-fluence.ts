import { ArbitrumNetwork } from "@arbitrum/sdk";

export const fluenceNetwork: ArbitrumNetwork = {
    chainId: 9999999,
    confirmPeriodBlocks: 20,
    ethBridge: {
      inbox: "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95",
      bridge: "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A",
      outbox: "0x50Df2E43aDefee3b6510b637697d30e7dc155e13",
      rollup: "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f",
      sequencerInbox: "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f",
    },
    tokenBridge: {
      parentCustomGateway: "",
      parentErc20Gateway: "0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D",
      parentGatewayRouter: "0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd",
      parentMultiCall: "",
      parentProxyAdmin: "",
      parentWeth: "",
      parentWethGateway: "",
      childCustomGateway: "",
      childErc20Gateway: "0x08dE8bf67c62e5cf73729372750f79E82388df6a",
      childGatewayRouter: "0xCEC8A395617593B30BEC7c199a3Ae3Fe40186dB8",
      childMultiCall: "",
      childProxyAdmin: "",
      childWeth: "",
      childWethGateway: "",
    },
    parentChainId: 1,
    isTestnet:false,
    isCustom:true,
    name: "fluence",
    retryableLifetimeSeconds: 7 * 24 * 60 * 60,
    nativeToken: "x236501327e701692a281934230AF0b6BE8Df3353",
  };


