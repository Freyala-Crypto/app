<template>
  <div>
    <main :class="`md:flex flex-wrap`">
      <sidebar/>

      <section :class="`w-full md:w-2/3 p-8 text-xl ml-auto pb-24`">

        <div :class="`w-full md:w-3/4 transaction-title mb-16`">
          <h1 :class="`w-full md:w-4/5 border-b-4 border-white`">
          <span>
            Settings
          </span>
          </h1>
        </div>

        <div class="mb-4">
          <a href="/#/private-key">
            <button>
              Export private key
            </button>
          </a>
        </div>
<!--        <div class="mb-4">-->
<!--          <a href="/#/import-wallet">-->
<!--            <button>-->
<!--              Import existing wallet-->
<!--            </button>-->
<!--          </a>-->
<!--        </div>-->
        <div class="mb-4">
          <a href="/#/create-wallet">
            <button>
              Create new account
            </button>
          </a>
        </div>
        <div class="mb-4">
          <a href="/#/select-account">
            <button>
              Select account
            </button>
          </a>
        </div>
        <div class="mb-4">
          <a href="/#/select-network">
            <button>
              Select network
            </button>
          </a>
        </div>
        <div class="mb-4">
          <a href="/#/tokens">
            <button>
              Edit tokens
            </button>
          </a>
        </div>
        <div class="mb-4">
          <a href="/#/customize">
            <button>
              Customize
            </button>
          </a>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar.vue";

export default {
  components: {
    Sidebar
  }
};
</script>
