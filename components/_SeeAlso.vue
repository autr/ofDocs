<template lang="pug">
.see-also(v-if="also.length > 0")
  h4 See also
  .also(
    v-for="a, i in also"
    :key="i"
  ) 
    
    nuxt-link( :to="a.path" ) 
      span.origin {{origin(a).name}}
      span.name {{a.name}}
</template>

<script>
import Base from '~/components/Base.vue'
import Breadcrumbs from '~/components/_Breadcrumbs.vue'
export default {
  extends: Base,
  components: {
    Breadcrumbs
  },
  computed: {
    also() {
      const n = this.$props.name;
      if (!n) {
          console.error('[SeeAlso.vue] no name given');
          return;
      }
      const p = this.$props.path;
      let arr = [];
      for (let i = 0 ; i < this.data.length; i ++) {
        const d = this.data[i];
        if (!d) {
          console.error('[SeeAlso.vue] no data with id', i);
        } else {
          if (d.name.indexOf(n) !== -1 || n.indexOf(d.name) !== -1) {
            if (d.path !== p && d.type !== 'asset') arr.push( {...d } );
          }
        }
      }
      arr.reverse()
      return arr;
    }
  },
  data() {
    return {
    }
  },
  methods: {
    origin(a) {
      return this.data[ a.breadcrumbs.slice(-1)[0] ];
    }
  },
  created() {

  },
  mounted() {
  },
  props: ['name', 'path']
}
</script>

<style lang="sass">

@import '@/assets/css/theme'
@import '@/assets/css/_utils' 
.see-also
  a
    display: block
    .origin
      color: mono(70)
      margin-right: 5px
</style>
