<template>
  <div>
    <main :class="`md:flex flex-wrap`">
      <sidebar/>

      <section v-if="stakingLoading || withdrawLoading || unStakingLoading">
        <div class="w-full md:w-2/3 h-full fixed block top-0 right-0 bg-white opacity-25 z-50">
          <span class="text-black top-1/2 my-0 mx-auto block relative w-0 h-0" style="top: 50%">
            <i class="fas fa-circle-notch fa-spin fa-4x"></i>
          </span>
        </div>
      </section>

      <section :class="`w-full md:w-2/3 p-8 text-xl ml-auto`">

        <div :class="`w-full md:w-3/4 transaction-title mb-4`">
          <h1 :class="`w-full md:w-4/5 border-b-4 border-white`">
            <span>
              Staking
            </span>
          </h1>
        </div>
<!--        <div class="mb-12">-->
<!--          <p class="ml-auto">-->
<!--            Connected to: <span v-if="metaMaskAccount === ''"> Freyala </span> <span v-else> Metamask </span>-->
<!--          </p>-->
<!--          <small class="cursor-pointer" @click="initMetaMask()" v-if="metaMaskAccount === ''">Don't want to use the Freyala wallet? Use MetaMask. Click here to connect.</small>-->
<!--          <small class="cursor-pointer" @click="initFreyala()" v-else>Want to use Freyala instead of MetaMask? Click here to connect.</small>-->
<!--        </div>-->

        <div v-if="!passwordVerified" class="my-12">
          <p>Verify ownership before continuing:</p>

          <div class="flex">
            <input @keydown.enter="verifyPassword" placeholder="password" class="w-3/4 md:w-1/3" type="password" v-model="password">
            <button @click="verifyPassword" class="flex flex-row items-center w-24 justify-center">VERIFY</button>
          </div>

          <small class="text-red">{{ verifyError }}</small>
        </div>


        <div v-if="passwordVerified" class="w-full xl:w-3/4">
          <div class="grid grid-col-1 md:grid-cols-2 gap-6 mt-10">
            <div class="transform transition duration-300 shadow-xl rounded-lg  intro-y bg-black">
              <div class="p-5">
                <div class="flex justify-between">
                  <div
                    class="bg-white rounded-full h-6 px-2 flex justify-items-center font-semibold text-sm">
                    <span class="flex text-black items-center">Staking</span>
                  </div>
                </div>
                <div class="ml-2 w-full flex-1">
                  <div>
                    <div class="mt-3 text-2xl font-bold leading-8">
                      {{ ((parseFloat(stakes).toFixed(2)) / 1000000000000000000).toFixed(2) }}
                    </div>

                    <div class="mt-1 text-base text-gray-600 cursor-pointer" @click="unstake(true)">Unstake all</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="transform transition duration-300 shadow-xl rounded-lg  intro-y bg-black">
              <div class="p-5">
                <div class="flex justify-between">
                  <div
                    class="bg-white rounded-full h-6 px-2 flex justify-items-center font-semibold text-sm">
                    <span class="flex text-black items-center">Rewards</span>
                  </div>
                </div>
                <div class="ml-2 w-full flex-1">
                  <div>
                    <div class="mt-3 text-2xl font-bold leading-8">
                      {{ (parseFloat(totalRewards) / 1000000000000000000).toFixed(2) }}
                    </div>

                    <div class="mt-1 text-base text-gray-600 cursor-pointer" @click="withdrawEarnings()">Claim rewards
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-col-1 md:grid-cols-2 gap-6 mt-10">
            <div>
              <div class="flex flex-col px-2">
                <div class="text-center pb-4">
                  <span class="text-2xl text-white">Available amount:</span>
                  <br>
                  <span class="text-white text-3xl">{{
                      parseInt(parseInt(stakingAccountBalance) / 1000000000000000000)
                    }}</span>
                  <span class="text-white text-3xl ml-2">XYA</span>
                </div>
                <div
                  class="rounded-md border-2 border-primary p-2 flex justify-between items-center">
                  <input
                    type="number"
                    placeholder="XYA to stake"
                    v-model="amountToStake"
                    class="text-white flex-shrink text-2xl w-full bg-transparent focus:outline-none"
                  />
                  <div v-if="amountToStake > 0">
                    <button v-if="!registrationStatus" @click="registerAndStake()"
                            class="flex flex-row items-center w-24 justify-center">
                      <span class="w-16">STAKE</span>
                    </button>
                    <button v-else @click="stake()" class="flex flex-row items-center w-24 justify-center">
                      <span class="w-16">STAKE</span>
                    </button>
                  </div>
                  <div v-else>
                    <button class="flex flex-row items-center w-24 justify-center">
                      <span class="w-16">STAKE</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="flex flex-col px-2">
                <div class="text-center pb-4">
                  <span class="text-2xl text-white">
                    Available to unstake:
                  </span>
                  <br>
                  <span class="text-white text-3xl">{{ (parseFloat(stakes) / 1000000000000000000).toFixed() }}</span>
                  <span class="text-white text-3xl ml-2">XYA</span>
                </div>
                <div
                  class="rounded-md border-2 border-primary p-2 flex justify-between items-center">
                  <input
                    type="number"
                    placeholder="XYA to unstake"
                    v-model="amountToUnStake"
                    class="text-white flex-shrink text-2xl w-full bg-transparent focus:outline-none"/>
                  <button v-if="amountToUnStake > 0" @click="unstake(false)"
                          class="flex flex-row items-center w-48 justify-center">
                    <span class="w-24">UNSTAKE</span>
                  </button>
                  <button v-else class="flex flex-row items-center w-48 justify-center">
                    <span class="w-24">UNSTAKE</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="passwordVerified" class="w-full xl:w-3/4 text-white text-center mt-12 mx-2">
          <div v-if="errorMessage || error" class="mb-8">
            <span class="text-red text-lg" style="word-break: break-all">
              Error! Your transaction has been reverted! <br>
              {{ error }} <br>
              {{ errorMessage }}
            </span>
          </div>
          <div>
            <span class="text-white text-lg">
              Return w/o compound: {{ ((parseFloat(dailyROI) / 1000) * 365).toFixed(2) }} %
            </span>
          </div>
          <div>
            <span class="text-white text-lg">
              Return w/ monthly compound: {{
                ((Math.pow((1 + ((((parseFloat(dailyROI) / 1000) * 365) / 100) / 12)), 12) - 1) * 100).toFixed(2)
              }} %
            </span>
          </div>
          <div>
            <span class="text-white text-lg">
              Return w/ daily compound: {{
                ((Math.pow((1 + ((((parseFloat(dailyROI) / 1000) * 365) / 100) / 365)), 365) - 1) * 100).toFixed(2)
              }} %
            </span>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import {mapState} from "vuex";
