const { Nuxt } = require('nuxt-start')

// Require nuxt config
const config = require('./nuxt.config.js')
 
// Create a new nuxt instance (config needs dev: false)
let nuxt;
try {
	nuxt = new Nuxt( config )

} catch(err) {
	console.error('error creating Nuxt', err);
	return;
}
 
// Start nuxt.js server
const port = 3000;
console.log('Starting on port:', port);
try {

	nuxt.listen(port) // nuxt.listen(port, host)

} catch(err) {
	console.error('error starting Nuxt', err);
}
 
// Or use `nuxt.render` as an express middleware