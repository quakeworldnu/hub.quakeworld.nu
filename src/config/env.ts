// environment variables (see .env.local.example), read in one place
export const env = {
  assetsCloudfrontUrl: import.meta.env.VITE_ASSETS_CLOUDFRONT_URL as string,
  demosCloudfrontUrl: import.meta.env.VITE_DEMOS_CLOUDFRONT_URL as string,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
};
