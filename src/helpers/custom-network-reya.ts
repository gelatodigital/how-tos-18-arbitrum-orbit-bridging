import { ArbitrumNetwork } from "@arbitrum/sdk";

export const reyaNetwork: ArbitrumNetwork = {
    chainId: 89346162,
    confirmPeriodBlocks: 20,
    ethBridge: {
      inbox: "0x9DcaEC2AeCf70D5B77c5F6cb93A3D823e8AE7a52",
      bridge: "0x2a082753b39bb4DDa6678b968A630790b16425D5",
      outbox: "0xE81F68A31fA66e232D3Eb5e6f264310425265974",
      rollup: "0xF6E65f912C5787fB472B9add5F9AB9f70E0A3F4B",
      sequencerInbox: "0xDFe1f6a4F26aDd4CB688027b2e86d8cBF7CCA1a7",
    },
    tokenBridge: {
      parentCustomGateway: "",
      parentErc20Gateway: "0xfF8ff3C657BFC5f68B7F7528764b0C9b21a0b36a",
      parentGatewayRouter: "0xafE666Ff60b84762246e9fF1f74Ff552DC6a1626",
      parentMultiCall: "",
      parentProxyAdmin: "",
      parentWeth: "",
      parentWethGateway: "",
      childCustomGateway: "",
      childErc20Gateway: "0x5f155398181f0DA3B4874a24C9615E23f4C7924c",
      childGatewayRouter: "0x8c62C850737Fb5001bfdE17cb5E2491fF321562C",
      childMultiCall: "",
      childProxyAdmin: "",
      childWeth: "",
      childWethGateway: "",
    },
    parentChainId: 11155111,
    isCustom: true,
    isTestnet:true,
    name: "Reya Cronos",
    retryableLifetimeSeconds: 7 * 24 * 60 * 60
    };