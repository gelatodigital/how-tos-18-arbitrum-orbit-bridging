import { ArbitrumNetwork } from "@arbitrum/sdk";

export const blueberryNetwork: ArbitrumNetwork = {
    chainId: 88153591557,
    confirmPeriodBlocks: 20,
    ethBridge: {
      inbox: "0x438d3Fb3B49C4aB9FD01791B5f297A0a415f66C0",
      bridge: "0x3986D14164B3B6EcADAb9376Efe4E905a2a32d68",
      outbox: "0x78be110441359d69cffeEa1941259C8A5292D886",
      rollup: "0x78Caf4A899A3949C6109d17a76fD5A2DB29dA2f5",
      sequencerInbox: "0xa41c89A543dF14B4d5C06dD1e7B94AEd01542E95",
    },
    tokenBridge: {
      parentCustomGateway: "",
      parentErc20Gateway: "0x01E1bE90c617b076978b37aCA9552877a15a7006",
      parentGatewayRouter: "0xf446986e261E84aB2A55159F3Fba60F7E8AeDdAF",
      parentMultiCall: "",
      parentProxyAdmin: "",
      parentWeth: "",
      parentWethGateway: "",
      childCustomGateway: "",
      childErc20Gateway: "0xdba116E322fd5bE8072E2BdDBDA096fed501586B",
      childGatewayRouter: "0xbFE42eF8429c5d5452E23b09910e35748eCe72CF",
      childMultiCall: "",
      childProxyAdmin: "",
      childWeth: "",
      childWethGateway: "",
    },
    parentChainId: 421614,
    isTestnet:true,
    isCustom:true,
    name: "Blueberry",
    retryableLifetimeSeconds: 7 * 24 * 60 * 60,
    nativeToken: "0xf5055e7C5Ea7b941E4ebad2F028Cb29962a3168C",
  };


