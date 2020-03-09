<template lang="pug">
span.breadcrumbs
	span.crumb( v-if="$slots.default" )
		slot
		span.chevron.right
	span.crumb(
		v-for="b, i in crumbs"
		:key="i" )
		nuxt-link.pink( v-if="(b.path !== entry.path) && links" :to="b.path" ) {{  b.name  }} 
		span.link( v-if="(b.path === entry.path) || !links" :class="{selector: options}" ) 
			span {{  b.name  }} 
			span.chevron.bottom
			select( v-if="options" v-model="selector" @change="onSelectorChange" )
				option( v-for="o, i in options" :value="o.path" ) {{o.name}}
		span.chevron.right( v-if=" i < crumbs.length - 1")
</template>

<script>
import Base from '~/components/Base.vue'
export default {
	extends: Base,
	components: {
	},
	computed: {
		options() {
			let arr = [];
			const e = this.$props.entry;
			const b = e.breadcrumbs;
			const p = this.data[b[0] ];
			if (!p) return undefined;
			return this.filtered(p.children);
		},
		crumbs() {
			if (!this.$props.entry.breadcrumbs) {
				console.error('❌ [Breadcrumbs.vue] no entry');
			}
			return this.breadcrumbs(this.$props.entry);
		}
	},
	data() {
		return {
			selector: this.$props.entry.path
		}
	},
	methods: {
		onSelectorChange(e) {
			console.log('WEEEEE', e.target.value);
			this.$router.push( e.target.value );
		}
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
#app 
	.crumb
		display: inline-block
		color: mono(60)
		.chevron
			margin-right: 0.75em
			margin-left: 0.2em
		.link .chevron
			display: none
		.selector
			position: relative
			background: mono(96)
			padding: 0.2em 0.2em 0.2em 0.8em
			border-radius: 2px
			.chevron
				display: inline-block
			.chevron:before

				// transform: scale(0.5)
			select
				@include fill()
				opacity: 0

</style>
