<template lang="pug">
#documentation-page


	#offset-page
					

		#doc-body.markdown
			.inner( v-if="methods" )
				#description( v-if="description" )
					//- .short-description( v-if="description.short" )
					//- 	h4 Short Description
					//- 	.html(v-html="description.short")
					.full-description( v-if="description.full" )
						.html(v-html="description.full")


				#methods
					hr 
					section.mb2(
						v-for=" m, i in methodsOnly"
						v-if="m.name"
						:name="m.name"
						:id="m.name"
						:key="i")
						.method.mb2
							h3.f3.title
								| {{m.name}}( 
								code.pink(v-if="m.parameters") ...
								|  )
							code
								span.token.keyword(v-if="m.returns") {{m.returns}}  
								span.token.function {{m.name}}
								span.token.punctuation (
								code.token.boolean(v-if="m.parameters" v-html="m.parameters")
								span.token.punctuation )
							.short(v-html="m.short")
							.desc( v-html="m.desc")
						hr 
			.inner( v-else v-html="document" )



	#side-menu
		#params(v-if="paramsOnly.length > 0")
			h4.f3 Variables
			code(
				v-for=" vari, i in paramsOnly"
				:key="i")
				.functions(v-if="vari.name")
				.variable
					.title
						span.token.keyword {{stripWhitespace( vari.type )}} 
						span {{stripWhitespace( vari.name )}}
						span.token.comment(v-html=" stripHtml( vari.short ) ")
					.desc(v-html="vari.desc")
		#methods-list(v-if="methodsMenu.length > 0")
			h4.f3 Methods
			.anchor(
				v-for=" m, i in methodsMenu"
				v-if="m.name"
				:key="i")
				code
					a( 
					:href="'#'+m.name" 
					:class="{pink: m.short || m.desc}" ) 
						span {{stripWhitespace(m.name)}}
						span(v-if="m.counter > 0") ({{m.counter + 1}})
		see-also( v-bind="entry" )#see-also








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
		extendEntry() {
			if (!this.$props.config) return;
			if (!this.$props.config.extends) return;
			for( let i = 0; i < this.data.length; i++) {
				if (this.data[i].name === this.$props.config.extends) return {...this.data[i]};
			};
		},
		paramsOnly() {
			if (!this.$props.methods) return [];
			return this.$props.methods.filter( (e) => {
				if (!e) return false;
				const keys = Object.keys(e);
				return (keys.indexOf('returns') === -1 && keys.indexOf('returns_description') === -1 && e.name);
			})
		},
		methodsOnly() {
			if (!this.$props.methods) return [];
			return this.$props.methods.filter( (e) => {
				if (!e) return false;
				const keys = Object.keys(e);
				return (keys.indexOf('returns') !== -1 && keys.indexOf('returns_description') !== -1);
			})
		},
		methodsMenu() {
			if (!this.$props.methods) return [];
			const m = this.methodsOnly;
			let n = [];
			let out = [];
			for (let i = 0; i < m.length; i++) {
				const idx = n.indexOf( m[i].name );
				if (idx === -1) {
					m[i].counter = 0;
					out.push(m[i]);
					n.push(m[i].name);
				} else {
					out[idx].counter += 1;
				}
			};
			return out;
		}
	},
	data() {
		return {
			viewIdx: 0
		}
	},
	methods: {
		codeString( s ) {
			return `${s} ${s.name} ( ${s.parameters} )`
		}
	},
	props: ['type', 'methods', 'description', 'entry', 'config', 'raw', 'document'],
	created() {

	},
	mounted() {
	}
}
</script>
