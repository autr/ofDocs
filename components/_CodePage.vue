<template lang="pug">
#code-page
	#side-menu
		#code-sources
			h4.f3.dropdown-toggle Sources
			// (:click="showSources = !showSouces") Sources
			.srcsiblings.dropdown-area
				// ( v-show="showSources" )
				nuxt-link.block(
					v-for="c, i in siblings"
					:key="i"
					:to=" c.path " 
					:class="{ current: (c.path == entry.path) }"
				)
					span.src src 
					span.name {{c.name}} 
		#comments.dropdown-area
			// (v-if="comments.length > 0")
			h4.f3.dropdown-toggle Comments
			.dropdown-area( v-show="showComments" )
				a.block( 
					:href="'#'+c.number"
					v-for="c, i in comments " 
					v-if="c.valid"
					:key="i")
					span.number {{c.number}}
					span.comment {{c.text}}
		see-also( v-bind="toplevel" )
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
			f: this.$store.state.filters,
			comments: [],
			showComments: true,
			showSources: true
		}
	},
	methods: {
	},
	props: ['type', 'methods', 'description', 'document', 'config', 'entry'],
	created() {

	},
	mounted() {
		this.offsetHeight = this.$refs.code.offsetHeight;

		let idx = 0;
		let text = "";
		let texts = [];
		this.$refs.code.querySelectorAll('.comment').forEach( c => {


			const line =  Math.round(c.offsetTop / 18);
			const h =  Math.round(c.offsetHeight/18) ;

			if (idx !== line ) {
				this.comments.push( {
					number: line,
					text: "",
					valid: false
				} );
				texts.push(text);
				text = "";
			}
			text += c.innerText;
			idx = line + h;
		});
		texts.push(text);

		for (let i = 1; i < texts.length; i++ ) {

			let idx = 0;
			let t = texts[i];
			const chars = [" ", "/", "-", "<", "\\", "}","{","*"];
			while( chars.indexOf( t[idx] ) !== -1) idx += 1;
			this.comments[i-1].valid = (idx < t.length);
			this.comments[i-1].text = t.substring( idx,t.length );
		}


	}
}
</script>
