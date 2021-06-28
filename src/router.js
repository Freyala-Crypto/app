import Vue from "vue";
import Router from "vue-router";
import CreateWallet from "./pages/CreateWallet.vue";
import ImportWallet from "./pages/ImportWallet.vue";
import LoggedOutImportWallet from "./pages/LoggedOutImportWallet.vue";
import SelectAccount from "./pages/SelectAccount.vue";
import Settings from "./pages/Settings.vue";
import SelectNetwork from "./pages/SelectNetwork.vue";
import Tokens from "./pages/Tokens.vue";
import AddCustomTokens from "./pages/AddCustomTokens.vue";
import FetchTokenBalance from "./pages/FetchTokenBalance.vue";
import Holders from "./pages/Holders.vue";
import Transfers from "./pages/Transfers.vue";
import Send from "./pages/Send.vue";
import Staking from "./pages/Staking.vue";
import Receive from "./pages/Receive.vue";
import PrivateKey from "./pages/PrivateKey.vue";
import Customize from "./pages/Customize.vue";
import store from "./store";

Vue.config.productionTip = false;

Vue.use(Router);

const router = new Router({
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  mode: "hash",
  routes: [
    {
      path: "/select-account",
      name: "select-account",
      component: SelectAccount,
      meta: {
        requiredAccount: true,
      },
    },
    {
      path: "/settings",
      name: "settings",
      component: Settings,
      meta: {
        requiredAccount: true,
      },
    },
    {
      path: "/select-network",
      name: "select-network",
      component: SelectNetwork,
      meta: {
        requiredAccount: true,
      },
    },
    {
      path: "/tokens",
      name: "tokens",
      component: Tokens,
      meta: {
        requiredAccount: true,
      },
    },
    {
      path: "/add-custom-tokens",
      name: "add-custom-tokens",
      component: AddCustomTokens,
      meta: {
        requiredAccount: true,
      },
    },
    {
      path: "/fetch-token-balance",
      name: "fetch-token-balance",
      component: FetchTokenBalance,
      meta: {
        requiredAccount: false,
      },
    },
    {
      path: "/staking",
      name: "staking",
      component: Staking,
      meta: {
        requiredAccount: true,
      },
    },
    {
      path: "/customize",
      name: "customize",
      component: Customize,
      meta: {
        requiredAccount: true,
      },
    },
    {
      path: "/holders",
      name: "holders",
      component: Holders,
      meta: {
        requiredAccount: false,
      },
    },
    {
      path: "/transfers",
      name: "transfers",
      component: Transfers,
      meta: {
        requiredAccount: true,
      },
    },
    {
      path: "/",
      name: "send",
      component: Send,
      meta: {
        requiredAccount: true,
      },
    },
    {
      path: "/receive",
      name: "receive",
      component: Receive,
      meta: {
        requiredAccount: true,
      },
    },
    {
      path: "/private-key",
      name: "private-key",
      component: PrivateKey,
      meta: {
        requiredAccount: true,
      },
    },
    {
      path: "/create-wallet",
      name: "create-wallet",
      component: CreateWallet,
    },
    {
      path: "/import-wallet",
      name: "import-wallet",
      component: ImportWallet,
    },
    {
      path: "/initially-import-wallet",
      name: "initially-import-wallet",
      component: LoggedOutImportWallet,
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiredAccount)) {
    if (!store.state.accounts.length) {
      next({ path: "/create-wallet" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
