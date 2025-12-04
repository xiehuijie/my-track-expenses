import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fun.geek213.track_expenses',
  appName: 'My Track Expenses',
  webDir: 'dist',
};

// Enable live reload for development on device/emulator
// Set LIVE_RELOAD_SERVER environment variable to your local IP address
// Example: LIVE_RELOAD_SERVER=http://192.168.1.100:5173
if (process.env.LIVE_RELOAD_SERVER) {
  config.server = {
    url: process.env.LIVE_RELOAD_SERVER,
    cleartext: true,
  };
}

export default config;
