// http://www.browsersync.io/docs/options/

module.exports = {
  ui: false,
  files: ["build/assets/**/*"],
  server: "build",
  open: false,
  reloadOnRestart: true,
  notify: false,
  reloadDelay: 0,
  reloadDebounce: 0,
  reloadThrottle: 0,
  plugins: [
    {
      module: "bs-html-injector",
      options: {
        files: "build/**/*.html",
      },
    },
  ],
  minify: false,
};
