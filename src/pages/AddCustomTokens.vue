<script
  src="../../../../../../../Users/chris/AppData/Local/Temp/Rar$DRa2736.31898/onewallet-1.0.0/src/popup/store/index.js"></script>
<template>
  <div>
    <main :class="`md:flex flex-wrap`">
      <sidebar/>
      <section :class="`w-full md:w-2/3 p-8 text-xl ml-auto`">

        <div :class="`w-full md:w-3/4 transaction-title mb-16`">
          <h1 :class="`w-full md:w-4/5 border-b-4 border-white`">
          <span>
            Add token
          </span>
          </h1>
        </div>

        <label class="input-label w-full md:w-3/4">
          Token Contract Address
          <br>
          <input
            class="input-field w-full md:w-3/4"
            type="text"
            name="contractAddress"
            ref="contractAddress"
            v-model="contractAddress"
            placeholder="Input the token contract address"
          />
        </label>
        <br>
        <br>
        <label class="input-label symbol-field w-full md:w-3/4">
          Token Symbol
          <br>
          <input
            class="input-field w-full md:w-3/4"
            type="text"
            name="symbol"
            ref="symbol"
            v-model="symbol"
            placeholder="Input the token symbol"
          />
        </label>
        <br>
        <br>
        <label class="input-label w-full md:w-3/4">
          Decimals of Precision
          <br>
          <input
            class="input-field w-full md:w-3/4"
            type="number"
            name="precision"
            ref="precision"
            v-model="precision"
            placeholder="Input the decimals of precision"
          />
        </label>

        <br>
        <br>
        <div class="flex w-full md:w-3/4">
          <button @click="createToken" class="ml-auto" :disabled="!precision || !symbol || !contractAddress">Create
          </button>
        </div>
      </section>
      <notifications group="notify" width="250" :max="2" class="notifiaction-container"/>
    </main>
  </div>
</template>

<script>
import { HarmonyAddress } from "@harmony-js/crypto";
import Sidebar from "../components/Sidebar";
import token from "../mixins/token";
import {mapState} from "vuex";

export default {
  data: () => ({
    symbol: "",
    contractAddress: "",
    precision: 0,
    selectedNetwork: null
  }),
  mixins: [token],

  components: {
    Sidebar
  },

  computed: mapState({
    currentNetwork: state => state.network
  }),

  mounted() {
    this.selectedNetwork = this.currentNetwork.id;
  },
  watch: {
    symbol() {
      this.symbol = this.symbol.replace(" ", "").toUpperCase();
    }
  },
  methods: {
    isValidAddress(address) {
      try {
        return !!HarmonyAddress.isValidBasic(new HarmonyAddress(address).basic);
      } catch (err) {
        return false;
      }
    },
    createToken() {
      try {
        if (!this.isValidAddress(this.contractAddress)) {
          this.$notify({
            group: "notify",
            type: "error",
            text: "Contract address is invalid"
          });
          return;
        }
        if (this.getContractAddressList.includes(this.contractAddress)) {
          this.$notify({
            group: "notify",
            type: "error",
            text: "Contract address already exists"
          });
          return;
        }
        const tokenList = Object.keys(
          this.tokens[this.selectedNetwork]
        ).map(elem => elem.toUpperCase());
        if (tokenList.includes(this.symbol.toUpperCase())) {
          this.$notify({
            group: "notify",
            type: "error",
            text: "Token symbol already exists"
          });
          return;
        }
        this.$store.commit("addToken", {
          address: this.contractAddress,
          symbol: this.symbol,
          network: this.selectedNetwork,
          decimals: this.precision
        });
        this.$router.push("/tokens");
      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>
