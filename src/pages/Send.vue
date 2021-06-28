<template>
  <div>
    <main :class="`md:flex flex-wrap`">
      <sidebar/>

      <section :class="`w-full md:w-2/3 p-8 text-xl ml-auto`">

        <div :class="`w-full md:w-3/4 transaction-title mb-16`">
          <h1 :class="`w-full md:w-4/5 border-b-4 border-white`">
          <span>
            Send
          </span>
          </h1>
        </div>

        <div v-if="scene === 1">
          <form
              @submit.prevent="showConfirmDialog"
              action
              method="post"
              class="auth-form"
              autocomplete="off"
          >
            <div
                v-show="message.show"
                class="message"
                :class="[message.type]"
                @click="onMessageClick"
            >
            <span
                v-if="message.type === 'success'" class="cursor-pointer"
            >Transaction Succeed: Click here to see the transaction</span>
              <span v-else>{{ message.text }}</span>
              <br>
              <br>
            </div>
            <div :class="{ row: !isToken }">
              <label class="input-label w-full md:w-3/4" :class="{ recipient: !isToken }">
                Recipient Address
                <br>
                <input
                    class="input-field w-full md:w-3/4"
                    type="text"
                    name="address"
                    placeholder="Recipient Address"
                    v-model="recipient"
                />
              </label>
              <br>
            </div>
            <br>
            <div class="flex flex-wrap" :class="{ row: !isToken }">
              <label class="input-label w-full md:w-1/2" :class="{ amount: !isToken }">
                Amount
                <br>
                <input
                    class="input-field w-full md:w-3/4"
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    v-model="amount"
                    step="any"
                />
              </label>
              <label class="input-label token w-full md:w-1/4">
                Token
                <br>
                <select class="input-field w-full" v-model="selectedToken" @change="tokenChanged()">
                  <option v-for="symbol in tokenList" :key="symbol" :value="symbol">{{ symbol }}</option>
                </select>
              </label>
              <div
                class="maximum-label w-full text-sm md:text-base"
                v-show="!loading"
              >Maximum: {{ getMaxBalance + " " + selectedToken }}
              </div>
            </div>
            <br>
            <div class="row">
              <label class="input-label gas-price">
                Gas Price
                <br>
                <input
                    class="input-field w-full md:w-3/4"
                    type="number"
                    name="gasprice"
                    placeholder="Gas Price"
                    v-model="gasPrice"
                    step="any"
                />
              </label>
              <br>
              <label class="input-label gas-limit">
                Gas Limit
                <br>
                <input
                    class="input-field w-full md:w-3/4"
                    type="number"
                    name="gaslimit"
                    v-model="gasLimit"
                    placeholder="Gas Limit"
                />
              </label>
              <br>
              <label class="input-label gas-one">
                Gas
                <br>
                <input
                    class="input-field w-full md:w-3/4"
                    type="text"
                    name="gasone"
                    readonly
                    :value="`${getGasFee} ONE`"
                />
              </label>
            </div>
            <br>
            <label class="input-label">
              Input Data
              <br>
              <textarea
                  class="input-field input-data w-full md:w-3/4"
                  type="textarea"
                  name="inputdata"
                  placeholder="Please enter hexadecimal data (optional)"
                  v-model="inputData"
              />
            </label>
            <br>
            <button class="full-width" type="submit">Send</button>
          </form>
        </div>
        <!-- Approve Transaction Dialog -->
        <div v-else class="w-full md:w-3/4">
          <h3 class="center">{{ "Approve Transaction" + (wallet.isLedger ? " on Ledger" : "") }}</h3>
          <p class="addressRow">
            From
            <span class="address__name">{{ compressAddress(getFromAddress) }}</span>
            of Shard
            <b>{{ fromShard }}</b>
          </p>
          <br>
          <div class="transaction column">
            <div class="row">
              <div class="transaction__meta">
                <div class="transaction__caption">
                  Sending
                  <b>{{ getString(amount) }}</b>
                </div>
              </div>
            </div>
            <div class="transaction__information">
              To
              <span class="address__name">{{ compressAddress(recipient) }}</span>
              of Shard
              <b>{{ toShard }}</b>
            </div>
          </div>
          <br>
          <div class="invoice-content">
            <div class="invoice">
              <div class="invoice__row">
                <div class="invoice__rowLeft"><strong>Subtotal</strong></div>
                <div class="invoice__rowRight">{{ getString(amount) }}</div>
              </div>
              <br>
              <div class="invoice__row">
                <div class="invoice__rowLeft"><strong>Network Fee</strong></div>
                <div class="invoice__rowRight">{{ getGasFee + " ONE" }}</div>
              </div>
              <br>
              <div class="invoice__divider"></div>
              <div class="invoice__row">
                <div class="invoice__rowLeft"><strong>Total</strong></div>
                <div class="invoice__rowRight">{{ getString(getTotal) }}</div>
              </div>
              <br>
            </div>
          </div>

          <div v-if="!wallet.isLedger" class="password-content">
            <label class="input-label">
              Password
              <br>
              <input
                  class="input-field w-full"
                  type="password"
                  name="password"
                  ref="password"
                  v-model="password"
                  placeholder="Input your password"
                  v-on:keyup.enter="sendPayment"
              />
            </label>
          </div>
          <div class="ledger-content" v-else>
            <b>Please unlock your ledger and confirm the transaction</b>
          </div>
          <br>
          <div class="button-group flex w-full">
            <button
                class="outline"
                @click="
              () => {
                scene = 1;
              }
            "
            >Back
            </button>
            <button v-if="loading" class="ml-auto" :disabled="!password">Approving  <i class="fas fa-spinner fa-spin"></i></i></button>
            <button v-else @click="sendPayment" class="ml-auto" :disabled="!password">Approve</button>
          </div>
        </div>
        <notifications group="notify" width="250" :max="4" class="notification-container"/>
      </section>
    </main>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {decryptKeyStore, transferToken} from "../lib/txnService";
