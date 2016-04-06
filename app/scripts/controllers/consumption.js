'use strict'

angular.module('lmisChromeApp')
  .controller('ConsumptionCtrl', function (
    $state,
    consumptionService,
    allConsumption,
    appConfig,
    $scope
  ) {
    $scope.consumptionReport = allConsumption
    $scope.activeRow = {}
    $scope.products = appConfig.facility.selectedProductProfiles

    $scope.toggleDetail = function (report) {
      if (!$scope.activeRow.hasOwnProperty(report._id)) {
        $scope.activeRow = {}
      }
      $scope.activeRow[report._id] = !$scope.activeRow[report._id]
      $scope.consumptionData = consumptionService.loadProduct(report, allConsumption)
    }
  })
  .controller('ConsumptionFormCtrl', function (
    appConfig,
    $state,
    $stateParams,
    consumptionService
  ) {
    var vm = this
    var id = $stateParams._id
    vm.consumptionData = {}
    vm.products = appConfig.facility.selectedProductProfiles

    if (id) {
      consumptionService.get(id)
        .then(function (consumptionData) {
          vm.consumptionData = consumptionData || {}
          init()
        })
        .catch(function (reason) {
          console.log(reason)
        })
    } else {
      init()
    }

    vm.valueToUnit = function (product) {
      vm.consumptionData[product._id] = product.presentation.value * vm.enteredValues[product._id]
    }

    function init () {
      var defaultBuild = consumptionService.loadDefault(vm.products, vm.consumptionData)
      vm.consumptionData = defaultBuild.consumption
      vm.enteredValues = defaultBuild.entries
    }

    vm.save = function () {
      if (!consumptionService.isEmptyEntry(vm.consumptionData)) {
        consumptionService.save(vm.consumptionData)
          .then(function () {
            $state.go('consumption-home')
          })
          .catch(function (reason) {
            console.log(reason)
          })
      } else {
        $state.go('consumption-home')
      }
    }
  })