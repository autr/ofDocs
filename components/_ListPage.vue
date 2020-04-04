<template lang="pug">
.list-page
	#list-body.inner
		.markdown.pt2( v-if="document && showDoc")
			.html( v-html="document" )
		.direct(v-if="filtered(entry.children, filters).length > 0")
			.markdown.pb1: hr
			.nrow(
				v-for="e, i in filtered(entry.children, filters)"
				:key="i"
			)
				.ncol-left
					nuxt-link.pink.ptb1( :to="e.path" v-html="e.name" )
				.ncol-columns.mb1( v-if="e.children" )
					.flow( :class="{ 'no-cols': (filtered( e.children, filters ).length <= 4) }" )
						nuxt-link(
							v-for="ee, ii in filtered( e.children, filters )"
							:key="ii"
							:to="ee.path"
							v-html="ee.name.replace(' (functions)','<span>functions</span>')"
						)
						span.extra(v-if="getSrc(e)")
							nuxt-link(
								v-for="ee, ii in filtered( getSrc(e).children, filters )"
								:key="ii"
								:to="ee.path"
								v-html="ee.name.replace(' (functions)','<span>functions</span>')"
							)
		//- directory( v-bind:items="entry.children" )

</template>

<script>
import Base from '~/components/Base.vue'
import List from '~/components/List.vue'
import Directory from '~/components/_Directory.vue'
export default {
	extends: Base,
	props: ['entry', 'intro', 'items', 'document', 'showDoc'],
	components: {
		List,
		Directory
	},
	computed: {
	},
	data() {
		return {
			filters: this.$store.state.filters
		}
	},
	methods: {
		divide( ) {

		},
		getSrc( e ) {
			if (!e.children) return false;
			if (e.children.length <= 0) return false;
			let out = false;
			e.children.forEach( i => {
				if (this.data[i].name === "src") out = this.data[i];
			})
			return out;
		}
	},
	created() {

	},
	mounted() {
	}
}
</script>