import Sidebar from "../components/Sidebar.vue";
import fromExponential from "from-exponential";
import FreyalaTokenAbi from "../lib/contracts/artifacts/artifact.json";
import FreyalaStakeAbi from "../lib/contracts/artifacts/stakingArtifact.json";
import {decryptKeyStore} from "../lib/txnService";
import Web3 from "web3"

export default {
  components: {
    Sidebar
  },

  data: () => ({
    passwordVerified: false,
    verifyError: '',
    password: '',
    networkId: undefined,
    stakes: undefined,
    stakingAccountBalance: undefined,
    totalSupply: undefined,
    minimumRegistrationCost: undefined,
    stakingRewards: undefined,
    totalRewards: undefined,
    registrationStatus: undefined,
    freyalaToken: undefined,
    freyalaStake: undefined,
    dailyROI: undefined,
    registrationTax: undefined,
    unStakingTax: undefined,
    stakingTax: undefined,
    minStake: undefined,
    totalStaked: undefined,
    status: undefined,
    referralCount: undefined,
    referralRewards: undefined,
    gasPrice: 1,
    gasLimit: 55000,
    stakingLoading: false,
    withdrawLoading: false,
    unStakingLoading: false,
    amountToStake: 0,
    amountToUnStake: 0,
    errorMessage: '',
    error: '',
    account: {},
    accountAddress: '',
    metaMaskAccount: ''
  }),

  computed: {
    ...mapState({
      wallet: state => state.active
    })
  },

  methods: {
    async updateAll() {
      await Promise.all([
        this.updateStakes(),
        this.updateTotalSupply(),
        this.updateAccountBalance(),
        this.updateTotalStaked(),
        this.stakeRewards(),
        this.minRegisteration(),
        this.totalReward(),
        this.updateStatus()
      ]);
    },

    async verifyPassword() {
        this.loading = true

        const privateKey = await decryptKeyStore(this.password, this.wallet.keystore);

        if (privateKey) {
          const web3 = new Web3("https://ams-hmy-rpc.freyala.com/");

          this.account = web3.eth.accounts.privateKeyToAccount(privateKey);
          web3.eth.accounts.wallet.add(this.account);
          web3.eth.defaultAccount = this.account.address
          this.gasPrice = await web3.eth.getGasPrice();
          this.accountAddress = web3.eth.defaultAccount;

          this.networkId = await web3.eth.net.getId();

          this.freyalaToken = new web3.eth.Contract(FreyalaTokenAbi.abi, "0x9b68BF4bF89c115c721105eaf6BD5164aFcc51E4");
          this.stakingAccountBalance = await this.freyalaToken.methods.balanceOf(this.accountAddress).call();
          this.totalSupply = await this.freyalaToken.methods.totalSupply().call();

          this.freyalaStake = new web3.eth.Contract(FreyalaStakeAbi.abi, "0x861ef0CaB3ab4a1372E7eDa936668C8967F70110");
          this.referralRewards = await this.freyalaStake.methods.referralRewards(this.accountAddress).call();
          this.referralCount = await this.freyalaStake.methods.referralCount(this.accountAddress).call();
          this.status = await this.freyalaStake.methods.registered(this.accountAddress).call();
          this.totalStaked = await this.freyalaStake.methods.totalStaked().call();
          this.minStake = await this.freyalaStake.methods.minimumStakeValue().call();
          this.stakingTax = await this.freyalaStake.methods.stakingTaxRate().call();
          this.unStakingTax = await this.freyalaStake.methods.unstakingTaxRate().call();
          this.registrationTax = await this.freyalaStake.methods.registrationTax().call();
          this.dailyROI = await this.freyalaStake.methods.dailyROI().call();

          this.passwordVerified = true
          await this.updateAll()
          this.loading = false;
        } else {
          this.verifyError = "Couldn't verify password, try again."
        }
    },

    async updateStakes() {
      const stake = await this.freyalaStake.methods.stakes(this.accountAddress).call();
      this.stakes = stake;
      return stake;
    },

    async updateAccountBalance() {
      if (this.freyalaToken) {
        const balance = await this.freyalaToken.methods.balanceOf(this.accountAddress).call();
        this.stakingAccountBalance = balance;
        return balance;
      }
    },

    async updateTotalSupply() {
      if (this.freyalaToken) {
        const totalSupply = await this.freyalaToken.methods.totalSupply().call();
        this.totalSupply = totalSupply;
        return totalSupply;
      }
    },

    async updateTotalStaked() {
      if (this.freyalaStake) {
        return await this.freyalaStake.methods.totalStaked().call();
      }
    },

    async minRegisteration() {
      if (this.freyalaStake) {
        const tax = parseInt(await this.freyalaStake.methods.registrationTax().call());
        const value = parseInt(await this.freyalaStake.methods.minimumStakeValue().call());
        const sum = parseInt(tax / 1000000000000000000) + parseInt(value / 1000000000000000000);
        this.minimumRegistrationCost = sum;
        return sum;
      }
    },

    async stakeRewards() {
      if (this.freyalaStake) {
        const rewards = parseInt(await this.freyalaStake.methods.stakeRewards(this.accountAddress).call());
        const owing = parseInt(await this.freyalaStake.methods.calculateEarnings(this.accountAddress).call());
        const sum = rewards + owing;
        this.stakingRewards = sum;
        return sum;
      }
    },

    async totalReward() {
      const owing = parseInt(await this.freyalaStake.methods.calculateEarnings(this.accountAddress).call());
      const recorded = parseInt(await this.freyalaStake.methods.stakeRewards(this.accountAddress).call());
      const referral = parseInt(await this.freyalaStake.methods.referralRewards(this.accountAddress).call());
      const sum = owing + referral + recorded;
      this.totalRewards = sum;
      return sum;
    },

    async updateStatus() {
      if (this.freyalaToken) {
        this.registrationStatus = await this.freyalaStake.methods.registered(this.accountAddress).call();
      }
    },

    async registerAndStake() {
      this.error = ''
      this.stakingLoading = true;
      const actual = this.amountToStake * (10 ** 18);
      const arg = fromExponential(actual);
      try {
        let ref = "0x0000000000000000000000000000000000000000";

        await this.freyalaToken.methods.approve("0x861ef0CaB3ab4a1372E7eDa936668C8967F70110", arg).send({
          from: this.accountAddress,
          gasPrice: this.gasPrice,
          gasLimit: this.gasLimit,
          gas: parseFloat((this.gasPrice * this.gasLimit) / Math.pow(10, 9))
        });
        await this.freyalaStake.methods.registerAndStake(arg, ref).send({
          from: this.accountAddress,
          gasPrice: this.gasPrice,
          gasLimit: this.gasLimit,
          gas: parseFloat((this.gasPrice * this.gasLimit) / Math.pow(10, 9))
        });
        await this.updateAll();
        this.amountToStake = 0;
      } catch (err) {
        if (err.code !== 4001) {
          this.error = err
        }
        console.error(err);
      }
      this.stakingLoading = false;
    },

    async stake() {
      this.error = ''
      this.stakingLoading = true;
      const actual = this.amountToStake * (10 ** 18);
      const arg = fromExponential(actual);
      try {
        await this.freyalaToken.methods.approve("0x861ef0CaB3ab4a1372E7eDa936668C8967F70110", arg).send({
          from: this.accountAddress,
          gasPrice: this.gasPrice,
          gasLimit: this.gasLimit,
          gas: parseFloat((this.gasPrice * this.gasLimit) / Math.pow(10, 9))
        });
        await this.freyalaStake.methods.stake(arg).send({
          from: this.accountAddress,
          gasPrice: this.gasPrice,
          gasLimit: this.gasLimit,
          gas: parseFloat((this.gasPrice * this.gasLimit) / Math.pow(10, 9))
        });
        await this.updateAll();
        this.amountToStake = 0;
      } catch (err) {
        if (err.code !== 4001) {
          this.error = err
        }
        console.error(err);
      }
      this.stakingLoading = false;
    },

    async unstake(all) {
      this.error = ''
      if (parseFloat(this.stakes) === 0) {
        this.error = "You don't have any staked XYA yet!"
        console.error("You don't have any staked XYA yet!");
        return;
      }

      let actual = 0

      if (all) {
        actual = this.stakes
      } else {
        actual = this.amountToUnStake * (10 ** 18);
      }

      this.unStakingLoading = true;
      const arg = fromExponential(actual);
      try {
        await this.freyalaStake.methods.unstake(arg).send({
          from: this.accountAddress,
          gasPrice: this.gasPrice,
          gasLimit: this.gasLimit,
          gas: parseFloat((this.gasPrice * this.gasLimit) / Math.pow(10, 9))
        });
        await this.updateAll();
        this.amountToUnStake = 0;
      } catch (err) {
        if (err.code !== 4001) {
          this.error = err
        }
        console.error(err);
      }
      this.unStakingLoading = false;
    },

    async withdrawEarnings() {
      this.error = ''
      if (parseFloat(this.totalRewards) === 0) {
        this.error = "No earnings yet!"
        console.error("No earnings yet!");
        return;
      }
      this.withdrawLoading = true;
      try {
        await this.freyalaStake.methods.withdrawEarnings().send({
          from: this.accountAddress,
          gasPrice: this.gasPrice,
          gasLimit: this.gasLimit,
          gas: parseFloat((this.gasPrice * this.gasLimit) / Math.pow(10, 9))
        });
        await this.updateAll();
      } catch (err) {
        if (err.code !== 4001) {
          this.error = err
        }
        console.error(err);
      }
      this.withdrawLoading = false;
    }
  }
};
</script>
