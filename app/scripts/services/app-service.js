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
    storageService,
    config,
    LoginService
  ) {

    var self = this;

    self.getDeviceAppUser = function () {
      return storageService.getById(config.deviceUserId);
    };

    self.gotoLogin = function () {
      $state.go('login', {redirectTo: 'loadingFixture', onboarding: true});
    };

    function startApp () {
      $state.go('loadingFixture');

      self.getDeviceAppUser()
        .then(self.loadAppConfig)
        .catch(self.gotoLogin);
    }

    self.loadAppConfig = function () {
      console.info('Loading App config ....');
      //TODO: check if  app config exists on device
      // if it exists, trigger background sync and move to home page
      //  else take to config page

      // fetch from remote
      // return appConfigService.getCoreAppData()
      // .then()
    };

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

    function onLoginSuccess (event, data) {
      if (data && data.redirectTo === 'loadingFixture') {
        showSplashScreen();
        appConfigService.getStartUpData(data.username)
          .then(function(responseKey) {
            var docs = responseKey.coreData;
            var userInfo = responseKey.userInfo;
            userInfo.password = data.password;

            return appConfigService.saveAppUserProfile(userInfo)
              .then(function () {
                return appConfigService
              });
          }).catch(function (error) {
            console.info('Error : ', error);
          });
      }
    }

    this.init = function () {
      $rootScope.$on('START_LOADING', showSplashScreen)
      $rootScope.$on('LOADING_COMPLETED', hideSplashScreen)
      $rootScope.$on(LoginService.EVENT.LOGIN_SUCCESS, onLoginSuccess);
      startApp()
    };
  })
