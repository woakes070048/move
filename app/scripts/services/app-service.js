'use strict'

angular.module('lmisChromeApp')
  .service('appService', function (
    $log,
    $rootScope,
    $state,
    toastr,
    appConfigService,
    fixtureLoaderService,
    backgroundSyncService,
    storageService
  ) {
    function loadAppConfig () {
      function handleError (message, error) {
        // TODO: make these strings translatable
        message += '. Please contact support.'
        var options = {
          timeOut: 0
        }
        toastr.error(message, options)
        $log.error(error)
      }

      function loadRemoteFixture () {
        var errorMessage = 'Local databases and memory storage setup failed'
        return fixtureLoaderService
          .setupLocalAndMemoryStore(fixtureLoaderService.REMOTE_FIXTURES)
          .catch(handleError.bind(null, errorMessage))
      }

      function fetchRemoteConfig () {
        var errorMessage = 'Fresh install setup failed'
        return storageService.clear()
          .then(loadRemoteFixture)
          .catch(handleError.bind(null, errorMessage))
      }

      function goHomeAndSync () {
        var prefix = 'updateAppConfigAndStartBackgroundSync triggered on start up'
        $rootScope.$emit('MEMORY_STORAGE_LOADED')
        $state.go('home.mainActivity')
        backgroundSyncService.startBackgroundSync()
          .then($log.info.bind($log, prefix + ' has completed'))
          .catch($log.error.bind($log, prefix + ' failed'))
      }

      function primeMemoryStore () {
        var errorMessage = 'Loading storage into memory failed'
        fixtureLoaderService
          .loadLocalDatabasesIntoMemory(fixtureLoaderService.REMOTE_FIXTURES)
          .then(goHomeAndSync)
          .catch(handleError.bind(null, errorMessage))
      }

      function loadConfig (res) {
        if (!res.length) {
          fetchRemoteConfig()
          return
        }
        primeMemoryStore()
      }

      $state.go('loadingFixture')

      // TODO: figure out a better way of knowing if the app has been configured
      // or not.
      storageService.all(storageService.APP_CONFIG)
        .then(loadConfig)
        .catch(handleError.bind(null, 'Loading app-config failed'))
    }

    function showSplashScreen () {
      $state.go('loadingFixture')
    }

    function hideSplashScreen () {
      function redirect (cfg) {
        if (angular.isObject(cfg) && !angular.isArray(cfg)) {
          $state.go('home.mainActivity')
        } else {
          $state.go('appConfigWelcome')
        }
      }

      function handleError (error) {
        toastr.error('Loading of app config failed, please contact support.')
        $log.error(error)
      }

      appConfigService.getCurrentAppConfig()
        .then(redirect)
        .catch(handleError)
    }

    this.init = function () {
      $rootScope.$on('START_LOADING', showSplashScreen)
      $rootScope.$on('LOADING_COMPLETED', hideSplashScreen)
      loadAppConfig()
    }
  })
