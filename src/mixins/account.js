import { mapState } from "vuex";
import { getBalance, getShardInfo } from "../lib/txnService";
import { Unit } from "@harmony-js/utils";
import token from "./token";
export default {
  mixins: [token],
  computed: mapState({
    shard: (state) => state.shard,
    address: (state) => state.active.address,
  }),

  methods: {
    async loadShardingInfo() {
      let shardArray = await getShardInfo();
      this.$store.commit("shardArray", shardArray);
      return shardArray;
    },

    async loadOneBalance() {
      let result = await getBalance(this.address, this.shard);
      let balance = Unit.Wei(result).toEther();
      this.$store.commit("balance", balance);
    },

    async refreshAccount() {
      this.$store.commit("loading", true);
      await this.loadShardingInfo();
      await this.loadOneBalance();
      this.$store.commit("loading", false);
    },
  },
};
