<template lang="pug">
#list-page
	#list-header.inner
		#doctitles
			h1.page-title.mb4.questrial 

				span.f7 
					i.ico.f5(v-if="entry.icon") {{entry.icon}}
					span {{ entry.name }} 
				span.langs.f5(v-if="trans") 
					span(
						v-for="l, k in trans"
					)
						nuxt-link.pink( :to="l.path" ) {{k}}
	#list-body.inner
		.markdown.mb4
			.html( v-if="document" v-html="document" )
		#items( v-if="filtered( entry.children, patterns ).length > 0" )
			.markdown: hr
			.columns
				.column.mb2(
					v-for="p, i in filtered( entry.children, patterns ) "
					:key="i"
					)
					list.recursive-header( 
						:entry="p" 
						:filters="patterns"
						:depth="3",
						:useIcon="false"
					)

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
		trans() {
			if (this.$props.intro) return this.$props.intro.translations;
			if (this.$props.entry.translations) return this.$props.entry.translations;
			return false;
		},
		findSrc() {
			for (let i = 0; i < this.$props.items.length; i++) {
				if (this.$props.items[i].name === 'src') return this.$props.items[i];
			}
			return false;
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
