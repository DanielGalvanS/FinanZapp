import Constants from 'expo-constants';

// Environment configuration
// In Expo, env variables need to be accessed via Constants.expoConfig.extra
// For now, using hardcoded values that will be replaced with actual env vars

export const ENV = {
  SUPABASE_URL: Constants.expoConfig?.extra?.supabaseUrl || 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: Constants.expoConfig?.extra?.supabaseAnonKey || 'your-anon-key-here',
  API_BASE_URL: Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:8000',
  APP_ENV: Constants.expoConfig?.extra?.appEnv || 'development',
};

export const isDevelopment = ENV.APP_ENV === 'development';
export const isProduction = ENV.APP_ENV === 'production';
