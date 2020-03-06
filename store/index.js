export const strict = false
import Manifest from '~/docs.manifest.json'

export const state = () => ({
	meta: {
		title: 'OF'
	},
	structure: Manifest.structure,
	data: Manifest.data,
	version: Manifest.version,
	pages: {},
	pageType: "unknown",
	page: 'index'
})

export const getters = {
}

export const mutations = {
}	
export const actions = {
	nuxtServerInit ( {commit, state}, {$axios, env, route, redirect} ) {
		// console.log('INIT', route, redirect);

		// const w = route.path;
		// if (w.substring(w.length-1,w.length) === '/') {
		// 	console.log('REDIRECT');
		// 	redirect( w.substring(0,w.length-1));
		// }
	}
}

