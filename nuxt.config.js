const data = require('./docs.manifest.json').data;
const sitemap = require('./scripts/sitemap');
export default {
  debug: true,
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
    trailingSlash: true,
    extendRoutes (routes, resolve) {
      routes.push({
        path: '/',
        name: 'Home',
        component: resolve(__dirname, 'components/Page.vue')
      });
      data.forEach( d => {
        let r = {
          path: d.path,
          name: d.path,
          component: resolve(__dirname, 'components/Page.vue')
        };
        if (d.type !== 'asset' ) routes.push(r);
      });
    }
  },
  buildDir: 'dist', // for SSR build
  generate: {
    static: true, // makes totally static
    dir: 'docs',
    subFolders: true,
    concurrency: 50,
    interval: 0,
    routes() {
      return sitemap.payloads( './static' ).then( (routes) => {
        return routes;
      }).catch( err => {
        console.error(err);
      })
    } 
  },
  serverMiddleware: [
    '~/scripts/api.js' // file-server API
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
