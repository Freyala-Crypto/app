<template>
  <div>
    <main :class="`md:flex flex-wrap`">
      <sidebar/>


      <section :class="`w-full md:w-2/3 p-8 text-xl ml-auto`">

        <div :class="`w-full md:w-3/4 transaction-title mb-16`">
          <h1 :class="`w-full md:w-4/5 border-b-4 border-white`">
          <span>
            Tokens
          </span>
          </h1>
        </div>

        <div v-if="!tokenArray" class="message-empty">No tokens found</div>

        <div v-else>
          <div class="token-row mb-8" v-for="token in tokenArray" :key="token">
            <span class="token-name">{{ token }} <small style="word-break: break-all">({{
                getContractAddress(token)
              }}</small>)</span> <small class="cursor-pointer"><i @click="deleteToken(token)"
                                                                  class="fas fa-trash-alt"></i></small>
            <br>
            Balance: <span class="token-balance">{{ getTokenBalance(token) }}</span>
          </div>
        </div>
        <button class="add_token" @click="$router.push('/add-custom-tokens')">Add token</button>
      </section>
    </main>
  </div>
</template>

<script>
import token from "../mixins/token";
import {mapState} from "vuex";
import Sidebar from "../components/Sidebar.vue";

export default {
  mixins: [token],
  computed: {
    ...mapState({
      network: state => state.network
    })
  },
  components: {
    Sidebar
  },
  async mounted() {
    await this.loadAllTokenBalance();
    this.$forceUpdate();
  },
  methods: {
    deleteToken(token) {
      this.$store.dispatch("deleteToken", {
        network: this.network.chainId,
        token,
      });

      window.location.reload(true)
    },
  }
};
</script>

