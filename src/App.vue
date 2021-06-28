<template>
  <div id="app">
    <div :class="`fixed bottom-0 left-0 md:hidden w-full flex bg-black`" style="height: 75px">
      <div class="w-1/4" :class="`border border-primary-${theme.selected}`">
        <router-link :to="{ name: 'send', params: {} }" class="h-full flex">
          <i class="fas text-xl fa-paper-plane m-auto" :class="`text-tertiary-${theme.selected}`"></i>
        </router-link>
      </div>
      <div class="w-1/4" :class="`border border-primary-${theme.selected}`">
        <router-link :to="{ name: 'receive', params: {} }" class="h-full flex">
          <i class="far text-xl fa-address-card m-auto" :class="`text-tertiary-${theme.selected}`"></i>
        </router-link>
      </div>
      <div class="w-1/4" :class="`border border-primary-${theme.selected}`">
        <router-link :to="{ name: 'staking', params: {} }" class="h-full flex">
          <i class="fas text-xl fa-coins m-auto" :class="`text-tertiary-${theme.selected}`"></i>
        </router-link>
      </div>
      <div class="w-1/4" :class="`border border-primary-${theme.selected}`">
        <router-link :to="{ name: 'settings', params: {} }" class="h-full flex">
          <i class="fas text-xl fa-cog m-auto" :class="`text-tertiary-${theme.selected}`"></i>
        </router-link>
      </div>
    </div>

    <router-view :class="`pb-24 md:pb-0 bg-primary-${theme.selected}`" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Config from "../config";

export default {
  computed: mapState({
    loading: state => state.loading,
    name: state => state.network.name,
    theme: state => state.theme
  }),
  created() {
    if (localStorage.getItem('theme')) {
      this.$store.dispatch('selectTheme', localStorage.getItem('theme'))
    } else {
      this.$store.dispatch('selectTheme', 'platinum')
    }
  },
  mounted() {
    if (this.name === "")
      this.$store.commit("change", Config.networks[0]);
  }
};
</script>

<style>
@import url("css/style.css");
</style>

<style src="./assets/scss/app.scss" lang="scss"></style>
