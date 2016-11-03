'use strict'

angular.module('lmisChromeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('root', {
        url: '',
        abstract: true,
        templateUrl: 'views/index/index.html'
      })
      .state('root.index', {
        abstract: true,
        views: {
          'header': {
            templateUrl: 'views/index/header.html',
            controller: function ($scope, $window, messages, appConfigService, deviceInfoFactory, backgroundSyncService) {
              function backgroundSync () {
                backgroundSyncService.startBackgroundSync()
                  .finally(function () {
                    console.log('updateAppConfigAndStartBackgroundSync  triggered on device connection ' +
                      'status change has been completed.')
                  })
              }
              $window.addEventListener('online', backgroundSync)
            }
          },
          'content': {},
          'footer': {
            templateUrl: 'views/index/footer.html',
            controller: function ($scope, config) {
              $scope.year = new Date().getFullYear()
              $scope.version = config.version
            }
          }
        }
      });
  })
