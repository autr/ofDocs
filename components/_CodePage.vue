<template lang="pug">
#code-page.markdown
	#side-menu
		#code-sources( v-if="insideSrc" )
			h4 Sources
			.srcsiblings
				.other(
					v-for="c, i in siblings"
					:key="i"
				)
					span.src src 
					nuxt-link( :to=" c.path " ) {{c.name}} 
		see-also( v-bind="toplevel" )#see-also
	#code-render: .inner
		pre
			code(v-html="document" ref="code")
			a.line-number(
				v-for="(t, i) in lineTotal"
				:key="i"
				:href="'#'+(i+1)"
				:id="(i+1)"
				:style="{top: t + 'px'}"
			) {{i+1}}
</template>

<script>
import Vue from 'vue';
import Base from '~/components/Base.vue'
import SeeAlso from '~/components/_SeeAlso.vue'
export default {
	extends: Base,
	components: {
		SeeAlso
	},
	computed: {

		toplevel() {
			const b = this.$props.entry.breadcrumbs;
			if (b.length <= 0) {
				console.error('no breadcrumbs');
				return;
			}

			return this.data[ b[b.length-2] ];
			// let i = b.length-1;
			// let anc = this.data[ b[i] ];
			// console.log('>>>>>', i, b.length)
			// while( !anc && i >= 0 ) {
			// 	i -= 1;
			// 	console.log(b[i])
			// 	anc = this.data[ b[i] ];
			// }
			// console.log('DONE', anc.name)
			// return anc;
		},
		greatgrandparent() {

			const i = this.$props.entry.breadcrumbs[2];
			if (!i) {
				console.error('no parent');
				return false;
			}
			return { ...this.data[i] };
		},
		grandparent() {

			const i = this.$props.entry.breadcrumbs[1];
			if (!i) {
				console.error('no parent');
				return false;
			}
			return { ...this.data[i] };
		},
		parent() {

			const i = this.$props.entry.breadcrumbs[0];
			if (!i) {
				console.error('no parent');
				return false;
			}
			return { ...this.data[i] };
		},
		siblings() {
			let arr = [];
			this.parent.children.forEach( c => {
				arr.push( {...this.data[c] });
			});
			return arr;
		},
		srcTitle() {
			const e = this.$props.entry;
			const p = this.parent;
			if (!p) {
				console.error('no parent');
				return false;
			}
			if (this.insideSrc && e.breadcrumbs.length > 1) {
				return this.data[e.breadcrumbs[1]].name;
			}
			if (e.name === 'src') return p.name;
		},
		insideSrc() {
			const e = this.$props.entry;
			const p = this.parent;
			if (!p) {
				console.error('no parent');
				return false;
			}
			return (p.name === 'src')
		},
		lineTotal() {
			let arr = [];
			for (let i = 0; i < this.offsetHeight / 18; i++) {
				arr.push( (i * 18) + 20 );
			}
			return arr;
		}
	},
	data() {
		return {
			offsetHeight: 0,
			f: ['jpg', 'png', 'gif', 'svg', 'search_results', 'introduction', 'readme', 'index', '.ja', '.ko', '.zh_cn', '-ja', '-ko', '-zh_cn']
		}
	},
	methods: {
	},
	props: ['type', 'methods', 'description', 'document', 'config', 'entry'],
	created() {

	},
	mounted() {
		this.offsetHeight = this.$refs.code.offsetHeight;
	}
}
</script>

<style lang="sass">

@import '@/assets/css/theme'
@import '@/assets/css/_utils' 

#app
	#code-render
		padding-right: 320px
		position: relative
	&.code
		#actions
			.button
				color: white
	.srcsiblings
		font-family: Courier, serif
		.src
			color: mono(70)
		a
			color: deeppink!important
	a.line-number
		position: absolute
		height: 18px
		box-sizing: border-box
		left: 5px
		color: mono( 80 )!important
		&:active, &:focus
			color: $pink!important


</style>
