import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hnc.blease',
  appName: 'b-lease',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      "launchShowDuration": 3000,
      "launchAutoHide": true,
      "androidScaleType": "CENTER_CROP",
      "splashImmersive": true,
      "backgroundColor": "#ffffff"
    },
    "GoogleAuth":{
      "scopes": ["profile","email"],
      "serverClientId":"919668649599-oa7s71u22b59ig8a9iontgjhv3aj45aq.apps.googleusercontent.com",
      "forceCodeForRefreshToken": true
    }
  },
};

export default config;


