// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  mapbox:{
    accessToken: 'pk.eyJ1IjoiaGFja25jb2RlMjAyMyIsImEiOiJjbGZiYTRrdG0ybXVrM3NwcWl1dGE2Y2Q4In0.7x9X9Nlb6WYocUO6WrUA1A'
  },

  // API URL and SOCKET_API_URL defined here
  //Change this if you change your server network
  API_URL: 'http://192.168.66.240:5000/',
  
  SOCKET_API_URL: 'http://192.168.66.240:5001',


  //This is the template for greeting message when Lessees inquire properties
  greeting_message: "Hi there! I came across your property listing and I'm interested in learning more about it",

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
