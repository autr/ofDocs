<template lang="pug">
.list-page
  .inner
    .markdown.mb4.mt4.homepage-inner
      .html( v-if="page.document" v-html="page.document" )
    section.mb2( v-if="k !== 'files'" v-for="i, k in navStructure" :key="k" ) 
      h3: nuxt-link.f5.questrial.black( :to="i.path" ) {{k}}
      directory( v-bind:items="i.children" :depth="1" margin="mb1" )

</template>

<script>
import Base from '~/components/Base.vue'
import Directory from '~/components/_Directory.vue'
export default {
  extends: Base,
  components: {
    Directory
  },
  computed: {
    navStructure() {
      let obj = {};
      this.$store.state.navigation.forEach( n => {
        obj[n[0]] = this.structure[n[0]];
      });
      return obj;
    }
  },
  data() {
      return {
        page: null,
        title: 'Documentation, examples & code | openFrameworks | ofDocs'
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
    if (payload) {
      console.log('🚜  [Homepage.vue] payload:', payload.entry.name );
      return {page: payload};
    } else {
      const path = '/about/readme?as=json';
      console.log('🚜  [Homepage.vue] api:', path);
      try {
        return { page: await $axios.$get( path ) };
      } catch(err) {
        console.error('❌  [Homepage.vue] api:', err.response.statusText, path);
      }
    }
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