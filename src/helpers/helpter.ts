
import { Provider } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";



  export const getBaseFee = async (provider: Provider): Promise<BigNumber> => {
    const baseFee = (await provider.getBlock('latest')).baseFeePerGas
    if (!baseFee) {
      throw new Error(
        'Latest block did not contain base fee, ensure provider is connected to a network that supports EIP 1559.'
      )
    }
    return baseFee
  }