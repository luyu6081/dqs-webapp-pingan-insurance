import path from 'path'
// import dotenv from 'dotenv'

// if (process.env.NODE_ENV === 'development') {
//   dotenv.config({path: path.join(__dirname, '.env.local')})
//   dotenv.config({path: path.join(__dirname, '.env.development')})
// }

export default {
  srcDir: 'client/',
  mode: 'spa',
  head: {
    title: '数据质量',
    meta: [
      {charset: 'utf-8'},
      {httpEquiv: 'X-UA-Compatible', content: 'IE=edge'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
    ],
    link: [
      {rel: 'icon', type: 'image/png', href: '/favicon.png'},
    ],
  },
  loading: {color: '#fff'},
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '~/style/common.scss',
  ],
  router: {
    // middleware: ['auth'],
  },
  plugins: [
    '~/plugins/polyfill',
    '~/plugins/element-ui',
  ],
  buildModules: [
    '@nuxtjs/eslint-module',
  ],
  modules: [
    '@nuxtjs/router',
    '@ej/app-nuxt-module',
    '~/modules/runtime-args',
  ],
  generate: {
    routes: [
      '/',
    ],
  },
  apollo: {
    clientConfigs: {
      default: '~/plugins/client-config-default.js', // '~/schema',
      ucClient: '~/plugins/client-config-auth.js',
      apolloUserClient: '~/plugins/client-config-default.js',
    },
  },
  serverMiddleware: [
    {
      path: '/runtime-args.json',
      handler (req, res, next) {
        res.end(JSON.stringify(require('./runtime-args.dev')))
      },
    },
  ],
  build: {
    postcss: {
      plugins: {
        tailwindcss: './tailwind.config.js',
        'postcss-easings': {},
        autoprefixer: {},
      },
    },
    transpile: [
      /^element-ui/,
      /^@ej\//,
    ],
    extend (config, {isDev}) {
      config.devtool = isDev ? 'cheap-module-eval-source-map' : false
    },
  },
}
