<template>
  <div>
    <main :class="`flex flex-wrap`">
      <section :class="`w-full md:w-1/2 md:mx-auto mt-24 p-8 text-xl`">
        <div v-if="scene === 1">

          <div :class="`w-full transaction-title mb-8`">
            <div class="flex flex-wrap border-b-4 border-white pb-4">
              <div class="w-full md:w-4/5">
                <h1>
                  <span>
                    Create wallet
                  </span>
                </h1>
              </div>
            </div>
            <div class="mt-2" style="line-height: 0.75">
              <small style="font-size: 11px;">* Your browser's local storage is the only place your data is stored;</small><br>
              <small style="font-size: 11px;">** Losing your browser's local storage means losing your account;</small><br>
              <small style="font-size: 11px;">*** Store your seed safely. This is the only way to access your wallet.</small>
            </div>
          </div>

          <label class="input-label account-name">
            Name
            <input
                class="input-field w-full"
                type="text"
                name="name"
                ref="name"
                v-model="name"
                placeholder="Input the account name"
                v-on:keyup.enter="createName"
            />
          </label>

          <br>
          <br>

          <div class="button-group flex">
            <button
                v-show="accounts.length > 0"
                class="outline"
                @click="$router.push('/')"
            >
              Cancel
            </button>
            <button
                @click="createName"
                :class="!accounts.length ? 'ml-auto ' : 'ml-auto'"
                :disabled="!name"
            >
              Create
            </button>
          </div>
        </div>
        <div v-else>
          <label class="input-label">
            Password
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
            />
          </label>
          <br>
          <br>
          <label class="input-label">
            Seed Phrase
            <br>
            <textarea
                class="input-field w-full"
                name="seed_phrase"
                ref="seed_phrase"
                rows="3"
                v-model="seed_phrase"
                placeholder="Seed Phrase"
            />
          </label>
          <br>
          <input type="checkbox" id="seedcheck" :value="agree" v-model="agree"/>
          <label class="check-label ml-4" style="font-size: 18px" for="seedcheck">
            I understand that lost seeds cannot be recovered.
          </label>
          <br>
          <br>
          <div class="button-group flex">
            <button
                class="outline"
                @click="
              () => {
                scene = 1;
              }
            "
            >
              Back
            </button>
            <button @click="createAcc" class="ml-auto" :disabled="!agree">Create Account</button>
          </div>
        </div>
        <notifications
            group="error"
            width="250"
            :max="2"
            class="notification-container"
        />
      </section>
    </main>
  </div>
</template>

<script>
import account from "../mixins/account";
import {
  generatePhrase,
  createAccountFromMnemonic,
} from "../lib/txnService";
import {mapState} from "vuex";

export default {
  mixins: [account],
  data: () => ({
    name: "",
    password: "",
    agree: false,
    password_confirm: "",
    seed_phrase: "",
    scene: 1,
  }),
  computed: {
    ...mapState(["accounts"]),
  },
  methods: {
    createAcc() {
      if (this.password.length < 8) {
        this.$notify({
          group: "error",
          type: "warn",
          text: "Password must be longer than 8 characters",
        });
        return;
      } else if (this.password !== this.password_confirm) {
        this.$notify({
          group: "error",
          type: "error",
          text: "Password doesn't match",
        });
        return;
      }

      createAccountFromMnemonic(
          this.name,
          this.seed_phrase,
          this.password
      ).then((wallet) => {
        if (!wallet) {
          this.$notify({
            group: "notify",
            type: "error",
            text: "Password is incorrect or mnemonic is incorrect",
          });
          return false;
        } else {
          this.$store.commit("addAccount", {
            ...wallet,
            isLedger: false,
          });
          this.$router.push("/");
        }
      });
    },
    createName() {
      if (this.name === "") {
        this.$notify({
          group: "error",
          text: "Invalid name",
        });
        return;
      }
      this.seed_phrase = generatePhrase();
      this.scene = 2;
    },
  },
};
</script>

