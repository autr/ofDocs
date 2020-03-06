<template lang="pug">
#home-page
  #home-body.inner
    #items
      .columns
        .column.mt4(
          v-for="n, i in menu"
          v-if="structure[n[0]]"
          :key="i" 
          )
          list.recursive-header( 
            :entry="structure[n[0]]" 
            :filters="f"
            :depth="1"
          )
      .markdown: hr
    .markdown.mb4
      .html( v-if="document" v-html="document" )

</template>

<script>
import Base from '~/components/Base.vue'
import List from '~/components/List.vue'
export default {
  extends: Base,
  props: ['entry', 'intro', 'items', 'document'],
  components: {
    List
  },
  computed: {
  },
  data() {
    return {

      menu: [ 
        ['Documentation', 4], 
        ['Guides', 2], 
        ['examples', 3], 
        ['openFrameworks', 2], 
        ['addons', 2]
      ],
      f: ['jpg', 'png', 'gif', 'svg', 'search_results', 'introduction', 'readme', 'index', '.ja', '.ko', '.zh_cn', '-ja', '-ko', '-zh_cn']
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



</style>
