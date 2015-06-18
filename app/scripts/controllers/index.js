'use strict';

angular.module('lmisChromeApp')
  .config(function($stateProvider) {
    $stateProvider.state('root', {
      url: '',
      abstract: true,
      templateUrl: 'views/index/index.html'
    })
      .state('root.index', {
        abstract: true,
        views: {
          'header': {
            templateUrl: 'views/index/header.html',
            controller: function($scope, $window, messages, appConfigService, deviceInfoFactory, backgroundSyncService) {

              $scope.states = {
                online: messages.online,
                offline: messages.offline
              };

              $scope.status = {
                label: deviceInfoFactory.isOnline() ? $scope.states.online : $scope.states.offline
              };

              var toggleOnline = function(event) {
                $window.addEventListener(event, function(e) {
                  $scope.status = {
                    label: $scope.states[e.type]
                  };
                  $scope.$digest();

                  //trigger background syncing
                  backgroundSyncService.startBackgroundSync()
                    .finally(function() {
                      console.log('updateAppConfigAndStartBackgroundSync  triggered on device connection ' +
                        'status change has been completed.');
                    });

                }, false);
              };

              for (var state in $scope.states) {
                toggleOnline(state);
              }
            }
          },
          'content': {},
          'footer': {
            templateUrl: 'views/index/footer.html',
            controller: function($scope, config) {
              $scope.year = new Date().getFullYear();
              $scope.version = config.version;
            }
          }
        }
      })
      .state('loadingFixture', {
        parent: 'root.index',
        templateUrl: 'views/index/loading-fixture-screen.html',
        url: '/loading-fixture',
      });
  });
