<template lang="pug">
#renderer(v-if="page")
  page-header( v-if="page.entry.name !== 'home'" v-bind="page.entry" )
  home-page( v-if="page.entry.name === 'home'" v-bind="page" )
  doc-page(  v-else-if="page.type === 'page' && page.methods" v-bind="page" )
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
import HomePage from '~/components/_HomePage.vue'
import PageHeader from '~/components/_PageHeader.vue'
export default {
  extends: Base,
  components: {
    DocPage,
    CodePage,
    ListPage,
    HomePage,
    PageHeader
  },
  computed: {
  },
  methods: {

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
  mounted() {
    const w = window.location.pathname;
    console.log(this.page.entry.path, w);
    if (this.page.entry.path === w + '/') {
       this.$router.push( w.substring(0,w.length-1) );
    }
  }
}
</script>

<style lang="sass">

@import '@/assets/css/theme'
@import '@/assets/css/_utils' 

@mixin generateHeaders($fontSize, $ratio: 1.61803398875)
  $fontRatios: 0.785714, 1, 1.2857, 1.64285, 2.071428, 2.642857
  font-size: $fontSize
  line-height: $fontSize * $ratio
  @for $i from 1 through length( $fontRatios )
    h#{$i}
      $fSize: $fontSize * nth( $fontRatios, $i )
      font-size: $fSize
      line-height: $fSize * 1.61803398875


#app .markdown
  p, h1, h2, h3, h4, h5, h6
    margin-top: 1em
  .light
    // color: $pink
    font-weight: normal
  h1, h2, h3, h4, h5, h6
    // font-family: Questrial, sans-serif
    // letter-spacing: 0.05em
    color: mono(10)
  generateHeaders(14px)
  h1, h2, h3, h4, h5, h6
    margin-bottom: 1em
    // font-family: Questrial, sans-serif
    // font-weight: normal
  p+*:not(p)
    margin-top: 1em
  *:not(p) + p
    margin-top: 1em
  p+p
    margin-top: 0em
  h1 
    font-size: 28px
  h2 
    font-size: 20px
  h3, h4, h5, h6
    font-size: 16px
  strong
    font-weight: bold
  img
    margin: 2em 0em
    max-width: 100%
  a
    color: $pink
  s // tag
    padding: 0.2em 0.5em
    border-radius: 2px
    margin-right: 0.5em
    box-sizing: border-box
    font-family: Courier
    // font-weight: bold
    color: #666
    text-decoration: none
    background: #eee
  hr 
    border: none
    background: none
    margin: 2em 0em!important
    display: block
    border-top: 1px solid #eee
#app
  pre
    // background: mono(95)
    display: block
    padding: 20px 0px
    border-radius: 2px
    color: mono(10)
  pre, code
    font-family: Courier, serif
    white-space: pre-wrap
    white-space: -o-pre-wrap
    word-wrap: break-word
    line-height: 18px!important
#app.code
  #renderer
    background: #333
    color: white
    .crumb
      color: mono(90)





</style>
