<template>
  <div>
    <main :class="`md:flex flex-wrap`">
      <sidebar v-if="loggedIn"/>

      <section :class="`w-full md:w-2/3 p-8 text-xl ${loggedIn ? 'ml-auto' : 'mx-auto'}`">

        <div :class="`${loggedIn ? 'w-full md:w-3/4' : 'w-full'} transaction-title mb-16`">
          <h1 :class="`${loggedIn ? 'w-full md:w-4/5' : 'w-full'} border-b-4 border-white`">
          <span>
            Holders
          </span>
          </h1>
        </div>

        <div class="flex flex-wrap">
          <div class="w-full">
            <h4>CIRCULATING SUPPLY: {{ circulatingMarketCap.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</h4>
            <h4>TOTAL SUPPLY: {{ totalMarketCap.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</h4>
            <small>* Address percentages are calculated over circulating supply</small> <br>
            <small>* Click address for more information on the explorer</small>
          </div>
        </div>
        <br>
        <hr>
        <br>

        <div v-if="finishedFetchingHolders === false" class="message-empty text-sm">Loading holders...</div>
        <div v-else-if="holders.length === 0" class="message-empty text-sm">No holders yet</div>

        <div v-else>
          <div class="w-full mb-2">
            <h3>Top 25</h3>
          </div>
          <div>
            <div class="flex">
              <div :class="`${loggedIn ? 'w-1/2' : 'w-2/3'}`">Address</div>
              <div class="w-1/6">Amount</div>
              <div class="w-1/6 text-right">Percentage</div>
            </div>
            <div class="transfer flex text-sm mb-2">
              <div :class="`${loggedIn ? 'w-1/2' : 'w-2/3'}`">
                  Freyala graveyard
              </div>
              <div class="w-1/6">{{ parseFloat(graveyard).toFixed(5) }}</div>
              <div class="w-1/6 text-right">-</div>
            </div>

            <div
              class="transfer flex text-sm mb-2"
              v-for="holder in data"
              :key="holder.id"
              v-if="holder.id !== '0x9b68bf4bf89c115c721105eaf6bd5164afcc51e4' && holder.id !== '0x000000000000000000000000000000000000dead'"
            >
              <div v-if="holder.id === '0x1485a496f816f940c510d634e48f8c66b78dc99e'"
                   :class="`${loggedIn ? 'w-1/2' : 'w-2/3'}`">
                <a :href="`https://explorer.harmony.one/#/address/${holder.id}`" target="_blank">
                  Viperswap liquidity pool pair
                </a>
              </div>
              <div v-else-if="holder.id === '0x861ef0cab3ab4a1372e7eda936668c8967f70110'"
                   :class="`${loggedIn ? 'w-1/2' : 'w-2/3'}`">
                <a :href="`https://explorer.harmony.one/#/address/${holder.id}`" target="_blank">
                  Freyala single staking pool (also includes rewards)
                </a>
              </div>
              <div v-else-if="holder.id === '0xd211b33df63466d4cf4d8bad66f06d4ef7f0b581'"
                   :class="`${loggedIn ? 'w-1/2' : 'w-2/3'}`">
                <a :href="`https://explorer.harmony.one/#/address/${holder.id}`" target="_blank">
                  Mochiswap liquidity pool pair
                </a>
              </div>
              <div v-else-if="holder.id === '0xf6938abb05f01d6089561fbf14121e3223ab43ba'"
                   :class="`${loggedIn ? 'w-1/2' : 'w-2/3'}`">
                <a :href="`https://explorer.harmony.one/#/address/${holder.id}`" target="_blank">
                  Lootswap liquidity staking pair (LP)
                </a>
              </div>
              <div v-else-if="holder.id === '0xfef8bd2e06d8117e51ce7b960992e4055997d9fe'"
                   :class="`${loggedIn ? 'w-1/2' : 'w-2/3'}`">
                <a :href="`https://explorer.harmony.one/#/address/${holder.id}`" target="_blank">
                  Freyala faucet
                </a>
              </div>
              <div v-else-if="holder.id === '0xfacdddf6f59abee55f19f47698356d9de036e871'"
                   :class="`${loggedIn ? 'w-1/2' : 'w-2/3'}`">
                <a :href="`https://explorer.harmony.one/#/address/${holder.id}`" target="_blank">
                  Lootswap liquidity pool pair
                </a>
              </div>
              <div v-else-if="holder.id === '0x4e316a569a7807884fd53ccd043c66185f54659f'"
                   :class="`${loggedIn ? 'w-1/2' : 'w-2/3'}`">
                <a :href="`https://explorer.harmony.one/#/address/${holder.id}`" target="_blank">
                  Openswap liquidity pool pair
                </a>
              </div>
<!--              <div v-else-if="holder.id === '0x9b68bf4bf89c115c721105eaf6bd5164afcc51e4'"-->
<!--                   :class="`${loggedIn ? 'w-1/2' : 'w-2/3'}`">-->
<!--                <a :href="`https://explorer.harmony.one/#/address/${holder.id}`" target="_blank">-->
<!--                  Freyala graveyard-->
<!--                </a>-->
<!--              </div>-->
<!--              <div v-else-if="holder.id === '0x000000000000000000000000000000000000dead'"-->
<!--                   :class="`${loggedIn ? 'w-1/2' : 'w-2/3'}`">-->
<!--                <a :href="`https://explorer.harmony.one/#/address/${holder.id}`" target="_blank">-->
<!--                  Freyala graveyard-->
<!--                </a>-->
<!--              </div>-->
              <div v-else-if="holder.id === '0xbb4972a578266e0800d98f4248d057d6f6cde2bf'"
                   :class="`${loggedIn ? 'w-1/2' : 'w-2/3'}`">
                <a :href="`https://explorer.harmony.one/#/address/${holder.id}`" target="_blank">
                  Freyala supply
                </a>
              </div>
              <div v-else-if="holder.id === '0x9aa78983e7e4ae0873235c44cae53bb63f594ca6'"
                   :class="`${loggedIn ? 'w-1/2' : 'w-2/3'}`">
                <a :href="`https://explorer.harmony.one/#/address/${holder.id}`" target="_blank">
                  Freyala development fund
                </a>
              </div>
              <div v-else-if="holder.id === '0x48a30b33ebd0afac1d8023e06e17372c21c0fb18'"
                   :class="`${loggedIn ? 'w-1/2' : 'w-2/3'}`">
                <a :href="`https://explorer.harmony.one/#/address/${holder.id}`" target="_blank">
                  Freyala Kraken's den (Time locked tokens (FEB62022))
                </a>
              </div>
              <div v-else :class="`${loggedIn ? 'w-1/2' : 'w-2/3'}`">
                <a :href="`https://explorer.harmony.one/#/address/${holder.id}`" target="_blank">
                  {{ compressAddress(holder.id) }}
                </a>
              </div>
              <div class="w-1/6">{{ parseFloat(holder.amount).toFixed(5) }}</div>
              <div v-if="holder.id === '0x9b68bf4bf89c115c721105eaf6bd5164afcc51e4'" class="w-1/6 text-right">-</div>
              <div v-else-if="holder.id === '0xbb4972a578266e0800d98f4248d057d6f6cde2bf'" class="w-1/6 text-right">-</div>
              <div v-else-if="holder.id === '0x48a30b33ebd0afac1d8023e06e17372c21c0fb18'" class="w-1/6 text-right">-</div>
              <div v-else-if="holder.id === '0x000000000000000000000000000000000000dead'" class="w-1/6 text-right">-</div>
              <div v-else class="w-1/6 text-right">
                {{ ((100 * parseFloat(holder.amount)) / parseFloat(circulatingMarketCap)).toFixed(2) }}%
              </div>
            </div>
          </div>

          <div :class="`${loggedIn ? 'w-full md:w-5/6' : 'w-full'} flex mt-4`">
            <small v-if="previous_page !== null" class="cursor-pointer" @click="paginate(previous_page)">Previous page</small>
            <small v-if="next_page !== null" class="ml-auto text-right cursor-pointer" @click="paginate(next_page)">Next page</small>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
import moment from "moment-timezone";
import Sidebar from "../components/Sidebar.vue";
import BigNumber from "bignumber.js";
import {mapState} from "vuex";

const {Unit} = require("@harmony-js/utils");
import {
  getNetworkLink,
} from "../lib/txnService";
import {
  getTokenBalance,
} from "../lib/contracts/token-api";

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
    paginate_page: undefined,
    per_page: undefined,
    previous_page: undefined,
    next_page: undefined,
    total: undefined,
    total_pages: undefined,
    limit: 100,
    txCount: 1,
    page: 0,
    data: 0,
    loadMoreLoading: false,
    holders: 'loading',
    circulatingMarketCap: 0,
    totalMarketCap: 0,
    finishedFetchingHolders: false,
    first: 1000,
    skip: 0,
    addressValue: '',
    lookedUpAddressBalance: undefined,
    graveyard: 0
  }),

  mounted() {
    this.loadHolders('XYA', this.skip, this.first);
  },

  methods: {
    async fetchAddressBalance(addr) {
      this.lookedUpAddress = ''
      this.lookedUpAddressBalance = 0

      let weiBalance = await getTokenBalance(addr, '0x78f3092515647b8550bd374c9894c2db64829d34');
      this.lookedUpAddressBalance = BigNumber(weiBalance).dividedBy(Math.pow(10, 18)).toFixed(6);
      this.lookedUpAddress = addr;
    },

    loadHolders(symbol, skip, first) {
      axios.post('https://faucet-api.freyala.com/holders', {symbol, skip, first}).then((result) => {
        if (result.data.data.tokens.length > 0) {
          result.data.data.tokens[0].holders.map((holder) => {
            if (holder.id.split('-')[0] !== '0x000000000000000000000000000000000000dead' && holder.id.split('-')[0] !== '0x48a30b33ebd0afac1d8023e06e17372c21c0fb18' && holder.id.split('-')[0] !== '0x9b68bf4bf89c115c721105eaf6bd5164afcc51e4' && holder.id.split('-')[0] !== '0xbb4972a578266e0800d98f4248d057d6f6cde2bf') {
              this.circulatingMarketCap += parseInt(holder.amount)
            }
            if (holder.id.split('-')[0] !== '0x000000000000000000000000000000000000dead' && holder.id.split('-')[0] !== '0x9b68bf4bf89c115c721105eaf6bd5164afcc51e4') {
              this.totalMarketCap += parseInt(holder.amount)
            }
            if (holder.id.split('-')[0] === '0x000000000000000000000000000000000000dead' || holder.id.split('-')[0] === '0x9b68bf4bf89c115c721105eaf6bd5164afcc51e4') {
              this.graveyard += parseInt(holder.amount)
            }

            holder.id = holder.id.split('-')[0]
          })

          this.holders = result.data.data.tokens[0].holders
          this.skip += 1000
          this.loadMoreHolders('XYA', this.skip, this.first)
        } else {
          this.holders = []
        }
      });
    },

    loadMoreHolders(symbol, skip, first) {
      axios.post('https://faucet-api.freyala.com/holders', {symbol, skip, first}).then((result) => {
        if (result.data.data.tokens.length > 0) {
          result.data.data.tokens[0].holders.map((holder) => {
            if (holder.id.split('-')[0] !== '0x000000000000000000000000000000000000dead' && holder.id.split('-')[0] !== '0x48a30b33ebd0afac1d8023e06e17372c21c0fb18' && holder.id.split('-')[0] !== '0x9b68bf4bf89c115c721105eaf6bd5164afcc51e4' && holder.id.split('-')[0] !== '0xbb4972a578266e0800d98f4248d057d6f6cde2bf') {
              this.circulatingMarketCap += parseInt(holder.amount)
            }
            if (holder.id.split('-')[0] !== '0x000000000000000000000000000000000000dead' && holder.id.split('-')[0] !== '0x9b68bf4bf89c115c721105eaf6bd5164afcc51e4') {
              this.totalMarketCap += parseInt(holder.amount)
            }
            if (holder.id.split('-')[0] === '0x000000000000000000000000000000000000dead' || holder.id.split('-')[0] === '0x9b68bf4bf89c115c721105eaf6bd5164afcc51e4') {
              this.graveyard += parseInt(holder.amount)
            }

            holder.id = holder.id.split('-')[0]
          })

          result.data.data.tokens[0].holders.map((holder) => {
            this.holders.push(holder)
          })

          if (result.data.data.tokens[0].holders.length > 0) {
            this.skip += 1000
            this.loadMoreHolders('XYA', this.skip, this.first)
          } else {
            this.finishedFetchingHolders = true
            this.paginate()
          }
        } else {

          this.holders = []
        }
      });
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
    },

    paginate(current_page) {
      let page = current_page || 1,
        per_page = 25,
        offset = (page - 1) * per_page,

        paginatedItems = [...this.holders].sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount)).slice(offset).slice(0, 25),
        total_pages = Math.ceil(this.holders.length / per_page);

      this.page = page
      this.per_page = per_page
      this.previous_page = page - 1 ? page - 1 : null
      this.next_page = (total_pages > page) ? page + 1 : null
      this.total = this.holders.length
      this.total_pages = total_pages
      this.data = paginatedItems
    }
  }
};
</script>

