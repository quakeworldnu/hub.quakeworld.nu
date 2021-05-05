/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: '/', static: true, resolve: false },
    'src/js': { url: '/assets/js' },
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
  ],
  packageOptions: {
    external: ['React', 'ReactDOM'],
  },
  devOptions: {
    open: 'none',
    port: 3000,
    output: 'stream',
  },
  buildOptions: {
    clean: false,
  },
};
