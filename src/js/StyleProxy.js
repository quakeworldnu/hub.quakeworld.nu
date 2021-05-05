const isDev = (import.meta.env.MODE === 'development');

if (isDev) {
  import('./../../public/assets/styles.css');
}
