<template lang="pug">
.list-page
	#list-body.inner
		.markdown.mb4
			.html( v-if="document" v-html="document" )
		directory( v-bind:items="entry.children" )

</template>

<script>
import Base from '~/components/Base.vue'
import List from '~/components/List.vue'
import Directory from '~/components/_Directory.vue'
export default {
	extends: Base,
	props: ['entry', 'intro', 'items', 'document'],
	components: {
		List,
		Directory
	},
	computed: {
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


</style>