import {sendToken} from "../lib/contracts/token-api";
import {isValidAddress} from "@harmony-js/utils";
import account from "../mixins/account";
import token from "../mixins/token";
import Sidebar from "../components/Sidebar";


export default {
  name: "send-transaction",
  mixins: [account, token],

  components: {
    Sidebar
  },
  data: () => ({
    isToken: false,
    token: "XYA",
    scene: 1,
    amount: 0,
    fromShard: 0,
    toShard: 0,
    tokenList: [],
    recipient: "",
    gasPrice: 1,
    gasLimit: 21000,
    inputData: "",
    selectedToken: "ONE",
    password: "",
    message: {
      show: false,
      type: "error",
      text: ""
    }
  }),

  computed: {
    ...mapState({
      wallet: state => state.active,
      loading: state => state.loading,
      shard: state => state.shard,
      balance: state => state.balance
    }),
    getFromAddress() {
      return this.wallet.address;
    },
    isHRCToken() {
      if (this.selectedToken && this.selectedToken !== "ONE") {
        this.isToken = true
        return this.selectedToken && this.selectedToken !== "ONE";
      } else {
        this.isToken = false
        return this.selectedToken && this.selectedToken !== "ONE";
      }
    },
    getGasFee() {
      return parseFloat((this.gasPrice * this.gasLimit) / Math.pow(10, 9));
    },
    getTotal() {
      if (!this.isHRCToken) return Number(this.amount) + Number(this.getGasFee);
      else return Number(this.amount);
    },
    getOneBalance() {
      return Number(this.balance).toFixed(9);
    },
    getMaxBalance() {
      let max;
      if (!this.isHRCToken) max = Number(this.balance).toFixed(9);
      else {
        max = this.getTokenBalance(this.selectedToken);
      }
      if (max === undefined) return Number(0).toFixed(6);
      return max;
    }
  },

  async mounted() {
    this.setSelectedToken();
    await this.loadBalance();
  },
  updated() {
      if (this.scene === 2) this.$refs.password.focus();
  },
  methods: {
    setGasLimit() {
      if (!this.isHRCToken) this.gasLimit = 21000;
      else this.gasLimit = 250000; //this is from the truffle-config.js
    },
    async tokenChanged() {
      this.toShard = 0;
      this.setGasLimit();
      await this.loadBalance();
    },
    setSelectedToken() {
      if (!this.isToken) {
        this.tokenList = ["ONE", ...this.tokenArray];
        this.selectedToken = "ONE";
      } else {
        this.selectedToken = this.token;
      }
      this.setGasLimit();
    },
    getString(amount) {
      return Number(amount).toFixed(6) + " " + this.selectedToken;
    },
    onMessageClick() {
      if (this.message.type === "success") window.open(this.message.text);
    },
    async loadBalance() {
      if (this.isHRCToken) await this.loadTokenBalance(this.selectedToken);
      else await this.loadOneBalance();
    },
    async refreshToken() {
      await this.setSelectedToken();
      await this.loadBalance();
    },
    async sendPayment() {
      let privateKey;
        if (!this.password) return;
        privateKey = await decryptKeyStore(this.password, this.wallet.keystore);

        if (!privateKey) {
          this.$notify({
            group: "notify",
            type: "error",
            text: "Password is not correct"
          });
          return false;
        }

      this.$store.commit("loading", true);
      try {
        // use the current selected account in the Account window
        let ret;
        if (!this.isHRCToken) {
          this.fromShard = this.shard;
          ret = await transferToken(
            this.recipient,
            this.fromShard,
            this.toShard,
            this.amount,
            privateKey,
            this.gasLimit,
            this.gasPrice
          );
        } else {
          //token transfer part
          ret = await sendToken(
            this.address,
            this.recipient,
            parseFloat(this.amount),
            this.getTokenDecimals(this.selectedToken),
            privateKey,
            this.gasLimit,
            this.gasPrice,
            this.getContractAddress(this.selectedToken)
          );
        }

        this.$store.commit("loading", false);
        this.password = "";
        this.scene = 1;

        if (ret.result) {
          this.showSuccessMsg(ret.mesg);
        } else {
          this.showErrMessage(ret.mesg);
        }

        this.loadBalance();
        this.recipient = "";
        this.amount = 0;
      } catch (e) {
        this.$store.commit("loading", false);

        console.log("transfer error =", e);
        this.showErrMessage(
            "Something went wrong while trying to send the payment"
        );
      }
    },
    showSuccessMsg(msg) {
      this.message.show = true;
      this.message.type = "success";
      this.message.text = msg;
    },
    showErrMessage(err) {
      this.message.show = true;
      this.message.type = "error";
      this.message.text = err;
    },
    showConfirmDialog() {
      this.message.show = false;

      if (!isValidAddress(this.recipient)) {
        this.showErrMessage("Invalid recipient address");
        return false;
      }

      if (!this.selectedToken) {
        this.showErrMessage("Please select token that you want to send");
        return false;
      }

      if (this.amount <= 0) {
        this.showErrMessage("Invalid token amount");
        return false;
      }

      if (!this.isHRCToken) {
        if (this.getTotal > this.getOneBalance) {
          this.showErrMessage("Your balance is not enough");
          return false;
        }
      } else {
        if (this.getOneBalance < this.getGasFee) {
          this.showErrMessage("Your ONE balance is not enough");
          return false;
        }
        if (this.getTotal > this.getMaxBalance) {
          this.showErrMessage("Your token balance is not enough");
          return false;
        }
      }
      this.scene = 2;
    },

    async refreshData() {
      this.message.show = false;
      this.$store.commit("loading", true);
      await this.loadShardingInfo();
      await this.refreshToken();
      this.$store.commit("loading", false);
    },

    compressAddress(address) {
      return (
          address.substr(0, 15) +
          "..." +
          address.substr(address.length - 5, address.length)
      );
    }
  }
};
</script>
