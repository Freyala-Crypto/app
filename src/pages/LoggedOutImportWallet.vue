<template>
  <div>
    <main :class="`flex flex-wrap`">
      <section :class="`w-full md:w-1/2 md:mx-auto mt-24 p-8 text-xl`">
        <div v-if="scene === 1">

          <div :class="`w-full transaction-title mb-16`">
            <h1 :class="`border-b-4 border-white pb-4`">
              <span>
                Import wallet
              </span>
            </h1>
            <div class="mt-2" style="line-height: 0.75">
              <small style="font-size: 11px;">* Your browser's local storage is the only place your data is stored;</small><br>
              <small style="font-size: 11px;">** Losing your browser's local storage means losing your saved data.</small><br>
            </div>
          </div>

          <div class="type-row">
            <div class="row-label">Select Type</div>
            <select class="input-field type-select w-full" v-model="selectType">
              <option value="key">Private Key</option>
              <option value="mnemonic">Mnemonic</option>
              <option value="keystore">Harmony Keystore (CLI)</option>
            </select>
          </div>
          <br>
          <div v-if="selectType !== 'keystore'">
            <div v-if="selectType === 'key'">
              <label class="input-label big-label">
                Paste your private Key
                <br>
                <input
                    class="input-field w-full"
                    type="password"
                    name="privatekey"
                    ref="privatekey"
                    v-model="privateKey"
                    placeholder="Input the private key"
                    v-on:keyup.enter="importKey"
                />
              </label>
            </div>
            <div v-else>
              <label class="input-label">
                Paste your Mnemonic
                <br>
                <textarea
                    class="input-field w-full"
                    name="mnemonic"
                    ref="mnemonic"
                    rows="3"
                    v-model="mnemonic"
                    placeholder="Input the Mnemonic"
                />
              </label>
            </div>
          </div>
          <div v-else class="file-row">
            <label for="file-upload" class="py-3 px-16 mt-6 mb-4 text-center bg-white text-black cursor-pointer">
              Select CLI
            </label>
            <input id="file-upload" class="hidden" type="file" @change="onSelectFile">
          </div>
          <br>
          <div class="flex flex-wrap">
            <div class="button-group flex w-1/2">
              <a href="/#/create-wallet">
                <button>Return</button>
              </a>
            </div>
            <div class="button-group flex w-1/2">
              <button @click="importKey" class="ml-auto">Import</button>
            </div>
          </div>
        </div>
        <div v-else>
          <div :class="`w-full transaction-title mb-16`">
            <h1 :class="`border-b-4 border-white pb-4`">
              <span>
                Import wallet
              </span>
            </h1>
            <div class="mt-2" style="line-height: 0.75">
              <small style="font-size: 11px;">* Your browser's local storage is the only place your data is stored;</small><br>
              <small style="font-size: 11px;">** Losing your browser's local storage means losing your saved data.</small><br>
            </div>
          </div>

          <label class="input-label">
            Account Name
            <br>
            <input
                class="input-field w-full"
                type="text"
                name="name"
                ref="name"
                v-model="name"
                placeholder="Input the account name"
            />
          </label>
          <br>
          <br>
          <label class="input-label">
            <span v-if="selectType !== 'keystore'">Password</span>
            <span v-else>Enter your keystore Password</span>
            <br>
            <input
                class="input-field w-full"
                type="password"
                name="password"
                ref="password"
                v-model="password"
                placeholder="Input the password"
            />
          </label>
          <br>
          <br>
          <div v-if="selectType !== 'keystore'">
            <label class="input-label">
              Confirm Password
              <br>
              <input
                  class="input-field w-full"
                  type="password"
                  name="password_confirm"
                  ref="password_confirm"
                  v-model="password_confirm"
                  placeholder="Confirm the password"
                  v-on:keyup.enter="importAcc"
              />
            </label>
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
            <button @click="importAcc" class="ml-auto" :disabled="!name">Import Account</button>
          </div>
        </div>
        <notifications group="notify" width="250" :max="2" class="notification-container"/>
      </section>
    </main>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {
  encryptKeyStore,
  validatePrivateKey,
  getAddressFromPrivateKey,
  createAccountFromMnemonic,
  decryptKeyStore
} from "../lib/txnService";
import Sidebar from "../components/Sidebar";

