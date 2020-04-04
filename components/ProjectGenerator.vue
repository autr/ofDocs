<template lang="pug">
#project-generator
  .inner

</template>

<script>
import Base from '~/components/Base.vue'
import Directory from '~/components/_Directory.vue'
import Field from '~/components/Field.vue'
export default {
  extends: Base,
  components: {
    Directory
  },
  computed: {
  },
  data() {
      return {

        // value: 0,
        // id: 'Hello',
        // autocomplete: true,
        // type: 'input',
        // disabled: false,
        // placeholder: 'Enter'
        // options: ['A'],
        // rows: 4 

        ofPath: "",
        path: "",
        verbose: true,
        defines: false,
        addons: [],
        platforms: [],
      }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { 
          property: 'og:title', 
          content: this.title,
          vmid: 'og:title'
        },
        { 
          property: 'og:image', 
          content: "/files/images/ofw-logo.png",
          vmid: 'og:image'
        },
      ]
    }
  },
  async asyncData ( { $axios, app, store, route, params, query, env, isDev, isHMR, redirect, error, payload } ) {
  },
  methods: {
  },
  created() {

  },
  mounted() {
  }
}
</script>

<style lang="sass">


</style>