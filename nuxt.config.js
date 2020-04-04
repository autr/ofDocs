module.exports = {
  debug: true,
  dev: false,
  vue: {
    config: {
      productionTip: true,
      devtools: true
    }
  },
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  },
  router: {
    extendRoutes (routes, resolve) {
      routes.push( {
        path: '/',
        name: 'homepage',
        component: resolve(__dirname, 'components/HomePage.vue')
      } );
      require('./docs.manifest.json').data.forEach( d => {
        let r = {
          path: d.path,
          name: d.path,
          component: resolve(__dirname, 'components/Page.vue')
        };
        if (d.type !== 'asset' ) {
          routes.push(r);
        }
      });
    }
  },
  head() {
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  buildDir: 'dist', // for SSR build
  generate: {
    static: true, // makes totally static
    dir: 'docs',
    subFolders: true,
    concurrency: 50,
    interval: 1,
    routes() {
      return require('./scripts/sitemap').payloads( './static' ).then( (routes) => {
        return routes;
      }).catch( err => {
        console.error(err);
      })
    } 
  },
  serverMiddleware: [
     __dirname + '/scripts/api.js' // file-server API
  ],
  plugins: [
    {
      ssr: false,
      src: '~/plugins/debounce.js'
    }
  ],
  buildModules: [
    '@nuxtjs/moment' // date formatting
  ],
  modules: [
    'cookie-universal-nuxt', // cookies
    '@nuxtjs/axios', // REST module
    'nuxt-material-design-icons-iconfont' // icons
  ],
  build: {
    extractCSS: process.env.NODE_ENV !== 'development',
    extend (config, { isDev, isClient }) {
      config.node = { fs:  'empty'}
    }
  },
  loading: { color: 'deeppink' },
  css: [
    '@/assets/css/main.sass'
  ]
}
