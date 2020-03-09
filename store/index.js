export const strict = false
import Manifest from '~/docs.manifest.json'

export const state = () => ({
	structure: Manifest.structure,
	data: Manifest.data,
	version: Manifest.version,
	meta: Manifest.meta,
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
	}
}

