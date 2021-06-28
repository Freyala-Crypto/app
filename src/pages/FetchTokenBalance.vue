<template>
  <div>
    <main :class="`md:flex flex-wrap`">
      <sidebar v-if="loggedIn"/>

      <section :class="`w-full md:w-2/3 p-8 text-xl ${loggedIn ? 'ml-auto' : 'mx-auto'}`">

        <div :class="`${loggedIn ? 'w-full md:w-3/4' : 'w-full'} transaction-title mb-16`">
          <h1 :class="`${loggedIn ? 'w-full md:w-4/5' : 'w-full'} border-b-4 border-white`">
          <span>
            Token balance fetcher
          </span>
          </h1>
        </div>

        <div class="flex flex-wrap">

          <small class="w-full md:w-2/3">
            This page is meant to confirm balances of addresses containing HRC-20 tokens. This is a solution created
            because there is a lack of transparancy through the Harmony explorer as new tokens do not get added to the
            official explorer.
          </small>

          <div :class="`${loggedIn ? 'w-full md:w-2/3' : 'w-full'} mt-8`">
            <small>Token address:</small>
            <input v-model="contractAddress" @blur="fetchAddressBalance(addressValue)"
                   @keyup.enter="fetchAddressBalance(addressValue)" class="w-full"
                   placeholder="Insert token contract address.."/>
            <br>
            <br>
            <small>Token decimal:</small>
            <input v-model="contractDecimal" @blur="fetchAddressBalance(addressValue)"
                   @keyup.enter="fetchAddressBalance(addressValue)" type="number" class="w-full"
                   placeholder="Insert token decimals.."/>
            <br>
            <br>
            <small>Wallet address:</small>
            <input v-model="addressValue" @blur="fetchAddressBalance(addressValue)"
                   @keyup.enter="fetchAddressBalance(addressValue)" class="w-full"
                   placeholder="Lower case ONE address format.."/>
          </div>
          <div v-if="lookedUpAddressBalance" :class="`${loggedIn ? 'w-full md:w-2/3' : 'w-full'} mt-8`">
            Address: <a :href="`https://explorer.harmony.one/#/address/${ lookedUpAddress }`"
                        target="_blank">{{ lookedUpAddress }}</a> <br>
            Balance: {{ lookedUpAddressBalance }}
          </div>


          <div class="mt-8 w-full">
            <div v-if="(transactions === undefined && loadingTransactions) || loadingTransactions">
              <small>loading transactions...</small>
            </div>
            <div v-else-if="transactions === undefined"></div>
            <div v-else>
              <a
                :href="getTransferLink(transfer.hash)"
                class="transfer flex text-sm mb-2"
                v-for="transfer in transactions"
                :key="transfer.hash"
                target="_blank"
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
                    class="transfer-address w-1/3"
                  >{{ compressAddress(transfer.to, 15, 10) }}
                  </div
                  >
                  <div v-else class="transfer-address w-1/3">
                    {{ compressAddress(transfer.from, 20, 10) }}
                  </div>
                  <div class="transfer-footer w-1/3 ml-2">
                <span class="transfer-date">
                    {{ formatTimestamp(Number(transfer.timestamp) * 1000) }}
                  </span>
                  </div>
                  <div class="ml-1 w-1/3">
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
              <br>
              <small>* Click to go to explorer</small>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import moment from "moment-timezone";
import Sidebar from "../components/Sidebar.vue";
import BigNumber from "bignumber.js";
import {mapState} from "vuex";
import {getHarmony} from "../lib/txnService";

const {Unit} = require("@harmony-js/utils");
import {
  getTokenBalance,
} from "../lib/contracts/token-api";
import {getExtraTxInfo} from "../services/Hrc20Service";
import {
  getNetworkLink,
} from "../lib/txnService";

export default {
  components: {
    Sidebar
  },

  computed: {
    ...mapState({
      loggedIn: state => state.accounts.length
    })
  },

  data: () => ({
    contractAddress: '0x9b68BF4bF89c115c721105eaf6BD5164aFcc51E4',
    addressValue: '',
    lookedUpAddressBalance: undefined,
    lookedUpAddress: undefined,
    loading: false,
    transactions: undefined,
    contractDecimal: 18,
    loadingTransactions: false
  }),

  methods: {
    getTransferLink(hash) {
      const path = "/tx/" + hash;

      return getNetworkLink(path);
    },
    isOutgoingTransfer(transfer) {
      return transfer.from.toLowerCase() === this.addressValue.toLowerCase();
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
    },
    async fetchAddressBalance(addr) {
      this.loading = true
      this.lookedUpAddress = ''
      this.lookedUpAddressBalance = 0
      let weiBalance = await getTokenBalance(addr, this.contractAddress.toLowerCase());
      this.lookedUpAddressBalance = BigNumber(weiBalance).dividedBy(Math.pow(10, this.contractDecimal)).toFixed(6);
      this.lookedUpAddress = addr;
      this.loadingTransactions = true
      let transfersData = await getHarmony().messenger.send(
        "hmy_getTransactionsHistory",
        [
          {
            address: this.addressValue.toLowerCase(),
            pageIndex: 0,
            pageSize: 1000,
            fullTx: true,
            txType: "ALL",
            order: "DESC",
          },
        ],
        getHarmony().messenger.chainPrefix,
        getHarmony().defaultShardID
      );
      for (let i = 0; i < transfersData.result.transactions.length; i++) {
        transfersData.result.transactions[i].extraInfo = await getExtraTxInfo(transfersData.result.transactions[i].to, transfersData.result.transactions[i].input)
      }
      this.transactions = transfersData.result.transactions
      this.loadingTransactions = false
    },
    formatTokenAmount(transfer) {
      return new Unit(transfer.value)
        .asWei()
        .toEther()
        .toString();
    },
  }
};
</script>
