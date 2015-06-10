'use strict';

function bootAngular() {
  angular.bootstrap(document, [
    'lmisChromeApp'
  ]);
}

if (window.cordova) {
  document.addEventListener('deviceready', bootAngular, false);
} else {
  bootAngular();
}
