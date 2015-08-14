'use strict';

angular.module('lmisChromeApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('appConfigWelcome', {
        url: '/app-config-welcome',
        parent: 'root.index',
        templateUrl: 'views/app-config/welcome-page.html',
        resolve: {
          config: function(ehaLoginService, appConfigService) {
            // From the welcome screen, we try to load an existing app config
            // if you have set up your facility already, you get taken to the
            // main screen.
            //
            // This function in the login service shows the login screen
            // if no credentials are stored
            return ehaLoginService.maybeShowLoginUi()
              .then(function() {
                return ehaLoginService.getUserName();
              })
              .then(function(userName) {
                return appConfigService.loadRemoteConfig(userName);
              })
              .catch(function() {
                return { notFound: true };
              });
          }
        },
        controller: function($scope, config, $state, fixtureLoaderService, messages, locationService, appConfigService, growl) {
          // Found config, we're good to go
          if(config.notFound !== true) {
            if(config.facility && angular.isArray(config.facility.selectedLgas)) {
              var nearbyLgaIds = locationService.extractIds(config.facility.selectedLgas);
              fixtureLoaderService.setupWardsAndFacilitesByLgas(nearbyLgaIds)
                  .catch(function(){
                    growl.error(messages.lgaFacilityListFailed);
                  })
                  .finally(function(){
                    $state.go('home.mainActivity');
                  });
            }
          }
        }
      });
  });
