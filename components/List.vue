<template lang="pug">
.item(
	v-if="level < depth"
	:class="className"
	)
	a.allow-active( v-on:click.prevent.stop="beforeClick" :href="entry.path" :title="entry.route" :class="{ 'nuxt-link-active' : isActive }" )
		i.ico(v-show="entry.icon && useIcon") {{entry.icon}}
		span.name(v-show="$slots.default"): slot
		span.name(v-show="!$slots.default" v-html="entry.name.replace(' (functions)','<span>functions</span>')")
	.list( v-if="isLinked")
		list( 
			v-show="filtered"
			v-for=" child, i in filtered( entry.children, filters )"
			:parentPath="entry.path"
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
		className() {
			return {
				"show-menu": this.isActive,
				[this.entry.name]: true
			};	
		},
		isLinked() {
			return ( this.entry.path.indexOf( this.$route.path ) !== -1) || ( this.$route.path.indexOf( this.entry.path ) !== -1 );
		},
		item() {
			return this.$store.state.data[this.$props.entry.id];
		},
		isActive() {
			const b = (process) ? process.browser : false;
			const u = this.entry.path;
			const r = this.$route.path;
			const i = r.indexOf( u );
			const has = ( i !== -1 ) || ( r === u );
			const slash = r.substring( i, u.length - 1 ).indexOf('/') !== -1;
			return has && slash;
		}
	},
	methods: {
		beforeClick(e) {
			if ( this.$route.path === this.entry.path ) {
				this.$router.push(this.parentPath);
				return;
			}

			this.$router.push(this.entry.path);
			return;
		}

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
		},
		parentPath: {
			type: String,
			required: false,
			default: "/"
		}
	}
}
</script>
