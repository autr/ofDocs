<template lang="pug">

.doc-header: .doc-header-inner: .inner
	.mt2.mb2
		breadcrumbs( :entry="$props" :last="true" :first="true" :links="true" :selector="true")
			nuxt-link.pink( to="/" ) ofDocs
		
</template>

<script>
import Breadcrumbs from '~/components/_Breadcrumbs.vue'
export default {
	components: {
		Breadcrumbs
	},
	computed: {
	},
	data() {
		return {
		}
	},
	methods: {
	},
	created() {

	},
	mounted() {
	},
	props: ['name', 'filename', 'breadcrumbs', 'path']
}
</script>

<style lang="sass">

@import '@/assets/css/theme'
@import '@/assets/css/_utils' 

#app.code
	.page-title
		display: none

.doc-header
	// min-height: 60px
	.doc-header-inner
		// position: fixed
		// top: 0
		// background: white
		// border-bottom: 1px solid mono(95)
		// width: 100%
		// // left: 0
		// z-index: 10
		.inner
			position: relative
			#actions
				position: absolute
				right: 50px
				top: 20px

</style>
