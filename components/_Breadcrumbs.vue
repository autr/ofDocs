<template lang="pug">
span.breadcrumbs
	span.crumb( v-if="$slots.default" )
		slot
		span.chevron.right
	span.crumb(
		v-for="b, i in crumbs"
		:key="i" )
		nuxt-link.pink( v-if="(b.path !== entry.path) && links" :to="b.path" ) {{  b.name  }} 
		span.link( v-if="(b.path === entry.path) || !links" :class="{selector: options && selector}" ) 
			span.name(v-html="b.name ") 
			span.chevron.bottom
			select( v-if="options && selector" v-model="selectorValue" @change="onSelectorChange" )
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
    langs() {
      if (this.$props.entry.translations) return this.$props.entry.translations;
      return false;
    },
		options() {
			let arr = [];
			const e = this.$props.entry;
			const b = e.breadcrumbs;
			const p = this.data[b[0] ];
			if (!p) return undefined;
			let c = this.filtered(p.children);
			return c;
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
			selectorValue: ""
		}
	},
	methods: {
		onSelectorChange(e) {
			this.$router.push( e.target.value );
		}
	},
	created() {

	},
	mounted() {
		this.selectorValue = this.$props.entry.path;
	},
	props: ['entry', 'last', 'first', 'links', 'selector']
}
</script>
