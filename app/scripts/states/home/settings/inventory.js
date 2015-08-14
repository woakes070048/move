'use strict';

angular.module('lmisChromeApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('home.index.settings.inventory', {
        url: '/inventory',
        templateUrl: 'views/home/settings/inventory.html',
        resolve: {
          products: function(appConfig, inventoryFactory) {
            var currentFacility = appConfig.facility;
            return inventoryFactory.getUniqueProducts(currentFacility.uuid);
          }
        },
        controller: function($scope, settings, products, utility) {
          var inventory = settings.inventory;

          // User hasn't made any settings
          if (!utility.has(inventory, 'products')) {
            inventory.products = {};
          }

          // Check if a product has been added since the settings were saved
          for (var code in products) {
            if (!utility.has(inventory.products, code)) {
              inventory.products[code] = products[code];
            }
          }
          $scope.inventory = inventory;
        }
      });
  });
