<template lang="pug">
#documentation-page

	#side-menu.markdown
		#params(v-if="paramsOnly.length > 0")
			h4 Variables
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
			hr
		#methods-list(v-if="methodsMenu.length > 0")
			h4 Methods
			.anchor(
				v-for=" m, i in methodsMenu"
				v-if="m.name"
				:key="i")
				code
					a( 
					:href="'#'+m.name" 
					:class="{pink: m.short || m.desc}" ) {{stripWhitespace(m.name)}}
		see-also( v-bind="entry" )#see-also










	#offset-page
					



		#doc-header.inner
			#doctitles
				h1.page-title.mb1.questrial 
					span.f7 {{ entry.name }}
					span.langs.f5
						span(
							v-for="l, k in entry.translations"
						)
							nuxt-link.pink( :to="l.path" ) {{k}}
				#extends( v-if="extendEntry") 
					.mtb0.f3
						span extends  
						nuxt-link.pink( :to="extendEntry.path") {{extendEntry.name}}
			#actions 
				button.button(
					@click="toggleEdit"
				) {{ editMode ? 'Cancel' : 'Edit'}}
				button.button(
					v-if="editMode"
				) Save





		#doc-body.markdown
			.edit(v-if="editMode" ): code: .editor.inner( v-html="raw" contenteditable )
			.inner( v-if="!editMode" )
				.renderer
					#description( v-if="description" )
						//- .short-description( v-if="description.short" )
						//- 	h4 Short Description
						//- 	.html(v-html="description.short")
						.full-description( v-if="description.full" )
							//- h4 Full Description
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
									code.pink(v-if="m.parameters") …
									| )
								code
									span.token.keyword(v-if="m.returns") {{m.returns}}  
									span.token.function {{m.name}}
									span.token.punctuation (
									code.token.boolean(v-if="m.parameters" v-html="m.parameters")
									span.token.punctuation )
								.short(v-html="m.short")
								.desc(v-html="m.desc")
							hr 
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
			return this.methodsOnly;
		}
	},
	data() {
		return {
			editMode: false
		}
	},
	methods: {
		toggleEdit() {
			this.editMode = !this.editMode;
		},
		codeString( s ) {
			return `${s} ${s.name} ( ${s.parameters} )`
		}
	},
	props: ['type', 'methods', 'description', 'entry', 'config', 'raw'],
	created() {

	},
	mounted() {
	}
}
</script>

<style lang="sass">
	
@import '@/assets/css/theme'
@import '@/assets/css/_utils' 
#app
	#extends
		position: relative
		top: -10px
		color: mono(60)
	#doc-header
		display: flex
		width: 100%
		#actions
			text-align: right
			flex-grow: 1
	#methods-list
		a
			color: mono(30)
			&.pink
				color: $pink
	.editor
		outline: none
		padding: 2em 0em
		margin: 4em 0em



</style>
