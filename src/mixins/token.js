import { mapState } from "vuex";
import { getTokenBalance } from "../lib/contracts/token-api";
import BigNumber from "bignumber.js";

export default {
  computed: {
    ...mapState({
      tokens: (state) => state.tokens,
      chainId: (state) => state.network.chainId,
      address: (state) => state.active.address,
    }),
    tokenArray() {
      return Object.keys(this.tokens[this.chainId]);
    },
    getContractAddressList() {
      const networkList = Object.keys(this.tokens);
      let addressList = [];
      networkList.forEach((network) => {
        const tokenList = Object.keys(this.tokens[network]);
        tokenList.forEach((token) => {
          addressList.push(this.tokens[network][token].address);
        });
      });
      return addressList;
    },
  },
  methods: {
    async loadAllTokenBalance() {
      for (let symbol of this.tokenArray) {
        await this.loadTokenBalance(symbol);
      }
    },
    getTokenBalance(symbol) {
      const artifact = this.getTokenArtifact(symbol);
      if (!artifact) return 0;
      return artifact.balance;
    },
    getTokenArtifact(symbol) {
      return this.tokens[this.chainId][symbol];
    },
    getContractAddress(symbol) {
      return this.getTokenArtifact(symbol).address;
    },
    getTokenDecimals(symbol) {
      return this.getTokenArtifact(symbol).decimals;
    },
    async loadTokenBalance(symbol) {
      const findIndex = this.tokenArray.find((token) => token === symbol);
      if (!findIndex) return;
      let weiBalance = await getTokenBalance(
        this.address,
        this.getContractAddress(symbol)
      );
      let balance = BigNumber(weiBalance)
        .dividedBy(Math.pow(10, this.getTokenDecimals(symbol)))
        .toFixed(6);
      this.$store.commit("loadTokenBalance", {
        network: this.chainId,
        symbol,
        balance,
      });
    },
    async refreshTokens() {
      this.$store.commit("loading", true);
      await this.loadAllTokenBalance();
      this.$store.commit("loading", false);
    },
  },
};
