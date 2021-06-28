import Vue from "vue";
import App from "./App";
import store from "./store";
import router from "./router";
import { sync } from "vuex-router-sync";
import VueIntl from "vue-intl";
import "./css/icons.less";
import Notifications from "vue-notification";
import VueHead from 'vue-head';
import VueClipboard from 'vue-clipboard2'
import Web3 from 'web3'

sync(store, router);

Vue.use(Notifications);
Vue.use(VueIntl);
Vue.use(VueHead);
Vue.use(VueClipboard);
Vue.prototype.Web3 = Web3;

import './assets/scss/app.scss'
import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  head: {
    title: {
      inner: 'Freyala cloud wallet'
    }
  },
  render: h => h(App),
  store,
  router,
  el: '#app',
  components: { App },
  template: '<App/>'
})
