'use strict'

angular.module('lmisChromeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('appConfig.wizard', {
        url: '/app-config-wizard',
        parent: 'root.index',
        templateUrl: 'views/app-config/wizard.html',
        resolve: {
          appConfig: function (appConfigService, ehaLoginService, toastr, messages) {
            // From the wizard screen, try to load the template for the user,
            // if found, the 'email' step is skipped,
            // if not found, the user gets to fill in email address
            return ehaLoginService.getUserName()
              .then(function (userName) {
                return appConfigService.getAppFacilityProfileByEmail(userName)
                  .then(function (facility) {
                    // return a doc w/ email as user,
                    // and facility
                    return {
                      preloaded: true,
                      uuid: userName,
                      facility: facility
                    }
                  })
              })
              .catch(function (err) {
                switch (err.status) {
                  case 404:
                    return {
                      preloaded: false,
                      uuid: '',
                      facility: { },
                      contactPerson: {
                        name: '',
                        phoneNo: ''
                      },
                      selectedCcuProfiles: [],
                      dateActivated: undefined
                    }
                  case 0: // offline
                    return toastr.error(messages.offline)
                  default:
                    return toastr.error(err.message)
                }
              })
          },
          ccuProfilesGroupedByCategory: function (ccuProfileFactory) {
            return ccuProfileFactory.getAllGroupedByCategory()
          },
          productProfilesGroupedByCategory: function (productProfileFactory) {
            return productProfileFactory.getAllGroupedByCategory()
          },
          zones: function (locationService) {
            // KANO_UUID could be exchanged for a url parameter
            // when we want to support other zones
            return locationService.getZones(locationService.KANO_UUID)
          },
          lgaList: function (locationService) {
            return locationService.getLgas(locationService.KANO_UUID)
          },
          isEdit: function () {
            return false
          }
        },
        controller: 'AppConfigWizard'
      })
  })
