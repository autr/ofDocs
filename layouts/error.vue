<template lang="pug">
  .wrapper
    h1( v-if="error.statusCode === 404") Page not found
    h1( v-else ) An error occurred
    nuxt-link( to="/" ) Return to Homepage
</template>

<script>
import Base from '~/components/Base.vue'
export default {
  props: ['error'],
  extends: Base,
  layout: 'default', // you can set a custom layout for the error page
  beforeMount() {
  }
}
</script>