export default {
  data: () => ({
    name: "",
    password: "",
    password_confirm: "",
    privateKey: "",
    keyFromFile: "",
    mnemonic: "",
    scene: 1,
    selectType: "key",
    file: null
  }),
  components: {
    Sidebar
  },
  computed: {
    ...mapState(["accounts", "active"])
  },

  methods: {
    onSelectFile(event) {
      this.file = event.target.files[0];
    },
    async importKey() {
      if (this.selectType === "key") {
        if (!validatePrivateKey(this.privateKey)) {
          this.$notify({
            group: "notify",
            type: "error",
            text: "Please enter a valid private key"
          });
          return false;
        } else {
          const oneAddress = getAddressFromPrivateKey(this.privateKey);
          const acc = this.accounts.find(
              account => account.address === oneAddress
          );
          if (acc) {
            this.$notify({
              group: "notify",
              type: "error",
              text: "Account already exists"
            });
            return false;
          }
        }
      }
      if (this.selectType === "mnemonic" && this.mnemonic === "") {
        this.$notify({
          group: "notify",
          type: "error",
          text: "Please enter a valid mnemonic"
        });
        return false;
      }
      if (this.selectType === "keystore") {
        if (!this.file) {
          this.$notify({
            group: "notify",
            type: "error",
            text: "Please select a file"
          });
          return false;
        } else {
          const _this = this;
          await new Promise((resolve, reject) => {
            let reader = new window.FileReader();
            reader.onload = function (event) {
              try {
                _this.keyFromFile = JSON.parse(event.target.result);
                resolve();
              } catch (err) {
                _this.$notify({
                  group: "notify",
                  type: "error",
                  text: "Keystore file invalid"
                });
                return false;
              }
            };
            reader.readAsText(this.file);
          });
        }
      }
      this.scene = 2;
    },
    importAcc() {
      let wallet;
      if (this.name === "") {
        this.$notify({
          group: "notify",
          text: "Invalid account name"
        });
        return false;
      }

      if (
          this.selectType !== "keystore" &&
          this.password !== this.password_confirm
      ) {
        this.$notify({
          group: "notify",
          type: "error",
          text: "Password doesn't match"
        });
        return false;
      }

      if (this.selectType === "key") {
        const oneAddr = getAddressFromPrivateKey(this.privateKey);

        encryptKeyStore(this.password, this.privateKey).then(result => {
          wallet = {
            name: this.name,
            address: oneAddr,
            keystore: result,
            isLedger: false
          };

          if (wallet.address) {
            this.$store.commit("addAccount", wallet);
            this.$router.push("/");
          }
        });
      } else if (this.selectType === "mnemonic") {
        createAccountFromMnemonic(this.name, this.mnemonic, this.password).then(
            wallet => {
              if (!wallet) {
                this.$notify({
                  group: "notify",
                  type: "error",
                  text: "Mnemonic string is incorrect"
                });
                return false;
              } else {
                //console.log("added new account through import mnemonic", wallet);
                this.$store.commit("addAccount", {
                  ...wallet,
                  isLedger: false
                });
                this.$router.push("/");
              }
            }
        );
      } else {
        decryptKeyStore(this.password, this.keyFromFile).then(result => {
          if (!result) {
            this.$notify({
              group: "notify",
              type: "error",
              text: "Password is incorrect or keystore file is invalid"
            });
            return false;
          }

          encryptKeyStore(this.password, result.privateKey).then(keystore => {
            wallet = {
              name: this.name,
              address: result.address,
              keystore: keystore,
              isLedger: false
            };

            if (wallet.address) {
              this.$store.commit("addAccount", wallet);
              this.$router.push("/");
            }
          });
        });
      }
    }
  }
};
</script>
