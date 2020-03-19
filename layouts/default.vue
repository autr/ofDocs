<template lang="pug">
	#app( :class="{[$store.state.pageType]: true}")
		//- link( rel="icon" href="/favicon.ico" type="image/x-icon" )
		#menu
			h1.of
				.inner
					span: nuxt-link( to="/")
						//- img( src="/files/images/of-logo.svg" )
						.txt
							span.docs.f7.questrial ofDocs 
							span.version {{version.major}}.{{version.minor}}.{{version.patch}}
			#search
				.inner
					field( ref="search" v-bind.sync="search" @onChange="searchChange" )
						svg(viewbox='0 0 36 36' x='0px' y='0px'  enable-background='new 0 0 36 36' xml:space='preserve')
							path(d='M35.525,31.228l-8.88-8.882c1.444-2.238,2.298-4.895,2.298-7.752c0-7.909-6.438-14.343-14.346-14.343\
							c-7.911,0-14.343,6.434-14.343,14.343c0,7.911,6.433,14.344,14.343,14.344c2.856,0,5.513-0.849,7.752-2.294l8.88,8.88\
							c0.295,0.297,0.782,0.297,1.076,0l3.22-3.221C35.824,32.008,35.824,31.523,35.525,31.228z M4.81,14.593\
							c0-5.396,4.391-9.788,9.788-9.788c5.398,0,9.787,4.392,9.787,9.788c0,5.398-4.389,9.789-9.787,9.789\
							C9.2,24.382,4.81,19.991,4.81,14.593z')
						span.x(
							v-if="search.value.length > 0"
							@click="search.value = ''; searchResults = []"
						)
				#results.mt1( ref="searchResults" )
					.search-result(
						v-for=" s, i in searchResults"
						:tabindex="i+1"
						:key="i"
					)
						nuxt-link(:to="s.path")
							span.inner
								span.name {{s.name}}
								breadcrumbs( :entry="s" :last="false" :first="false" :links="false")
			#lists.menu-inner.mt1( v-if="searchResults.length === 0"): .inner
				list( 
					v-for="n, i in $store.state.navigation"
					:key="i"
					v-if="structure[n[0]]"
					:entry="structure[n[0]]"
					:depth="n[1]" 
					) {{n[0]}}
			//- #mini-footer
				//- a.pink(href="https://github.com/autr/ofdocs") Github
				//- a.pink(href="https://openframeworks.cc") openFrameworks
				//- span Last updated: {{ (new Date()).getFullYear() }}
		#document
			nuxt.main
</template>


<script>

import '~/assets/css/code.theme.css'
import Field from '~/components/Field.vue'
import List from '~/components/List.vue'
import Base from '~/components/Base.vue'
import Breadcrumbs from '~/components/_Breadcrumbs.vue'
export default {
	extends: Base,
	components: {
		Field,
		Breadcrumbs,
		'list': List
	},
	computed: {
	},
	data() {
			return {
				selected: [],
				search: {
					value: "",
					id: "search_field",
					type: "text",
					disabled: false,
					placeholder: "Search (Alt+F)",
					autocomplete: false,
					tabindex: 0
				},
				searchResults: [],
				searchIdx: -1
			}
	},
	methods: {
		searchChange() {
			let r = [];
			if (this.search.value.length < 2) {
				this.searchResults = [];
				return;
			}
			this.search.value.split(' ').forEach( s => {
				const l = s.toLowerCase();
				for (let i = 0; i < this.data.length; i++) {
					const n = this.data[i].name.toLowerCase();
					if ( n.indexOf(l) !== -1 && r.indexOf( this.data[i] ) === -1 && this.data[i].type !== 'asset') {
						r.push( {...this.data[i]} );
					}

				}
			});
			r.reverse();
			this.searchIdx = -1;
			this.searchResults = r;
		},
		toggle( n ) {
			const i = this.selected.indexOf( n );
			const s = this.isSelected( n );
			if (s) this.selected.splice(i,1);
			if (!s) this.selected.push( n );
		},
		select( n ) {
			const s = this.isSelected( n );
			if (s) this.selected = [];
			if (!s) this.selected = [n];
		},
		isSelected( n ) {
			return true;
			return (this.selected.indexOf( n ) !== -1) ;
		},
		onKeyPress( e ) {
			if (e.altKey && e.which === 402) {
				const i = this.$refs.search.$el.querySelector('input');
				e.preventDefault();
				e.stopPropagation();
				const isFocus = document.activeElement === i;
				if (!isFocus) {
					i.focus();
					i.select();
				}
				if (isFocus) {
					i.blur();
				}
			}
		},
		onKeyDown( e ) {

			if (this.searchResults.length > 0) {
				const arrDown = e.key === 'ArrowDown';
				const arrUp = e.key === 'ArrowUp';

				if (arrDown) this.searchIdx += 1;
				if (arrUp) this.searchIdx -= 1;

				if (arrDown || arrUp) {

					if (this.searchIdx >= this.searchResults.length) this.searchIdx = -1;
					if (this.searchIdx < 0) this.searchIdx = -1;

					const i = this.$refs.search.$el.querySelector('input');
					if (this.searchIdx == -1) {
						i.focus();
						i.select();
					} else {
						i.blur();
						setTimeout( () => {
							if (this.searchIdx == -1) this.searchIdx = 0;
							const r = this.$refs.searchResults.querySelectorAll('.search-result');
							r.item(this.searchIdx).querySelector('a').focus();
						},20);
					}

					e.preventDefault();
					e.stopPropagation();

				}


			}
		}
	},
	mounted() {

		document.addEventListener('keypress', this.onKeyPress);
		document.addEventListener('keydown', this.onKeyDown);

	}
}
</script>
