<template lang="pug">
#homepage
  .inner.markdown.mt4.mb4
    p
      span 
        a(href="https://github.com/Autr/ofDocs") ofDocs 
        span is an alternative documentation, examples and code browser for 
      a( href="https://openframeworks.cc/") openFrameworks
      span , which mirrors a list of files and folders into a website using Nuxt and Vue. Currently it is set up to serve documentation from 
      a( href="https://github.com/openframeworks/ofSite") ofSite
      span , READMEs and code from the 
      a( href="https://github.com/openframeworks/openFrameworks") openFrameworks repository
      span , and optionally 
      a( href="https://ofxaddons.com" ) user-installed addons
      span . 
  list-page.homepage( v-bind="tweakedPage" :showDoc="false" )

</template>

<script>
import Base from '~/components/Base.vue'
import Directory from '~/components/_Directory.vue'
import ListPage from '~/components/_ListPage.vue'
export default {
  extends: Base,
  components: {
    Directory,
    ListPage
  },
  computed: {
    navStructure() {
      let obj = {};
      this.$store.state.navigation.forEach( n => {
        obj[n[0]] = this.structure[n[0]];
      });
      return obj;
    },
    tweakedPage() {
      this.page.entry.children = [];
      Object.keys( this.structure ).forEach( k => {
        this.page.entry.children.push( this.structure[k].id );
      });
      return this.page;
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
      const path = '/ofdocs/readme?as=json';
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
