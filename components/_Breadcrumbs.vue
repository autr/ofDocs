<template lang="pug">
span.breadcrumbs
	span.crumb( v-if="$slots.default" )
		slot
		span.chevron.right
	span.crumb(
		v-for="b, i in crumbs"
		:key="i" )
		nuxt-link.pink( v-if="(b.path !== entry.path) && links" :to="b.path" ) {{  b.name  }} 
		span.link( v-if="(b.path === entry.path) || !links" ) {{  b.name  }} 
		span.chevron.right( v-if=" i < crumbs.length - 1")
</template>

<script>
import Base from '~/components/Base.vue'
export default {
	extends: Base,
	components: {
	},
	computed: {
		crumbs() {
			if (!this.$props.entry.breadcrumbs) {
				console.error('❌ [Breadcrumbs.vue] no entry');
			}
			return this.breadcrumbs(this.$props.entry);
		}
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
	props: ['entry', 'last', 'first', 'links']
}
</script>

<style lang="sass">

@import '@/assets/css/theme'
@import '@/assets/css/_utils' 
.crumb
	display: inline-block
	color: mono(60)
	.chevron
		margin-right: 0.75em
		margin-left: 0.2em

</style>
