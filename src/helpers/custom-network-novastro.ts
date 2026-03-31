import { ArbitrumNetwork } from "@arbitrum/sdk";

export const novastroNetwork: ArbitrumNetwork = {
    chainId: 560098,
    confirmPeriodBlocks: 20,
    ethBridge: {
      inbox: "0xF4192088950FCa65116be71d02225fa0e2b96369",
      bridge: "0x0D64cAD8ce839e916299e7BBf93052311716765a",
      outbox: "0xdAa3F67D5Db0da9Bd71527B9637cB036200590A4",
      rollup: "0xCaA9780939d5Db6994caBfc50Cb59f9FC929cB4E",
      sequencerInbox: "0x243F73F7cE4B7351fA32eAeb811B724b4c33aC5D",
    },
    tokenBridge: {
      parentCustomGateway: "",
      parentErc20Gateway: "0x31Dc4c50a25cF7f4d44C3EAAA56f8947157Bfac5",
      parentGatewayRouter: "0x5fFBA894996304394b25b1dF8A004AB7cc2c6CbD",
      parentMultiCall: "",
      parentProxyAdmin: "",
      parentWeth: "",
      parentWethGateway: "",
      childCustomGateway: "",
      childErc20Gateway: "0x5DB46A1A86d6d1Ca2d1ed17F373564Ac030c9FAe",
      childGatewayRouter: "0xf3E5b7051FcadA2F8773795C8C77E131c43C6223",
      childMultiCall: "",
      childProxyAdmin: "",
      childWeth: "",
      childWethGateway: "",
    },
    parentChainId: 421614,
    isTestnet:true,
    isCustom:true,
    name: "Novastro Testnet",
    retryableLifetimeSeconds: 7 * 24 * 60 * 60,
    nativeToken: "0x0DE1fb55a9Ad7FC40Fb5a75D53e78A6d6e0bbC5D",
  };


