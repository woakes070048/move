'use strict'

angular.module('lmisChromeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('appConfig.edit', {
        url: '/edit-app-config',
        parent: 'root.index',
        templateUrl: 'views/app-config/edit-configuration.html',
        resolve: {
          appConfig: function (appConfigService) {
            return appConfigService.getCurrentAppConfig()
          },
          ccuProfilesGroupedByCategory: function (ccuProfileFactory) {
            return ccuProfileFactory.getAllGroupedByCategory()
          },
          productProfilesGroupedByCategory: function (productProfileFactory) {
            return productProfileFactory.getAllGroupedByCategory()
          },
          zones: function (locationService) {
            return locationService.getZones(locationService.KANO_UUID)
          },
          lgaList: function (locationService) {
            return locationService.getLgas(locationService.KANO_UUID)
          },
          isEdit: function () {
            return true
          }
        },
        controller: 'AppConfigWizard'
      })
  })
