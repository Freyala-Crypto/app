<template>
  <div>
    <main :class="`md:flex flex-wrap`">
      <sidebar/>


      <section :class="`w-full md:w-2/3 p-8 text-xl ml-auto`">

        <div :class="`w-full md:w-3/4 transaction-title mb-16`">
          <h1 :class="`w-full md:w-4/5 border-b-4 border-white`">
          <span>
            Select network
          </span>
          </h1>
        </div>

        <div class="header-top">
          <div class="network">
            <p>
              Current network: <span class="network-name">{{ currentNetwork.name }}</span>
            </p>
            <br>
            <p>
              Switch network:
            </p>
            <select name="select" class="w-3/4" id="select" v-model="selectedNetwork" @change="changeNetwork">
              <option value="" disabled>
                Select network
              </option>
              <option v-for="network in networks" :value="network" :key="network.id">
                <span>{{ network.name }}</span>
              </option>
            </select>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import {mapState} from "vuex";
import Config from "../../config";
import Sidebar from "../components/Sidebar.vue";

export default {
  props: {
    subtitle: {
      default: false
    },
    headerTab: {
      default: "",
      type: String
    }
  },
  components: {
    Sidebar
  },
  data: () => ({
    showDropdownMenu: false,
    showNetworkDropdown: false,
    networks: [],
    selectedIndex: 0,
    selectedNetwork: ''
  }),

  computed: mapState({
    wallets: state => state.wallets,
    myroute: state => state.route,
    loading: state => state.loading,
    currentNetwork: state => state.network
  }),

  mounted() {
    this.networks = Config.networks;
  },

  methods: {
    hideDropdownMenu() {
      this.showDropdownMenu = false;
    },
    toggleNetworkDropdown() {
      if (this.loading) return;
      this.showNetworkDropdown = !this.showNetworkDropdown;
    },
    hideNetworkDropdown() {
      this.showNetworkDropdown = false;
    },
    changeNetwork() {
      console.log(this.selectedNetwork)
      this.$store.commit("change", this.selectedNetwork);
      this.refreshData();
    },
    refreshData() {
      if (this.loading) return;
      this.$emit("refresh");
      this.showDropdownMenu = false;
    }
  }
};
</script>

