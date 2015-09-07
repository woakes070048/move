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
  'eha.cordova.google-analytics'
])
  .run(function (storageService, facilityFactory, locationService, $rootScope, $state, $window, appConfigService, backgroundSyncService, fixtureLoaderService, toastr, utility) {
    function navigateToHome () {
      $state.go('home.mainActivity')
      backgroundSyncService.startBackgroundSync()
        .then(function () {
          console.log('updateAppConfigAndStartBackgroundSync triggered on start up has been completed!')
        })
        .catch(function (err) {
          console.log('updateAppConfigAndStartBackgroundSync triggered on start up failed', err)
        })
    }

    $window.showSplashScreen = function () {
      $state.go('loadingFixture')
    }

    $window.hideSplashScreen = function () {
      appConfigService.getCurrentAppConfig()
        .then(function (cfg) {
          if (angular.isObject(cfg) && !angular.isArray(cfg)) {
            $state.go('home.mainActivity')
          } else {
            $state.go('appConfigWelcome')
          }
        })
        .catch(function (reason) {
          toastr.error('loading of App. Config. failed, please contact support.')
          console.error(reason)
        })
    }

    $rootScope.$on('LOADING_COMPLETED', $window.hideSplashScreen)
    $rootScope.$on('START_LOADING', $window.showSplashScreen)

    // TODO: see item:680
    if (!utility.has($window, 'PouchDB')) {
      // Short-circuit as PouchDB has not been sourced. Likely running in test
      // environment.
      return
    }

    function loadAppConfig () {
      // TODO: figure out a better way of knowing if the app has been configured or not.
      $state.go('loadingFixture')
      storageService.all(storageService.APP_CONFIG)
        .then(function (res) {
          if (res.length > 0) {
            fixtureLoaderService.loadLocalDatabasesIntoMemory(fixtureLoaderService.REMOTE_FIXTURES)
              .then(function () {
                $rootScope.$emit('MEMORY_STORAGE_LOADED')
                navigateToHome()
              })
              .catch(function (reason) {
                console.error(reason)
                toastr.error('loading storage into memory failed, contact support.', {ttl: -1})
              })
          } else {
            var loadRemoteFixture = function () {
              return fixtureLoaderService.setupLocalAndMemoryStore(fixtureLoaderService.REMOTE_FIXTURES)
                .catch(function (reason) {
                  console.error(reason)
                  toastr.error('Local databases and memory storage setup failed, contact support.', {ttl: -1})
                })
            }
            storageService.clear()
              .then(loadRemoteFixture)
              .catch(function (error) {
                toastr.error('Fresh install setup failed, please contact support.', {ttl: -1})
                console.error(error)
              })
          }
        })
        .catch(function (error) {
          toastr.error('loading of App. Config. failed, please contact support.', {ttl: -1})
          console.error(error)
        })
    }

    // FIXME: horrible quickfix to get the test suite running
    if (!$window.jasmine) {
      loadAppConfig()
    }
  })
  .run(function (loginDialogService, ehaLoginService) {
    ehaLoginService.config(loginDialogService)
  })
