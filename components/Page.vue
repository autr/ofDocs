<template lang="pug">
#renderer(v-if="page" :class="{[page.type]: true}" )
  page-header( v-bind="page.entry" )
  edit-wrapper( 
    v-if="page.type !== 'source'" 
    :page="page"
    @updatePage="onUpdatePage"
  )
  //- doc-page(  v-if="page.type === 'page' && page.methods" v-bind="page" )
  //- list-page( v-else-if="page.type === 'folder'" v-bind="page" )
  code-page( v-else v-bind="page" )
</template>

<script>
import Vue from 'vue';
import Base from '~/components/Base.vue'
import EditWrapper from '~/components/_EditWrapper.vue'
import DocPage from '~/components/_DocPage.vue'
import ListPage from '~/components/_ListPage.vue'
import CodePage from '~/components/_CodePage.vue'
import PageHeader from '~/components/_PageHeader.vue'
export default {
  extends: Base,
  components: {
    DocPage,
    CodePage,
    ListPage,
    PageHeader,
    EditWrapper
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
  data() {
    return {
    }
  },
  methods: {
    onUpdatePage(data) {
      this.page = data;
    },
    getMetaTitle() {
      let parent = this.data[this.page.entry.parent];
      let b = "";
      while (parent) {
        b = parent.name + ' | ';
        parent = this.data[parent.parent];
      }
      let n = this.page.entry.name;
      let r = this.$store.state.meta.baseTitle;
      return `${n} | ${b}${r}`;
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
  mounted() {
    this.$store.state.id = this.page.entry.id;
  },
  created() {

  },
  async asyncData ( { $axios, app, store, route, params, query, env, isDev, isHMR, redirect, error, payload } ) {
    if (payload) {
      console.log('🚜  [Page.vue] payload:', payload.entry.name );
      return {page: payload};
    } else {
      let p = route.path.toLowerCase();
      const path = p + '?as=json';
      console.log('🚜  [Page.vue] api:', path);
      try {
        const page = await $axios.$get( path );
        return { page: page };
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
