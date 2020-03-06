<template lang="pug">
	#app( :class="{[$store.state.pageType]: true}")
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
					v-for="n, i in navigation"
					:key="i"
					v-if="structure[n[0]]"
					:entry="structure[n[0]]"
					:depth="n[1]" 
					) {{n[0]}}

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
				navigation: [ 
					['documentation', 4], 
					['examples', 3], 
					['openFrameworks', 3], 
					['addons', 3], 
					['guides', 2]
				],
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

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Questrial&display=swap')
@import '@/assets/css/theme'
@import '@/assets/css/_utils' 
#app

	.langs
		> span
			// border-left: 1px solid mono(70)
			margin-left: 0px
			padding-left: 10px
			&:first-child
				border-left: none
				margin-left: 0px
	$sx: 20px
	.x 
	    height: $sx
	    width: $sx
	    background-color: #FA6900
	    border-radius: 5px
	    position: relative
	

	.x:after 
	    position: absolute
	    top: 0
	    bottom: 0
	    left: 0
	    right: 0
	    content: "\d7" /* use the hex value here... */
	    font-size: $sx
	    color: #FFF
	    line-height: $sx
	    text-align: center
	


	$cpadd: 40px
	.columns
		display: flex
		flex-wrap: wrap
		width: calc( 100% + 40px)
		margin-left: -20px
		.column
			padding: 0px 20px
			flex-grow: 0
			flex-shrink: 0
			// flex-basis: 25%
			flex-basis: 320px
			display: flex
			align-items: left
			justify-content: left
			word-break: break-all
			word-wrap: break-word


	*
		outline-color: $pink
	#menu
		background: #f3f3f3
		h1 a
			font-weight: normal
			color: mono(10)
		.item
			position: relative
			display: block
			padding: 0em 0em
			padding-left: 20px
			overflow: hidden
			&:before
				content: ""
				height: 100%
				width: 1px
				background: mono(80)
				position: absolute
				left: 5px
				top: 2em
			> a
				position: relative
				padding: 0em
				left: -20px
				&.nuxt-link-exact-active
					color: mono(10)
				// color: $pink
				&.back
					position: absolute
					top: 0
					left: 0
					width: 100%
					display: none
					&.active
						display: block
			.list
				// transition: max-height 0.5s ease
				max-height: 0vh
				overflow: hidden
		.nuxt-link-active + .list
			max-height: 300vh
		.menu-inner > .item
			padding-left: 0px
			border-left: none

#app .pink
	color: $pink
::selection
	color: white
	background: lighten($pink,8)



$ml: 300px
$fl: 200px
.inner
	padding: 0px 20px
#app

	.version
		font-family: Courier, serif;
	#search
		.search-result
			border-bottom: 1px solid mono(90)
			display: block
			&.active
				background-color: mono(80)
			.inner
				display: block
			> a
				padding: 15px 0px 
				display: block
				&:focus, &.nuxt-link-exact-active
					background: mono(90)
					// border: 1px solid $pink
				&.nuxt-link-exact-active
					.name 
						font-weight: bold
					.breadcrumbs .crumb .link
						// color: mono(10)
			.name
				color: mono(10)
				// font-size: $baseText + 2px
			.breadcrumbs
				font-family: Courier, serif
				display: block
				position: relative
				&:before
					content: ""
					@include fill()
				a, a:hover, *
					color: mono(60)
					font-size: $baseText
				.crumb
					&:first-child
						// span.link
						// 	color: mono(100)
						// 	background: mono(60)
						// 	padding: 0em 0.4em
						// 	padding-right: 0em
						// 	margin-right: 0.4em
							// color: $pink
					.chevron
						margin: 0px
						margin-right: 0px
						left: -4px
						top: 1px
						position: relative
						&:before
							transform: rotate(45deg) scale(0.75)
						// display: none
		.field-inner
			position: relative
			.x
				position: absolute
				top: 11px
				cursor: pointer
				right: 10px
				background: transparent
				&:after
					color: mono(20)
			svg
				position: absolute
				top: 15px
				left: 15px
				transform: scale(0.4)
				transform-origin: 0 0
				width: 36px
				path
					fill: mono(70)
			.text-wrapper 
				border-radius: 0px
				border-color: mono(90)
				background: mono(100)
				input
					padding-left: 40px
					&:focus
						box-shadow: 0px 0px 2px 1px $pink


	#menu, #functions
		position: fixed
		top: 0
		height: 100%
		overflow: auto
		border-right: 1px solid #eee
		#lists
			.item
				a
					font-weight: normal
					display: block
					margin: 0
					padding: 0.2em 0em
					&:hover
						// background: #eee
			a.nuxt-link-active
				font-weight: bold
				color: mono(10)
				position: relative
				&:before
					content: ""
					$ss: 3px
					width: $ss
					height: $ss
					border-radius: $ss
					background-color: $pink
					position: absolute
					left: -10px - ($ss/2) + 5px
					top: calc( 50% - #{$ss/2})
	#menu
		transition: transform 0.4s ease
		width: $ml
		left: 0 
	#functions
		width: $fl
		left: $ml
	#document
		margin-left: $ml
		.inner
			padding: 0px 60px

#app 
	.questrial
		font-family: Questrial, sans-serif
		font-weight: normal
	&.documentation
		#menu
			// transform: translate( -$ml, 0px)
</style>

