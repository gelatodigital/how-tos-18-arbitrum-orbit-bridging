import { ArbitrumNetwork } from "@arbitrum/sdk";

export const dkargoNetwork: ArbitrumNetwork = {
    chainId: 61022894,
    confirmPeriodBlocks: 20,
    ethBridge: {
      inbox: "0xB17a5495FA25FBcA887083b7048Bc60A796A201B",
      bridge: "0x42C4b496edA79215872De91f71D77F434098e162",
      outbox: "0x947fe294C167A6e9b7bc5c328AeF0aCe9ac83584",
      rollup: "0x11e3D0e9604a0AD8a8B32068B95e83d7C63b3af7",
      sequencerInbox: "0x48781bAec9B5f9eBCf6fd96134f24231c6987Aa0",
    },
    tokenBridge: {
      parentCustomGateway: "",
      parentErc20Gateway: "0x306485BFA7c6c0b533A9Bd3C3B363bE848c7A289",
      parentGatewayRouter: "0xcF6298ca74B278e5CB02B75f100D766BDfAC11A2",
      parentMultiCall: "",
      parentProxyAdmin: "",
      parentWeth: "",
      parentWethGateway: "",
      childCustomGateway: "",
      childErc20Gateway: "0xE400CAeDEf6F46E6C9aF10324F2C308363A1e246",
      childGatewayRouter: "0x8e7f3c9a7743a673C2395eD58bcb5b57168291e4",
      childMultiCall: "",
      childProxyAdmin: "",
      childWeth: "",
      childWethGateway: "",
    },
    parentChainId: 42161,
    isCustom: true,
    isTestnet:false,
    name: "Dkargo",
    retryableLifetimeSeconds: 7 * 24 * 60 * 60
    };