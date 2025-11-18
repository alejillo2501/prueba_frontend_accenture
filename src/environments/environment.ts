// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyAKPjL6S0GmQLtVMSuvwNfTINfplBHn-qQ",
    authDomain: "ionic-todo-gemini.firebaseapp.com",
    projectId: "ionic-todo-gemini",
    storageBucket: "ionic-todo-gemini.firebasestorage.app",
    messagingSenderId: "884967654752",
    appId: "1:884967654752:web:8a5be8de1edce706d3ca05"
  },
  gemini: {
    apiKey: "AIzaSyDb9RR_TFjApkukd98VyP_6W0KtGtLT4J4",
    modelName: "gemini-2.5-pro"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
