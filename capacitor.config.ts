import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nuru.sanctuary',
  appName: 'Nuru',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
