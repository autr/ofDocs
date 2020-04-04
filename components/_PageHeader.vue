<template lang="pug">

.doc-header: .doc-header-inner: .inner
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