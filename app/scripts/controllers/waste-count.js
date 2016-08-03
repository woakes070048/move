'use strict'

angular.module('lmisChromeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('wasteCountHome', {
        parent: 'root.index',
        url: '/wasteCountHome',
        templateUrl: 'views/waste-count/waste-count.html',
        resolve: {
          appConfig: function (appConfigService) {
            return appConfigService.getCurrentAppConfig()
          },
          wasteCountList: function (wasteCountFactory) {
            return wasteCountFactory.get.allWasteCount()
          }
        },
        controller: 'wasteCountHomeCtrl'
      })
      .state('wasteCountForm', {
        parent: 'root.index',
        data: {
          label: 'Waste Count Form'
        },
        url: '/wasteCountForm2?facility&reportMonth&reportYear&reportDay&countDate',
        templateUrl: 'views/waste-count/waste-count-form2.html',
        controller: 'wasteCountFormCtrl',
        resolve: {
          appConfig: function (appConfigService) {
            return appConfigService.getCurrentAppConfig()
          }
        }
      })
  })
  .controller('wasteCountHomeCtrl', function ($scope, wasteCountFactory, wasteCountList, appConfig, $state, $filter) {
    $scope.wasteCountList = wasteCountList
    $scope.today = $filter('date')(new Date(), 'yyyy-MM-dd')
    $scope.facilityProducts = wasteCountFactory.get.productObject(appConfig.facility.selectedProductProfiles)
    $scope.takeAction = function (date) {
      wasteCountFactory.getWasteCountByDate(date).then(function (wasteCount) {
        if (wasteCount !== null) {
          $scope.wasteCount = wasteCount
          $scope.detailView = true
          $scope.wasteCountByType = wasteCountFactory.get.wasteCountByType(wasteCount, $scope.facilityProducts)
          if ($filter('date')(wasteCount.countDate, 'yyyy-MM-dd') === $scope.today) {
            $scope.editOn = true
          }
        } else {
          $state.go('wasteCountForm', {countDate: date})
        }
      })
    }

    $scope.getName = function (row) {
      return wasteCountFactory.get.productName(row, $scope.facilityProducts)
    }
  })
  /**
   * waste count form 2
   */
  .controller('wasteCountFormCtrl', function ($scope, wasteCountFactory, $state, toastr, $stateParams, appConfig,
    messages, syncService, alertFactory) {
    $scope.wasteCountModel = {}
    $scope.wasteCountModel.reason = {}
    $scope.uomSelect = 'Dose'

    var getCountDate = function () {
      return ($stateParams.countDate === null) ? new Date() : new Date($stateParams.countDate)
    }
    var initWasteCount = function (wasteCount) {
      if (wasteCount !== null && wasteCount !== undefined) {
        $scope.wasteCount = wasteCount
        if (wasteCount.discardedExtended === null || wasteCount.discardedExtended === undefined) {
          wasteCount.discardedExtended = {}
        }
      } else {
        $scope.wasteCount = {}
        $scope.wasteCount.facility = appConfig.facility.uuid
        $scope.wasteCount.reason = {}
        $scope.wasteCount.discarded = {}
        $scope.wasteCount.discardedExtended = {}
      }
    }

    var initReason = function () {
      $scope.wasteCountModel.discarded = {}
      $scope.wasteCountModel.discardedExtended = {}
      $scope.wasteCountModel.reason = {}
      $scope.wasteCountModel.reason[$scope.productKey] = {}
    }

    initWasteCount()
    $scope.wasteReasons = wasteCountFactory.wasteReasons
    $scope.facilityProducts = wasteCountFactory.get.productObject(appConfig.facility.selectedProductProfiles) // selected products for current facility

    wasteCountFactory.getWasteCountByDate(getCountDate())
      .then(function (wasteCount) {
        initWasteCount(wasteCount)
      })

    $scope.change = function () {
      if (angular.isDefined($scope.reasonQuantity)) {
        initReason()
        $scope.wasteCountModel.discardedExtended[$scope.productKey] = {'Count': $scope.reasonQuantity,'UoM': $scope.uomSelect}
        $scope.wasteCountModel.discarded[$scope.productKey] = $scope.reasonQuantity
        $scope.wasteCountModel.reason[$scope.productKey][$scope.selectedReason] = $scope.reasonQuantity
      }
    }

    $scope.loadSelected = function () {
      initReason()
      $scope.reasonQuantity = $scope.wasteCountModel.reason[$scope.productKey][$scope.selectedReason]
      $scope.enterQuantityLabel = messages.enterQuantity($scope.uomSelect + 's')
    }

    $scope.save = function (type) {
      $scope.isSaving = true
      $scope.wasteCount.discarded[$scope.productKey] = $scope.wasteCountModel.discarded[$scope.productKey]
      $scope.wasteCount.discardedExtended[$scope.productKey] = {}
      $scope.wasteCount.discardedExtended[$scope.productKey] = $scope.wasteCountModel.discardedExtended[$scope.productKey]
      if (angular.isUndefined($scope.wasteCount.reason[$scope.productKey])) {
        $scope.wasteCount.reason[$scope.productKey] = {}
      }
      $scope.wasteCount.reason[$scope.productKey][$scope.selectedReason] =
        $scope.wasteCountModel.reason[$scope.productKey][$scope.selectedReason]
      $scope.wasteCount.countDate = getCountDate()
      $scope.wasteCount.isComplete = 1
      wasteCountFactory.add($scope.wasteCount)
        .then(function (uuid) {
          $scope.wasteCount.uuid = uuid
          syncService.syncUpRecord(wasteCountFactory.DB_NAME, $scope.wasteCount)
            .finally(function () {
              $scope.isSaving = false
              alertFactory.success(messages.wasteCountSaved)
              $state.go('home.mainActivity')
            })
        })
        .catch(function (reason) {
          console.error(reason)
          toastr.error(reason)
        })
    }
  })
