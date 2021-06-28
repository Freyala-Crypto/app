<template>
  <div>
    <main :class="`md:flex flex-wrap`">
      <sidebar/>

      <section :class="`w-full md:w-2/3 p-8 text-xl ml-auto`">
        <div :class="`w-full md:w-3/4 transaction-title mb-16`">
          <h1 :class="`w-full md:w-4/5 border-b-4 border-white`">
          <span>
            Export keys
          </span>
          </h1>
        </div>

        <div v-if="wallet">
          <h2 :class="`w-full md:w-3/4 uppercase text-2xl md:text-4xl font-semibold`">
            {{ name }}
          </h2>
          <p class="form-info center text-sm" style="word-break: break-all;">{{ address }}</p>
          <div class="divider"></div>
          <br>
          <div class="form-info">This is your private key.</div>

          <div class="input-group">
          <textarea
              class="input-field special w-full md:w-3/4"
              type="text"
              rows="3"
              v-model="wallet.privateKey"
              readonly
          ></textarea>
            </div>

          <div class="mt-2" style="line-height: 0.75">
            <small style="font-size: 16px;">** This data comes from your local storage, not from a database;</small><br>
            <small style="font-size: 16px;">** Losing this key means losing the access to your wallet;</small><br>
            <small style="font-size: 16px;">** Store your seed safely. This is the only way to access your wallet;</small><br>
            <small style="font-size: 16px;">** <strong>Do not share it</strong>; trust nobody with the access to your wallet.</small>
          </div>
          <br>
          <div class="button-group flex w-full md:w-3/4">
            <router-link to="/" class="button ml-auto">Done</router-link>
          </div>
        </div>

        <div v-else>
          <br>
          <h2 :class="`w-full md:w-3/4 uppercase text-2xl md:text-4xl font-semibold`">
            Select account
          </h2>
          <select v-model="selectedIndex" style="min-width: 250px">
            <option
                v-for="(account, index) in accounts"
                :key="index"
                :value="index"
            >{{ account.name }}
            </option
            >
          </select>
          <div class="form-info center text-sm" style="word-break: break-all;">{{ getAddress }}</div>
          <div class="divider"></div>
          <br>
          <h2 :class="`w-full md:w-3/4 uppercase text-2xl md:text-4xl font-semibold`">
            Show Private Key
          </h2>
          <form
              @submit.prevent="submitForm"
              action
              method="post"
              class="auth-form"
              autocomplete="off"
          >
            <div class="form-info">
              Please enter your password to export the private key.
            </div>
            <input
                class="input-field w-full md:w-full md:w-3/4"
                type="password"
                name="password"
                placeholder="Password"
                v-model="password"
            />
            <br>
            <br>
            <div class="flex w-full md:w-3/4">
              <button class="button full-width ml-auto" type="submit">Export</button>
            </div>
          </form>
        </div>
        <notifications
            group="notify"
            width="250"
            :max="2"
            class="notification-container"
        />
      </section>
    </main>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {decryptKeyStore} from "../lib/txnService";
import Sidebar from "../components/Sidebar.vue";

export default {
  components: {
    Sidebar
  },

  data: () => ({
    name: "",
    address: "",
    password: "",
    selectedIndex: 0,
    wallet: false,
  }),

  computed: {
    ...mapState(["accounts", "active"]),
    getAddress() {
      if (this.selectedIndex < 0) {
        return false;
      }
      this.name = this.accounts[this.selectedIndex].name;
      this.address = this.accounts[this.selectedIndex].address;
      return this.address;
    },
  },
  methods: {
    submitForm() {
      const keystore = this.accounts[this.selectedIndex].keystore;
      if (!keystore) return false;

      decryptKeyStore(this.password, keystore).then((result) => {
        if (!result) {
          this.$notify({
            group: "notify",
            type: "error",
            text: "Password is incorrect",
          });
          return false;
        } else {
          this.wallet = {privateKey: result};
        }
      });
    },
    copyToClipboard() {
      this.$copyText(this.wallet.privateKey).then(() => {
        this.$notify({
          group: "notify",
          type: "info",
          text: "Copied to Clipboard",
        });
      });
    },
  },
  mounted() {
    this.selectedIndex = this.accounts.findIndex(
      (acc) => acc.address === this.active.address
    );
  },
};
</script>
