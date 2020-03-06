<template lang="pug">
	#base {{data}}
</template>

<script>

// TODO: add metadata descriptions for each page

import axios from 'axios'

export default {
	data() {
  		return {
  			page: null
  		}
	},
	computed: {
		version() {
			return this.$store.state.version;
		},
		pageName() {
			return this.cleanFilename( this.page.entry.name );
		},
		structure() {
			return this.$store.state.structure;
		},
		data() {
			return this.$store.state.data;
		}
	},
	head () {
		return {
			title: this.getMetaTitle(),
			meta: [
				{ 
					hid: 'description', 
					name: 'description', 
					content: this.getMetaDesc()
				},
				{ 
					hid: 'keyword', 
					name: 'keyword', 
					content: this.getMetaKeywords()
				},
				{ 
					property: 'og:description', 
					content: this.getMetaDesc(),
					vmid: 'og:description'
				},
				{ 
					property: 'og:title', 
					content: this.getMetaTitle(),
					vmid: 'og:title'
				},
				{ 
					property: 'og:image', 
					content: this.getMetaImage(), 
					vmid: 'og:image'
				},
			]
		}
	},
	methods: {

		filtered( list, filters ) {
			if (!filters) filters = ['jpg', 'png', 'gif', 'svg', 'search_results', 'introduction', 'readme', 'index', '.ja', '.ko', '.zh_cn', '-ja', '-ko', '-zh_cn', 'src'];
			let out = [];

			if (!list) return out;

			list.forEach( id => {
				const l = Number.isInteger(id) ? {...this.data[id]} : id;
				if (l) {
					let fd = false;
					const n = (l.filename) ? l.filename.toLowerCase() : l.name.toLowerCase();
					for (let i = 0; i < filters.length; i++ ) if (n.indexOf( filters[i] ) !== -1) fd = true;
					if (!fd) out.push({...l});
				}

			} );
			return out;
		},
		breadcrumbs( entry ) {
			let b = [ {...entry} ];
			entry.breadcrumbs.forEach( id  => {
				if (this.data[id]) {
					b.push( { ...this.data[id]} );
				} else {
					console.error('❌ [Base.vue] breadcrumb not found:', id);
				}
			})
			b.reverse();
			return b;
		},
		stripHtml(html) {
			if (!html) return "";
			return html.replace(/<[^>]*>?/gm, '');
		},
		stripWhitespace(str) {
			if (!str) return "";
			return str.replace(/\s+/g,'');
		},
		getMetaTitle() {
			return "";
		},
		getMetaDesc() {
			return "";
		},
		getMetaImage() {
			return "";
		},
		getMetaKeywords() {
			return "";
		}
	},
	components: {

	},
	mounted() {
	}
}
</script>

<style>
</style>
	