<template lang="pug">
.list-page
	#list-header.inner( v-if="entry.path.toLowerCase().indexOf('pages') === -1" )
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
		trans() {
			if (this.$props.intro) return this.$props.intro.translations;
			if (this.$props.entry.translations) return this.$props.entry.translations;
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


</style>
