'use strict';

angular.module('lmisChromeApp').config(function($stateProvider) {
  $stateProvider.state('broadcastStockOut', {
    url: '/broadcast-stock-out',
    parent: 'root.index',
    templateUrl: 'views/stock-out-broadcast/stock-out-broadcast.html',
    controller: 'StockOutBroadcastCtrl',
    resolve: {
      appConfig: function(appConfigService) {
        return appConfigService.getCurrentAppConfig();
      },
      facilityStockListProductTypes: function(appConfigService) {
        return appConfigService.getProductTypes();
      }
    }
  })
    .state('multiStockOutBroadcast', {
      url: '/multiStockOutBroadcast?productList',
      parent: 'root.index',
      templateUrl: 'views/stock-out-broadcast/multi-stock-out-broadcast.html',
      resolve: {
        appConfig: function(appConfigService) {
          return appConfigService.getCurrentAppConfig();
        },
        facilityStockListProductTypes: function(appConfigService) {
          return appConfigService.getProductTypes();
        }
      },
      controller: 'MultiStockOutBroadcastCtrl'
    });
}).controller('MultiStockOutBroadcastCtrl',function($scope, appConfig, notificationService, $log, stockOutBroadcastFactory, $state, toastr, messages, facilityStockListProductTypes, $stateParams, inventoryRulesFactory, $q, alertFactory) {

    $scope.urlParams = ($stateParams.productList !== null) ? ($stateParams.productList).split(',') : $stateParams.productList;
    var stockOutProductTypes = facilityStockListProductTypes.filter(function(element) {
      return $scope.urlParams.indexOf(element.uuid) !== -1;
    });

    $scope.stockOutProductTypes = stockOutProductTypes;

    //used to hold stock out form data
    $scope.stockOutForm = {
      productType: stockOutProductTypes,
      facility: appConfig.facility,
      isSubmitted: false
    };

    $scope.isSaving = false;

    $scope.save = function() {

      $scope.isSaving = true;

      var saveAndBroadcastStockOut = function(productList) {
        var deferred = $q.defer();

        var addNextStockLevelAndSave = function(productList, index) {
          var nextIndex = index - 1;
          if (nextIndex >= 0) {
            var stockOut = {
              productType: productList[nextIndex],
              facility: $scope.stockOutForm.facility
            };
            stockOutBroadcastFactory.addStockLevelAndSave(stockOut)
              .then(function(result) {
                //broadcast in the background
                stockOutBroadcastFactory.broadcast(result);
                addNextStockLevelAndSave(productList, nextIndex);
              })
              .catch(function() {
                addNextStockLevelAndSave(productList, nextIndex)
              });
          } else {
            deferred.resolve(true);//
          }
          return deferred.promise;
        };

        addNextStockLevelAndSave(productList, productList.length)
          .then(function(result) {
            $scope.isSaving = false;
            alertFactory.success(messages.stockOutBroadcastSuccessMsg);
            $state.go('home.mainActivity');
          })
          .catch(function(reason) {
            toastr.error(messages.stockOutBroadcastFailedMsg);
            $log.error(reason);
          });
      };

      var title = [];
      for (var i = 0; i < stockOutProductTypes.length; i++) {
        title.push(stockOutProductTypes[i].code);
      }

      var confirmationTitle = title;
      var confirmationQuestion = messages.dialogConfirmationQuestion;
      var buttonLabels = [messages.yes, messages.no];

      notificationService.getConfirmDialog(confirmationTitle, confirmationQuestion, buttonLabels)
        .then(function(isConfirmed) {
          if (isConfirmed === true) {
            saveAndBroadcastStockOut(stockOutProductTypes);
          }
        })
        .catch(function(reason) {
          $scope.isSaving = false;
          $log.info(reason);
        });
    };

  }).controller('StockOutBroadcastCtrl', function($scope, appConfig, $log, stockOutBroadcastFactory, $state, toastr, alertFactory, $modal, messages, facilityStockListProductTypes, notificationService) {

    $scope.productTypes = facilityStockListProductTypes;
    //used to hold stock out form data
    $scope.stockOutForm = {
      productType: '',
      facility: appConfig.facility,
      isSubmitted: false
    };
    $scope.isSaving = false;

    $scope.save = function() {
      $scope.isSaving = true;
      var productType = JSON.parse($scope.stockOutForm.productType);
      var confirmationTitle = messages.confirmStockOutHeader(productType.code);
      var confirmationQuestion = messages.dialogConfirmationQuestion;
      var buttonLabels = [messages.yes, messages.no];

      var stockOut = {
        productType: productType,
        facility: $scope.stockOutForm.facility
      };

      notificationService.getConfirmDialog(confirmationTitle, confirmationQuestion, buttonLabels)
        .then(function(isConfirmed) {
          if (isConfirmed === true) {
            stockOutBroadcastFactory.addStockLevelAndSave(stockOut)
              .then(function(result) {
                if (typeof result !== 'undefined') {
                  alertFactory.success(messages.stockOutBroadcastSuccessMsg);
                  stockOutBroadcastFactory.broadcast(result)
                    .then(function(result) {
                      $log.info('stock-out broad-casted: ' + result);
                    }).catch(function(reason) {
                      console.error(reason);
                    })
                    .finally(function() {
                      $state.go('home.mainActivity');
                    });
                } else {
                  toastr.error(messages.stockOutBroadcastFailedMsg);
                  $scope.isSaving = false;
                }
              })
              .catch(function(reason) {
                toastr.error(messages.stockOutBroadcastFailedMsg);
                $scope.isSaving = false;
                $log.error(reason);
              });
          }
        })
        .catch(function(reason) {
          $scope.isSaving = false;
          $log.info(reason);
        });
    };
  });
