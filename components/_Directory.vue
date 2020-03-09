<template lang="pug">
.directory( v-if="filtered( items, patterns ).length > 0" )
	.markdown: hr
	.columns
		.column(
			:class="[margin]"
			v-for="p, i in filtered( items, patterns ) "
			:key="i"
			)
			list.recursive-header( 
				:entry="p" 
				:filters="patterns"
				:depth="depth",
				:useIcon="false"
			)

</template>

<script>
import List from '~/components/List.vue'
import Base from '~/components/Base.vue'
export default {
	name: 'Directory',
	extends: Base,
	data() {
  		return {

  		}
	},
	computed: {
	},
	methods: {

	},
	components: {
		List
	},
	mounted() {
	},
	props: {

		items: {
			type: Array,
			required: true
		},
		margin: {
			type: String,
			required: false,
			default: 'mb2'
		},
		depth: {
			type: Number,
			required: false,
			default: 3
		},
		patterns: {
			type: Array,
			required: false,
			default() {
				return ['jpg', 'png', 'gif', 'svg', 'search_results', 'introduction', 'readme', 'index', '.ja', '.ko', '.zh_cn', '-ja', '-ko', '-zh_cn']
			}
		}
	}
}
</script>

<style lang="sass">



</style>
