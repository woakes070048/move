'use strict'

angular.module('lmisChromeApp', [
  'ui.bootstrap',
  'ui.router',
  'pouchdb',
  'config',
  'nvd3ChartDirectives',
  'toastr',
  'ngAnimate',
  'db',
  'gettext',
  'eha.retriable',
  'eha.login-service',
  'eha.online-badge',
  'eha.cordova.google-analytics',
  'eha.counter'
])
  .run(function (
    $window,
    $rootScope,
    appService
  ) {
    // FIXME: horrible quickfix to get the test suite running
    if ($window.jasmine) {
      return
    }
    appService.init()
  })
