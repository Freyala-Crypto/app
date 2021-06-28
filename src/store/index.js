import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import {HRCTokens} from "../lib/contracts/config";
import _ from "lodash";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

export default new Vuex.Store({
  namespaced: true,

  state: {
    network: {
      id: 0,
      chainId: 0,
      name: "",
      apiUrl: "",
      type: "",
    },
    tokens: HRCTokens,
    balance: 0,
    transfers: [],
    shardArray: [],
    shard: 0,
    loading: false,
    active: {
      name: "",
      isLedger: false,
      address: false,
      keystore: false,
    },
    accounts: [],
    theme: {
      list: [
        'emerald',
        'platinum',
        'honey',
        'violet'
      ],
      selected: 'violet'
    }
  },

  getters: {
    theme: state => {
      return state.theme
    }
  },

  mutations: {
    change(state, network) {
      state.network.id = network.id;
      state.network.chainId = network.chainId;
      state.network.name = network.name;
      state.network.apiUrl = network.apiUrl;
      state.network.type = network.type;
    },
    loading(state, loading) {
      state.loading = loading;
    },
    SET_THEME(state, theme) {
      state.theme.selected = theme
    },
    addAccount(state, payload) {
      if (payload.isLedger) {
        const acc = state.accounts.find((acc) => acc.isLedger === true);

        if (acc !== undefined) {
          acc.address = payload.address
          state.active = acc;
          return
        }
      }

      state.accounts.push(payload);
      state.active = payload;
    },
    setActive(state, payload) {
      state.active = state.accounts.find((acc) => acc.name === payload);
    },
    shard(state, shard) {
      state.shard = shard;
    },
    shardArray(state, shardArray) {
      state.shardArray = shardArray;
    },
    balance(state, balance) {
      state.balance = balance;
    },
    transfers(state, transfers) {
      state.transfers = transfers;
    },
    pushTransfers(state, transfers) {
      state.transfers.push(...transfers);
    },
    loadTokenBalance(state, payload) {
      state.tokens[payload.network][payload.symbol] = {
        ...state.tokens[payload.network][payload.symbol],
        balance: payload.balance,
      };
    },
    addToken(state, payload) {
      const {address, symbol, network, decimals} = payload;
      state.tokens[network][symbol] = {};
      state.tokens[network][symbol] = {
        address,
        decimals,
      };
    },
    setAccountArray(state, payload) {
      state.accounts = payload.newAccounts;
    },
    setTokenArray(state, payload) {
      state.tokens[payload.network] = payload.tokenArray;
    },
  },

  actions: {
    selectTheme({commit, state}, theme) {
      localStorage.setItem('theme', theme)
      commit('SET_THEME', theme)
    },
    deleteAccount({commit, state}, payload) {
      let newAccounts = state.accounts.filter((val, i, a) => {
        return val.address !== payload;
      });

      commit("setAccountArray", {
        newAccounts,
      });
    },
    deleteToken({commit, state}, payload) {
      let tokenArray = Object.keys(state.tokens[payload.network]);
      delete state.tokens[payload.network][payload.token];

      commit("setTokenArray", {
        network: payload.network,
        tokenArray: state.tokens[payload.network],
      });
    },
  },

  plugins: [vuexLocal.plugin],
});
