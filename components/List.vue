<template lang="pug">
.item(v-if="level < depth")
	nuxt-link( :to="entry.path" :title="entry.route" )
		i.ico(v-if="entry.icon && useIcon") {{entry.icon}}
		span(v-if="$slots.default"): slot
		span(v-else) {{  entry.name  }}
	.list( v-if="isLinked")
		list( 
			v-if="filtered"
			v-for=" child, i in filtered( entry.children, filters )"
			:filters="filters"
			:level="level + 1"
			:depth="depth"
			:key="i"
			:entry="child" )

</template>

<script>
import Base from '~/components/Base.vue'
export default {
	name: 'List',
	extends: Base,
	data() {
  		return {

  		}
	},
	computed: {
		isLinked() {
			return (this.entry.path.indexOf(this.$route.path) !== -1) || (this.$route.path.indexOf(this.entry.path) !== -1);
		},
		isExact() {
			return (this.$route.path === this.item.route);
		},
		item() {
			return this.$store.state.data[this.$props.entry.id];
		}
	},
	methods: {

	},
	components: {
		// List
	},
	mounted() {
	},
	props: {

		entry: {
			type: Object,
			required: true
		},
		filters: {
			type: Array,
			required: false
		},
		depth: {
			type: Number,
			required: false
		},
		level: {
			type: Number,
			required: false,
			default: 0
		},
		useIcon: {
			type: Boolean,
			required: false,
			default: false
		}
	}
}
</script>

<style lang="sass">



</style>
