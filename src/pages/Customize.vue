<template>
  <main :class="`md:flex flex-wrap`">
    <sidebar />

    <section :class="`w-full md:w-2/3 p-8 text-xl ml-auto`">
      <div :class="`w-3/4 transaction-title`">
        <h1 :class="`w-full md:w-4/5 border-b-4 border-white`">
          <span>
            Customize
          </span>
        </h1>
      </div>

      <div :class="`w-full md:w-3/4 flex flex-wrap transaction-menu pt-12`">
        <h2 :class="`w-full md:w-3/4 uppercase text-xl font-semibold`">
          Select color theme
        </h2>

        <div @click="$store.dispatch('selectTheme', 'emerald')" :class="`w-full md:w-3/4 flex text-xl cursor-pointer`">
          <div :class="`w-1/2 mt-12`">
            Emerald
          </div>
          <div :class="`w-1/2 mt-12`">
            <span v-if="$parent.theme.selected === 'emerald'">Enabled</span>
            <span v-else>Disabled</span>
          </div>
        </div>
        <div @click="$store.dispatch('selectTheme', 'platinum')" :class="`w-full md:w-3/4 flex text-xl cursor-pointer`">
          <div :class="`w-1/2 mt-12`">
            Platinum
          </div>
          <div :class="`w-1/2 mt-12`">
            <span v-if="$parent.theme.selected === 'platinum'">Enabled</span>
            <span v-else>Disabled</span>
          </div>
        </div>
        <div @click="$store.dispatch('selectTheme', 'honey')" :class="`w-full md:w-3/4 flex text-xl cursor-pointer`">
          <div :class="`w-1/2 mt-12`">
            Honey
          </div>
          <div :class="`w-1/2 mt-12`">
            <span v-if="$parent.theme.selected === 'honey'">Enabled</span>
            <span v-else>Disabled</span>
          </div>
        </div>
        <div @click="$store.dispatch('selectTheme', 'violet')" :class="`w-full md:w-3/4 flex text-xl cursor-pointer`">
          <div :class="`w-1/2 mt-12`">
            Violet
          </div>
          <div :class="`w-1/2 mt-12`">
            <span v-if="$parent.theme.selected === 'violet'">Enabled</span>
            <span v-else>Disabled</span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Sidebar from '../components/Sidebar'

export default {
  data() {
    return {

    }
  },
  components: {
    Sidebar
  }
}
</script>
