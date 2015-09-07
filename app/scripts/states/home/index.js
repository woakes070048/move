'use strict'

angular.module('lmisChromeApp')
  .config(function ($urlRouterProvider, $stateProvider) {
    // Initial state
    $urlRouterProvider.otherwise('/loadingFixture')
    $stateProvider.state('home', {
      parent: 'root.index',
      templateUrl: 'views/home/index.html',
      resolve: {
        appConfig: function (appConfigService, fixtureLoaderService) {
          return fixtureLoaderService.loadLocalDatabasesIntoMemory(fixtureLoaderService.REMOTE_FIXTURES)
            .then(function () {
              return appConfigService.getCurrentAppConfig()
            })
        },
        isStockCountReminderDue: function (stockCountFactory, appConfig, $q) {
          if (angular.isObject(appConfig)) {
            return stockCountFactory.isStockCountDue(appConfig.facility.stockCountInterval, appConfig.facility.reminderDay)
          }
          return $q.when(false)
        }
      },
      controller: function (appConfig, $state, $scope, isStockCountReminderDue, $rootScope, reminderFactory, messages, ehaGoogleAnalytics) {
        if (typeof appConfig === 'undefined') {
          $state.go('appConfigWelcome')
        } else {
          ehaGoogleAnalytics.setUserId(appConfig.uuid)
          $scope.facility = appConfig.facility.name
          if (isStockCountReminderDue === true) {
            // FIXME: move stock count reminder object to a factory function, stock count?? or reminderFactory.
            reminderFactory.warning({
              id: reminderFactory.STOCK_COUNT_REMINDER_ID,
              text: messages.stockCountReminderMsg,
              link: 'stockCountForm',
              icon: 'views/reminder/partial/stock-count-icon.html'
            })
          } else {
            reminderFactory.remove(reminderFactory.STOCK_COUNT_REMINDER_ID)
          }
        }
      }
    })
  })
