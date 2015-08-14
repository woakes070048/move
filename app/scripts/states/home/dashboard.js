'use strict';

angular.module('lmisChromeApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('home.index.dashboard', {
        url: '/dashboard',
        templateUrl: 'views/home/dashboard.html',
        abstract: true,
        resolve: {
          settings: function(settingsService) {
            return settingsService.load();
          },
          aggregatedInventory: function($q, $log, appConfig, inventoryFactory, dashboardfactory, settings) {
            var currentFacility = appConfig.facility;
            var deferred = $q.defer();

            inventoryFactory.getFacilityInventory(currentFacility.uuid)
              .then(function(inventory) {
                var values = dashboardfactory.aggregateInventory(inventory, settings);
                deferred.resolve(values);
              })
              .catch(function(reason) {
                $log.error(reason);
              });

            return deferred.promise;
          }
        },
        controller: function($scope, settings, utility) {
          if (!utility.has(settings, 'inventory.products')) {
            $scope.productsUnset = true;
          }
        }
      })
      .state('home.index.dashboard.chart', {
        url: '',
        resolve: {
          keys: function(dashboardfactory) {
            return dashboardfactory.keys;
          }
        },
        views: {
          'chart': {
            templateUrl: 'views/home/dashboard/chart.html',
            controller: function($scope, $log, dashboardfactory, keys, aggregatedInventory) {
              $scope.inventoryChart = dashboardfactory.chart(keys, aggregatedInventory);

            }
          },
          'table': {
            templateUrl: 'views/home/dashboard/table.html',
            controller: function($scope, settings, aggregatedInventory) {
              var products = settings.inventory.products;

              // Get the service level for use in view
              var serviceLevel = 0;
              for (var i = aggregatedInventory.length - 1; i >= 0; i--) {
                serviceLevel = products[aggregatedInventory[i].label].serviceLevel;
                aggregatedInventory[i].serviceLevel = serviceLevel;
              }

              $scope.products = aggregatedInventory;
            }
          }
        }
      });
  });
