<template>
  <div>

    <main :class="`md:flex flex-wrap`">
      <sidebar/>

      <section :class="`w-full md:w-2/3 p-8 text-xl ml-auto`">
        <div :class="`w-full md:w-3/4 transaction-title mb-16`">
          <h1 :class="`w-full md:w-4/5 border-b-4 border-white pb-4`">
              <span>
                Select account
              </span>
          </h1>
          <div class="mt-2" style="line-height: 0.75">
            <small style="font-size: 11px;">* Your browser's local storage is the only place your data is stored;</small><br>
            <small style="font-size: 11px;">** Losing your browser's local storage means losing your account;</small><br>
            <small style="font-size: 11px;">*** Store your seed safely. This is the only way to access your wallet.</small>
          </div>

          <br>
          <div class="header-top">
            <div class="network">
              <p>
                Current account: <span class="network-name" style="word-break: break-all">{{ active.name }} ({{ active.address }})</span>
              </p>
              <br>
              <p>
                Switch accounts:
              </p>
              <select name="select" class="w-3/4" id="select" v-model="selectedAccount" @change="selectAccount">
                <option value="" disabled>
                  Select account
                </option>
                <option v-for="(account, index) in accounts" :value="account" :key="account.address">
                  <span>{{ account.name }} ({{ account.address }})</span>
                </option>
              </select>
              <br>
              <br>
              <br>
              <br>
              <p class="text-3xl">
                Remove account
              </p>
              <hr>
              <br>
              <small>Insert the account address you would like to have removed and press "REMOVE"</small>
              <br>
              <input v-model="addressToDelete" class="w-full" placeholder="Insert ONE address.."/>
              <br>
              <br>
              <button @click="deleteAccount">
                REMOVE
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {
  THIRDPARTY_GET_ACCOUNT_CONNECT,
  GET_WALLET_SERVICE_STATE,
  THIRDPARTY_GET_ACCOUNT_SUCCESS_RESPONSE
} from "../../types";
import Sidebar from "../components/Sidebar.vue";

export default {
  data: () => ({
    selected: -1,
    host: "",
    currentAccount: '',
    selectedAccount: '',
    addressToDelete: ''
  }),
  computed: {
    ...mapState(["accounts", "active"])
  },
  components: {
    Sidebar
  },
  methods: {
    deleteAccount() {
      console.log(this.accounts)
      this.$store.dispatch('deleteAccount', this.addressToDelete)
      this.addressToDelete = ''

      this.$store.commit('setActive', this.accounts[0].name)
    },
    selectAccount() {
      this.$store.commit('setActive', this.selectedAccount.name)
    }
  }
};
</script>
