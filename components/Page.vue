<template lang="pug">
#renderer(v-if="page")
  page-header( v-bind="page.entry" )
  doc-page(  v-if="page.type === 'page' && page.methods" v-bind="page" )
  list-page( v-else-if="page.type === 'page' && !page.methods" v-bind="page" )
  list-page( v-else-if="page.type === 'folder'" v-bind="page" )
  code-page( v-else-if="page.type === 'source'" v-bind="page" )
</template>

<script>
import Vue from 'vue';
import Base from '~/components/Base.vue'
import DocPage from '~/components/_DocPage.vue'
import CodePage from '~/components/_CodePage.vue'
import ListPage from '~/components/_ListPage.vue'
import PageHeader from '~/components/_PageHeader.vue'
export default {
  extends: Base,
  components: {
    DocPage,
    CodePage,
    ListPage,
    PageHeader
  },
  computed: {
  },
  head () {
    return {
      title: this.getMetaTitle(),
      meta: [
        { 
          hid: 'description', 
          name: 'description', 
          content: this.getMetaDesc()
        },
        { 
          hid: 'keyword', 
          name: 'keyword', 
          content: this.getMetaKeywords()
        },
        { 
          property: 'og:description', 
          content: this.getMetaDesc(),
          vmid: 'og:description'
        },
        { 
          property: 'og:title', 
          content: this.getMetaTitle(),
          vmid: 'og:title'
        },
        { 
          property: 'og:image', 
          content: this.getMetaImage(), 
          vmid: 'og:image'
        },
      ]
    }
  },
  methods: {

    getMetaTitle() {
      let parent = this.data[this.page.entry.parent];
      let b = "";
      while (parent) {
        b = parent.name + ' | ';
        parent = this.data[parent.parent];
      }
      return `${this.page.entry.name} | ${b}${this.$store.state.meta.baseTitle}`;
    },
    getMetaDesc() {
      return this.$store.state.meta.baseDesc;
    },
    getMetaImage() {
      return "/files/images/ofw-logo.png";
    },
    getMetaKeywords() {
      return "";
    },
  },
  created() {

  },
  async asyncData ( { $axios, app, store, route, params, query, env, isDev, isHMR, redirect, error, payload } ) {
    if (payload) {
      console.log('🚜  [Page.vue] payload:', payload.entry.name );
      return {page: payload};
    } else {
      let p = route.path.toLowerCase();
      // if (p.indexOf('/ofDocs' === -1)) p = '/ofDocs' + p;
      const path = p + '?as=json';
      console.log('🚜  [Page.vue] api:', path);
      try {
        return { page: await $axios.$get( path ) };
      } catch(err) {
        console.error('❌  [Page.vue] api:', err.response.statusText, path);
      }
    }
  },
  beforeMount() {
    // let w = window.location.pathname;
    // console.log(this.page.entry.path, w);
    // if (this.page.entry.path + '/' === w  ) {
    //    this.$router.replace( w.substring(0,w.length-1) );
    // }
  }
}
</script>
