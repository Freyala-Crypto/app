<template>
  <div>
    <main :class="`md:flex flex-wrap`">
      <sidebar/>

      <section :class="`w-full md:w-2/3 p-8 text-xl ml-auto`">

        <div :class="`w-full md:w-3/4 transaction-title mb-16`">
          <h1 :class="`w-full md:w-4/5 border-b-4 border-white`">
          <span>
            Receive
          </span>
          </h1>
        </div>

        <div class="receive-payment">
          <p>Your address in ONE format</p>
          <div class="input-group">
            <input
                class="input-field address-input w-full md:w-3/4"
                type="text"
                name="address"
                v-model="address"
                readonly
            />
          </div>
          <br>
          <p>Your address in HEX format</p>
          <div class="input-group">
            <input
                class="input-field address-input w-full md:w-3/4"
                type="text"
                name="address"
                v-model="hexAddress"
                readonly
            />
          </div>
          <br>
          <qrcode-vue :value="address" :size="275" level="H"></qrcode-vue>
        </div>
        <notifications group="notify" width="250" :max="2" class="notification-container"/>
      </section>
    </main>
  </div>
</template>

<script>
import {mapState} from "vuex";
import QrcodeVue from "qrcode.vue";
import Sidebar from "../components/Sidebar.vue";
import {getHarmony} from "../lib/txnService";

export default {
  components: {
    QrcodeVue,
    Sidebar
  },
  data() {
    return {
      hexAddress: ''
    }
  },

  computed: mapState({
    address: state => state.active.address
  }),
  mounted() {
    this.hexAddress = getHarmony().crypto.getAddress(this.address).basicHex
  },
  methods: {
    copyToClipboard() {
      this.$copyText(this.address).then(() => {
        this.$notify({
          group: "notify",
          type: "info",
          text: "Copied to Clipboard"
        });
      });
    }
  }
};
</script>

