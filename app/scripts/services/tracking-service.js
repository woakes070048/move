'use strict';

angular.module('lmisChromeApp')
  .service('trackingService', function trackingService($log, $window, $rootScope, config, appConfigService) {
    var self = this;

    function registerListeners() {
      function trackView(event, state) {
        $window.analytics.trackView(state.name);
      }
      function trackStateNotFound(event, unfoundState, fromState) {
        $window.analytics.trackEvent(
          'stateNotFound', unfoundState.to, fromState
        );
      }
      $rootScope.$on('$stateChangeSuccess', trackView);
      $rootScope.$on('$stateNotFound', trackStateNotFound);
    }

    function setUserID() {
      function logAnonymously(error) {
        var msg = 'Could not get current app config. ' +
          'Proceeding to track anonymously.';
        $log.error(msg, error);
      }

      function setUUID(config) {
        if (!(config && config.uuid)) {
          return logAnonymously();
        }
        $window.analytics.setUserId(config.uuid);
      }

      appConfigService.getCurrentAppConfig()
        .then(setUUID)
        .catch(logAnonymously);
    }

    this.trackEvent = angular.noop;

    if ($window.analytics) {
      $window.analytics.startTrackerWithId(config.analytics.propertyID);
      registerListeners();
      setUserID();
      self.trackEvent = $window.analytics.trackEvent;
    }
  });
