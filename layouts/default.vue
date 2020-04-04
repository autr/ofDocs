<template lang="pug">
#app
	#menu
		.menu-inner
			#settings
			h1.of
				.inner
					span: nuxt-link( to="/")
						svg.logo( 
							version="1.1" 
							viewbox='0 0 110 58' 
							width="110px"
							height="58px"
							enable-background='0 0 110 58' 
							xml:space='preserve' )
							g( )
								path(d='M58,29 C58,13 45,0 29,0 C13,0 0,13 0,29 C0,45 13,58 29,58 C45,58 58,45 58,29 Z')
								rect(x='59' y='0' width='25' height='58')
								rect(x='85' y='26' width='15' height='15')
								path(d='M85,0 L110,0 L85,25 L85,0 Z')
						//- .gradient(
						//- 	:style="{background: gradient}"

						//- )
						//- svg.logo.clip( 
						//- 	version="1.1" 
						//- 	viewbox='0 0 110 58' 
						//- 	width="110px"
						//- 	height="58px"
						//- 	enable-background='0 0 110 58' 
						//- 	xml:space='preserve' )
						//- 	clipPath#clip( )
						//- 		path(d='M58,29 C58,13 45,0 29,0 C13,0 0,13 0,29 C0,45 13,58 29,58 C45,58 58,45 58,29 Z')
						//- 		rect(x='59' y='0' width='25' height='58')
						//- 		rect(x='85' y='26' width='15' height='15')
						//- 		path(d='M85,0 L110,0 L85,25 L85,0 Z')

						.txt
							span.docs.f7.questrial Docs 
							span.version {{version.major}}.{{version.minor}}.{{version.patch}}
			#search( :class="{resetting: newShortcut}" )
				.inner
					field( ref="search" v-bind.sync="search" @onChange="searchChange" )
						svg( @click="resetShortcut" viewbox='0 0 36 36' enable-background='new 0 0 36 36' xml:space='preserve')
							path(d='M35.525,31.228l-8.88-8.882c1.444-2.238,2.298-4.895,2.298-7.752c0-7.909-6.438-14.343-14.346-14.343\
							c-7.911,0-14.343,6.434-14.343,14.343c0,7.911,6.433,14.344,14.343,14.344c2.856,0,5.513-0.849,7.752-2.294l8.88,8.88\
							c0.295,0.297,0.782,0.297,1.076,0l3.22-3.221C35.824,32.008,35.824,31.523,35.525,31.228z M4.81,14.593\
							c0-5.396,4.391-9.788,9.788-9.788c5.398,0,9.787,4.392,9.787,9.788c0,5.398-4.389,9.789-9.787,9.789\
							C9.2,24.382,4.81,19.991,4.81,14.593z')
						span.x(
							v-if="search.value.length > 0"
							@click="search.value = ''; searchResults = []"
						)
				#results.mt1( ref="searchResults" v-if="resultsOrRecent.length > 0"  )
					.inner
						h4
							span.ptb1.block( v-show="searchResults.length > 0") Search results:
							span.ptb1.block( v-show="showRecent && searchResults.length == 0") Recently viewed:
					.search-result(
						v-for=" s, i in resultsOrRecent"
						v-if=" s "
						:tabindex="i+1"
						:key="i"
					)
						nuxt-link(:to="s.path")
							span.inner
								span.name.f3(v-html="s.name.replace(' (functions)','<span>functions</span>')")
								breadcrumbs( :entry="s" :last="false" :first="false" :links="false")
					.inner.ptb2
						.cdark.courier(v-if="resultsOrRecent.length === maxResults") 
							span Search limit reached: <= {{maxResults}}
			#lists.menu-inner.mt1.mb2( v-show="resultsOrRecent.length === 0" ): .inner
				list( 
					v-for="n, i in storeNavigation"
					:key="i"
					v-show="structure[n[0]]"
					:entry="structure[n[0]]"
					:depth="n[1]" 
					) {{n[0]}}
		.menu-bottom: .inner
			// wb_sunny / brightness_2
			button.button( @click="darkMode = !darkMode ")
				span( v-if="darkMode" )
					span.ico wb_sunny
				span( v-if="!darkMode" )
					span.ico nights_stay
				//- span Theme
			//- button.button Reset Shortcut
	#document
		nuxt.main(ref="view")
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
		shortcutString() {
			let str = "";
			this.searchShortcut.forEach( (s,i) => { 
				str += (i == 0) ? s : "+" + s 
			})
			return str;
		},
		resultsOrRecent() {
			const d = false;
				if (this.searchResults.length > 0 ) {
					if (d) console.log('results > recent...')
					return this.searchResults;
				} else if (this.showRecent) {
					if (d) console.log('recent > results...')
					return this.recentFromCookies.slice( 1, this.recentFromCookies.length ).map( id => {
						return this.$store.state.data[ id ];
					});
				} else {
					if (d) console.log('!recent && !results...')
					return [];
				}
		},
		gradient() {
			let a = this.c1;
			let b = this.c2;
			let c = this.cAngle;
			while (a > 360) a -= 360;
			while (b > 360) b -= 360;
			while (c > 360) c -= 360;
			while (a < 0) a += 360;
			while (b < 0) b += 360;
			while (c < 0) c += 360;
			return "linear-gradient(" + c + "deg, hsl(" + a + ",100%,70%), hsl(" + b + ",100%,80%) )"
		}
	},
	data() {
			return {
				recentFromCookies: [],
				darkMode: false,

				maxResults: 30,

				searchShortcut: [],
				clearShortcut: ['Meta','Shift','C'],

				newShortcut: false,
				showRecent: false,
				keys: {},


				c1: this.randomHue(),
				c2: this.randomHue(),
				cAngle: this.randomHue(),


				storeNavigation: null,
				search: {
					value: "",
					id: "search_field",
					type: "text",
					disabled: false,
					placeholder: "Search (Alt+F)",
					autocomplete: false,
					tabindex: 0
				},
				reassign: {
					value: "",
					id: "reassign_field",
					type: "text",
					disabled: false,
					placeholder: "Reassign search shortcut",
					autocomplete: false,
					tabindex: 0
				},
				searchResults: [],
				searchIdx: -1
			}
	},
	methods: {
    origin(a) {
    	try {
	      if (a.breadcrumbs.length <= 0) return "ofDocs";
	      return this.data[ a.breadcrumbs.slice(-1)[0] ].name;
			} catch(err) {
				console.log('[default.vue] origin');
			}
    },
		randomHue( a = 360 ) {
			return Math.round( Math.random() * a )
		},
		searchChange() {

			// --> searchChange

			try {

				const filters = this.$store.state.filters;
				let out = [];

				// too few chars...

				if (this.search.value.length < 4) {
					this.searchResults = [];
					return;
				}

				// split string...

				const components = this.search.value.split(' ');


				// search data...

				for (let i = 0; i < this.data.length; i++) {

					const entry = this.data[i];
					const path = this.data[i].path;
					const name = this.data[i].name;

					// weighting sorts...

					let foundPrimary = 0;
					let foundSecondary = 0;
					let weighting = 0;

					// doesnt already exist...

					const doesntAlreadyExist = out.indexOf( entry ) 

					// common filters...

					let isFiltered = false;
					filters.forEach( filter => {
						if ( name.indexOf(filter) !== -1 ) isFiltered = true;
					});

					// is can be processed...

					if (doesntAlreadyExist && !isFiltered ) {

						// parse search words...

						for (let i = 0; i < components.length; i++ ) {


							const word = components[i].toLowerCase();
							const idx = path.indexOf( word )
							const hasSecondary = idx !== -1;
							const hasPrimary = name.indexOf( word ) !== -1;

							if ( hasPrimary ) {
								console.log( name );
								foundPrimary += 1;
							}
							if ( hasSecondary ) {
								foundSecondary += 1;
								const weight = path.length - idx + word.length;
								if (weight > weighting) weighting = weight;
							}

						}
						if ( (foundPrimary > 0 || foundSecondary > 0 ) ) {
							let copy =	{...entry}
							copy.weight = weighting;
							copy.foundPrimary = foundPrimary;
							copy.foundSecondary = foundSecondary;
							out.push( copy );
						}

					}


				}
				out.sort( (a, b) => {
					const primary = a.foundPrimary - b.foundPrimary;
					const secondary = a.foundSecondary - b.foundSecondary;
					const weight = a.weighting < b.weighting;
					return (primary * 0.5) + (secondary * 0.25) + (weight * 0.25);
				});
				out.reverse();
				const max = this.maxResults;
				const end = ( out.length > max ) ? max : out.length;
				out = out.slice( 0, end );
				this.searchIdx = -1;
				this.searchResults = out;
			} catch(err) {
				console.log('[default.vue] error', err);
				throw err;
			}
		},
		processKey( e ) {

	    const opp = ['Meta','Alt','Control','Shift'];
	    const alpha = ["1","2","3","4","5","6","7","8","9","0","Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","Z","X","C","V","B","N","M"];

	    let k = e.code + "";
	    k = k.replace("Key","");
	    k = k.replace("Left","");
	    k = k.replace("Right","");

    	const inOperator = opp.indexOf( k ) !== -1;
    	const inAlpha = alpha.indexOf( k ) !== -1;

    	if (inAlpha) k = k.toUpperCase();

    	return k;
		},
		doFocus() {

		},

		isShortcut( shortcut_ ) {
			let b = true;
			shortcut_.forEach( key => {
				if ( !this.keys[key] ) b = false;
			});
			return b;

		},
		onKeyPress( e ) {

		},
		resetShortcut() {
			console.log('resetting shortcut...')
			this.searchShortcut = [];
			this.search.placeholder = "Listening..."
			this.newShortcut = true;
		},
		setDarkMode() {
			const html = document.querySelector('html');
			if (html) {
				if (this.darkMode) html.classList.add('dark-mode');
				if (!this.darkMode) html.classList.remove('dark-mode');
			}

			this.$cookies.set("OFDOCS_DARKMODE", this.darkMode );
		},
		onKeyUp( e ) {
			this.keys[ this.processKey(e) ] = false;
		},
		onKeyDown( e ) {

		    const opp = ['Meta','Alt','Control','Shift'];
		    const alpha = ["1","2","3","4","5","6","7","8","9","0","Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","Z","X","C","V","B","N","M"];

		    const key = this.processKey(e);
				this.keys[ key ] = true;

				// create new shortcut...

		    if (this.newShortcut) {
		    	const inOperator = opp.indexOf( key ) !== -1;
		    	const inAlpha = alpha.indexOf( key ) !== -1;
		    	const notDuplicate = this.searchShortcut.indexOf( key ) === -1;
		    	if ( (inOperator || inAlpha )&&notDuplicate) {
		    		this.searchShortcut.push( key );
		    		this.search.placeholder = "Listening... " + this.shortcutString;
		    		if (inAlpha) {
		    			this.newShortcut = false;
			    		this.search.placeholder = "Search (" + this.shortcutString + ")";
			    		this.$cookies.set("OFDOCS_SHORTCUT", JSON.stringify( this.searchShortcut ) );
			    		this.keys[ key ] = false;
		    		}
		    	}
		    }

			// console.log( "PRESS", JSON.stringify( this.keys ) )

			const isSearchShortcut = this.isShortcut( this.searchShortcut );
			const isClearCookies = this.isShortcut( this.clearShortcut );

			if ( isClearCookies ) {
				this.$cookies.removeAll();
				console.log('🍪  [ofDocs] cookies removed...', JSON.stringify( this.$cookies.getAll() ) );
			}


			if ( isSearchShortcut ) {
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


		    // search results....

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
		},
		addPageToCookies() {
				const id = this.$store.state.id;
				try {
					console.log('🍪  [ofDocs] adding page to cookies...', this.$store.state.data[id].name );
				} catch(err) {
					console.error( '🍪  [ofDocs] could not add id to cookies...', id );
				}
				let r = this.$cookies.get("OFDOCS_RECENT")
				if (!Array.isArray( r)) r = [];
				while (r.length > this.maxResults) r.pop();

				const found = r.indexOf( id );

				if ( found !== -1) {
					r.splice( found, 1);
					r.unshift( id );
					return;
				} else {
					r.unshift( id );
				}

				this.$cookies.set("OFDOCS_RECENT", r);
				this.recentFromCookies = r;
		}
	},
	watch: {
		'darkMode': {
			handler: function(to,from,eh) {
				this.setDarkMode();
			}
		},
		'$route': {
			handler: function(to,from) {
				setTimeout( () => {
					this.addPageToCookies();
				},200);
			}
		}
	},
	created() {

	},
	mounted() {

		// search events...

		document.addEventListener('keypress', this.onKeyPress);
		document.addEventListener('keydown', this.onKeyDown);
		document.addEventListener('keyup', this.onKeyUp);

		const input = this.$refs.search.$el.querySelector('input');
		input.addEventListener('focus', () => {
			// console.log('FOCUS');
			this.showRecent = true;
		});
		input.addEventListener('blur', () => {
			// console.log('BLUR');
			setTimeout( () => {
				this.showRecent = false;
			}, 100);
		});

		// print all cookies...

		console.log('🍪  [ofDocs] cookies loaded...', JSON.stringify( this.$cookies.getAll() ) );

		// search cookies...

		const cs = this.$cookies.get("OFDOCS_SHORTCUT");
		this.searchShortcut = (cs) ? cs : ["Alt", "F"];
		console.log( this.searchShortcut );
		this.search.placeholder = "Search (" + this.shortcutString + ")";

		// navigation...


		this.storeNavigation = this.$store.state.navigation;


		// nav cookies...

		this.recentFromCookies = this.$cookies.get("OFDOCS_RECENT") || [];

		this.addPageToCookies();
		


		this.darkMode = this.$cookies.get("OFDOCS_DARKMODE");
		this.setDarkMode();


		// const tween = ({ from = 0, to = 1, duration = 300, ease = easeOut, onUpdate } = {}) => {
		// 	const delta = to - from;
		// 	const startTime = performance.now();

		// 	function update(currentTime) {
		// 		const elapsed = currentTime - startTime;
		// 		const progress = Math.min(elapsed / duration, 1);
		// 		const latest = from + ease(progress) * delta;

		// 		if (onUpdate) onUpdate(latest);
		// 		if (progress < 1) requestAnimationFrame(update);
		// 	}

		// 	requestAnimationFrame(update);
		// }

		// const easeOut = (progress, power = 2) => {
		// 	return 1 - (1 - progress) ** power;
		// }
		// this.$nextTick( () => {

		// 	if (typeof this.$nuxt.$loading.$watch === 'function') {


		// 		this.$nuxt.$loading.$watch( 'percent', (to,from) => {
		// 			if (from === 100) {

		// 					const s = 400;
		// 					let a = this.c1 + this.randomHue(90);
		// 					let b = this.c1 + this.randomHue(180);
		// 					let c = this.cAngle + this.randomHue(45);
		// 					tween( { from: this.c1, to: a, duration: s, onUpdate: v => { this.c1 = v } });
		// 					tween( { from: this.c2, to: b, duration: s, onUpdate: v => { this.c2 = v } });
		// 					tween( { from: this.cAngle, to: c, duration: s, onUpdate: v => { this.cAngle = v } });
		// 			}
		// 		});
		// 	}
		// });


	}
}
</script>
