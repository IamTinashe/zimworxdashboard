
export default {
  mode: "universal",
  env: {
    //base: process.env.BASE_URL || "http://localhost:8080",
    base: process.env.BASE_URL || "https://zimworx.com/odoo",
    authCredentials: {
      username: "username",
      password: "password"
    }
  },

  ssr: false,
  head: {
    title: "ZimWorX Dashboard",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: process.env.npm_package_description || ""},
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.png" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css?family=Poppins:200,300,400,600,700,800"},
      { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css"},
      { rel: "stylesheet", href: "https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" },
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js' },
      { src: 'https://code.jquery.com/jquery-3.3.1.slim.min.js' },
      { src: 'https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js' },
      { hid: 'AmCharts', src: 'https://cdn.amcharts.com/lib/5/index.js', defer: true },
      { hid: 'AmCharts', src: 'https://cdn.amcharts.com/lib/5/map.js', defer: true },
      { hid: 'AmCharts', src: 'https://cdn.amcharts.com/lib/5/geodata/usaLow.js', defer: true },
      { hid: 'AmCharts', src: 'https://cdn.amcharts.com/lib/5/themes/Animated.js', defer: true }
    ],
    bodyAttrs: {
      class: "white-content", // Add `white-content` class here to enable "white" mode.
    },
  },
  router: {
    linkExactActiveClass: "active",
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [
    "assets/css/demo.css",
    "assets/css/nucleo-icons.css",
    "assets/sass/black-dashboard.scss",
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [`~/plugins/dashboard-plugin.js`],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/axios", "@nuxtjs/pwa", "nuxt-i18n"],
  i18n: {
    locales: [
      {
        code: "en",
        file: "en.js",
      },
      {
        code: "ar",
        file: "ar.js",
      },
    ],
    lazy: true,
    langDir: "lang/",
    defaultLocale: "en",
  },
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
    babel: {
      plugins: [
        [
          "component",
          {
            libraryName: "element-ui",
            styleLibraryName: "theme-chalk",
          },
        ],
      ],
    },
  },
};
