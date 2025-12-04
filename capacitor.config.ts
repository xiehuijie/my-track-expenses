import type { CapacitorConfig } from '@capacitor/cli';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables from .env file
dotenvConfig();

const config: CapacitorConfig = {
  appId: 'fun.geek213.track_expenses',
  appName: 'Track Expenses',
  webDir: 'dist',
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: false,
      iosKeychainPrefix: 'track-expenses-app',
      iosBiometric: {
        biometricAuth: false,
        biometricTitle: 'Biometric login for Track Expenses'
      },
      androidIsEncryption: false,
      androidBiometric: {
        biometricAuth: false,
        biometricTitle: 'Biometric login for Track Expenses',
        biometricSubTitle: 'Log in using your biometric'
      }
    }
  }
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
