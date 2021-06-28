import FreyakaTokenAbi from "./contracts/artifacts/artifact.json";

const contractAddress = '0x9b68BF4bF89c115c721105eaf6BD5164aFcc51E4'
const contractABI = FreyakaTokenAbi.abi

/**
 * Initialization
 * @Param {Object} Callback Returns an account address
 */
function Init(callback, contract) {
  if (typeof window.ethereum === "undefined") {
    alert("Looks like you need a Dapp browser to get started.");
    alert("Consider installing MetaMask!");
  } else {
    ethereum.enable()
      .catch(function (reason) {
        if (reason === "User rejected provider access") {
        } else {
          alert("There was an issue signing you in.");
        }
      }).then(function (accounts) {
      let currentProvider = web3.currentProvider;
      let Web3 = web3js.getWeb3();
      web3 = new Web3();
      web3.setProvider(currentProvider);
      contract = new web3.eth.Contract(contractABI, contractAddress);
      callback(accounts[0]);
    });
  }
}

export default {
  init,
}
