<template>
  <div>
    <main :class="`md:flex flex-wrap`">
      <sidebar/>

      <section :class="`w-full md:w-2/3 p-8 text-xl ml-auto`">

        <div :class="`w-full md:w-3/4 transaction-title mb-16`">
          <h1 :class="`w-full md:w-4/5 border-b-4 border-white`">
          <span>
            Transactions
          </span>
          </h1>
        </div>

        <div v-if="transfers.length === 0" class="message-empty text-sm">No transfers yet</div>

        <div v-else>
          <div>
            <a
              :href="getTransferLink(transfer.hash)"
              class="transfer flex text-sm mb-2"
              v-for="transfer in transfers"
              :key="transfer.hash"
            >
              <div v-if="isOutgoingTransfer(transfer)" class="w-full md:w-1/12 my-auto transfer-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="-6 -6.5 24 24"
                  width="24"
                  height="24"
                  preserveAspectRatio="xMinYMin"
                  class="icon"
                >
                  <path
                    d="M7.828 2.414H2.243a1 1 0 1 1 0-2h8a.997.997 0 0 1 1 1v8a1 1 0 0 1-2 0V3.828l-6.779 6.779A1 1 0 0 1 1.05 9.192l6.778-6.778z"
                  />
                </svg>
              </div>
              <div v-else class="w-full md:w-1/12 my-auto transfer-icon incoming">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="-6.5 -6.5 24 24"
                  width="24"
                  height="24"
                  preserveAspectRatio="xMinYMin"
                  class="icon"
                >
                  <path
                    d="M3.828 8.9h5.586a1 1 0 0 1 0 2h-8a.997.997 0 0 1-1-1v-8a1 1 0 1 1 2 0v5.585L9.192.707a1 1 0 1 1 1.415 1.414L3.828 8.9z"
                  />
                </svg>
              </div>

              <div class="w-11/12 flex transfer-content">
                <div
                  v-if="isOutgoingTransfer(transfer)"
                  class="transfer-address"
                >{{ compressAddress(transfer.to, 15, 10) }}</div
                >
                <div v-else class="transfer-address">
                  {{ compressAddress(transfer.from, 20, 10) }}
                </div>
                <div class="transfer-footer ml-2">
                  <span class="transfer-shard">{{ formatShard(transfer) }}</span>
                  <span class="transfer-date">
                    {{ formatTimestamp(Number(transfer.timestamp) * 1000) }}
                  </span>
                </div>
                <div class="ml-1">
                  (
                  <span v-if="isOutgoingTransfer(transfer)" class="transfer-amount"
                  > - {{
                      (transfer.extraInfo && transfer.extraInfo.symbol) ? `${transfer.extraInfo.amount} ${transfer.extraInfo.symbol}` : `${formatTokenAmount(transfer)} ONE`
                    }}</span
                  >
                  <span v-else class="transfer-amount incoming"
                  > + {{
                      (transfer.extraInfo && transfer.extraInfo.symbol) ? `${transfer.extraInfo.amount} ${transfer.extraInfo.symbol}` : `${formatTokenAmount(transfer)} ONE`
                    }}</span
                  >
                  )
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import {mapState} from "vuex";
import moment from "moment-timezone";
import Sidebar from "../components/Sidebar.vue";

const {Unit} = require("@harmony-js/utils");
import {
  getTransfers,
  getNetworkLink,
  getTransactionCount,
  removeDups
} from "../lib/txnService";
import {getExtraTxInfo} from "../services/Hrc20Service";

export default {
  components: {
    Sidebar
  },

  data: () => ({
    limit: 100,
    txCount: 1,
    page: 0,
    loadMoreLoading: false
  }),

  computed: mapState({
    address: state => state.active.address,
    transfers: state => state.transfers
  }),

  mounted() {
    this.loadTransfers();
  },

  methods: {
    async loadTransfers() {
      this.txCount = await getTransactionCount(this.address);
      this.page = 0;
      const transfersData = await getTransfers(
        this.address,
        this.page,
        this.limit
      );

      for (let i = 0; i < transfersData.transactions.length; i++) {
        transfersData.transactions[i].extraInfo = await getExtraTxInfo(transfersData.transactions[i].to, transfersData.transactions[i].input)
      }

      this.$store.commit(
        "transfers",
        removeDups(transfersData.transactions)
      );

      this.$store.commit("loading", false);
    },

    async loadMore(e) {
      e.preventDefault();
      this.loadMoreLoading = true;

      this.page += 1;
      const transfersData = await getTransfers(
        this.address,
        this.page,
        this.limit
      );

      for (let i = 0; i < transfersData.transactions.length; i++) {
        transfersData.transactions[i].extraInfo = await getExtraTxInfo(transfersData.transactions[i].to, transfersData.transactions[i].input)
      }

      this.$store.commit(
        "pushTransfers",
        removeDups(transfersData.transactions)
      );

      if (transfersData.transactions.length === 0) {
        this.txCount = this.transfers.length;
      }

      this.loadMoreLoading = false;
    },

    refreshTransfers() {
      this.$store.commit("loading", true);
      this.loadTransfers();
    },

    getTransferLink(hash) {
      const path = "/tx/" + hash;

      return getNetworkLink(path);
    },

    isOutgoingTransfer(transfer) {
      return transfer.from === this.address;
    },

    formatTokenAmount(transfer) {
      return new Unit(transfer.value)
        .asWei()
        .toEther()
        .toString();
    },

    formatTimestamp(timestamp) {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      return moment(timestamp)
        .tz(timezone)
        .format("MM/DD/YYYY HH:mm:ss z");
    },

    compressAddress(address) {
      return (
        address.substr(0, 10) +
        "..." +
        address.substr(address.length - 5, address.length)
      );
    },

    formatShard(transfer) {
      return (
        " from shard " +
        transfer.shardID.toString() +
        " to shard " +
        transfer.toShardID.toString()
      );
    }
  }
};
</script>
