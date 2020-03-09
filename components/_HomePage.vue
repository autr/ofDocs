<template lang="pug">
#list-page
  #list-header.inner
    #doctitles
      h1.page-title.mb4.questrial 
        span.f7 ofDocs
  #list-body.inner
    //- h1 {{rootItems}}
    //- .markdown.mb4
    //-   .html( v-if="document" v-html="document" )
    section( v-for="s, i in structure " :key="i" )
      h1 {{s.name}}

</template>

<script>
import Base from '~/components/Base.vue'
import Directory from '~/components/_Directory.vue'
export default {
  extends: Base,
  props: ['entry', 'intro', 'items', 'document'],
  components: {
    Directory
  },
  computed: {
    rootItems() {
      let arr = [];
      console.log( this.$store.state.structure   );
      Object.keys( this.$store.state.structure ).forEach( k => {
        const e = this.$store.state.data[ this.$store.state.structure[k].id ];
        arr.push( e.id );
      });
      return arr;
    }
  },
  data() {
    return {
      patterns: ['jpg', 'png', 'gif', 'svg', 'search_results', 'introduction', 'readme', 'index', '.ja', '.ko', '.zh_cn', '-ja', '-ko', '-zh_cn']
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

@import '@/assets/css/theme'
@import '@/assets/css/_utils' 

#app

  #list-page
    .recursive-header
      > a
        font-size: 14px
        // font-weight: bold
        color: $pink
        padding-bottom: 1em
        display: block
        // color: mono(10)
    .auto-flow
      column-count: 4
      .auto
        font-size: $baseText + 1px
        a
          display: block
          // color: mono(10)
          padding: 1em 0em
          &:hover
            // color: $pink


</style>
