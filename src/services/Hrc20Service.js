import artifact from "../lib/contracts/artifacts/artifact.json"
import {getHarmony} from "../lib/txnService"
import BN from "bn.js"
import BigNumber from "bignumber.js"
import {fromBech32, toBech32} from "@harmony-js/crypto"
import { bnToString } from "@harmony-js/utils";

export const oneToHexAddress = (address) =>
    getHarmony().crypto.getAddress(address).basicHex

export const getContractInstance = (contractAddress) => {
    const hmy = getHarmony()
    return hmy.contracts.createContract(artifact.abi, contractAddress)
}

export async function getTokenBalance(address, contractAddress) {
    const instance = getContractInstance(contractAddress)
    const hexAddress = oneToHexAddress(address)
    return await instance.methods.balanceOf(hexAddress).call()
}

export async function getTokenDecimals(contractAddress) {
    const instance = getContractInstance(contractAddress)
    let decimals = await instance.methods.decimals().call()
    return new BN(decimals, 16).toNumber()
}

export async function getTokenSymbol(contractAddress) {
    const instance = getContractInstance(contractAddress)
    return await instance.methods.symbol().call()
}

export async function getExtraTxInfo(to, hexData) {
  try {
    const contract = getContractInstance(fromBech32(to));
    let decodeParameters = (inputs, data) => {
      if (0 == inputs.length) return [];
      let params = contract.abiCoder.decodeParameters(inputs, data);
      params.length = inputs.length;
      return Array.from(params);
    };

    const no0x = hexData.startsWith("0x") ? hexData.slice(2) : hexData;
    const sig = no0x.slice(0, 8).toLowerCase();
    const method = contract.abiModel.getMethod("0x" + sig);
    if (!method) return false;

    const params = decodeParameters(method.inputs, "0x" + no0x.slice(8));
    const decimals = await contract.methods.decimals().call();
    const symbol = await contract.methods.symbol().call();
    return {
      to: toBech32(params[0]),
      amount: new BigNumber(params[1]).dividedBy(Math.pow(10, new BN(decimals, 16).toNumber())).toString(),
      symbol,
    };
  } catch (err) {
    return false;
  }
}
