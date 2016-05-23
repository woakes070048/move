'use strict'

angular.module('lmisChromeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('consumption-home', {
        parent: 'root.index',
        url: '/consumption-home',
        templateUrl: 'views/consumption/index.html',
        controller: 'ConsumptionCtrl',
        controllerAS: 'cCtrl',
        resolve: {
          allConsumption: function (consumptionService) {
            return consumptionService.all()
              .catch(function () {
                return []
              })
          },
          appConfig: function (appConfigService) {
            return appConfigService.getCurrentAppConfig()
          }
        }
      })
      .state('consumption-form', {
        parent: 'root.index',
        url: '/consumption-form?_id',
        templateUrl: 'views/consumption/form.html',
        controller: 'ConsumptionFormCtrl',
        controllerAs: 'cfCtrl',
        resolve: {
          appConfig: function (appConfigService) {
            return appConfigService.getCurrentAppConfig()
          }
        }
      })
  })
