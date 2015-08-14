'use strict';

angular.module('lmisChromeApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('home.mainActivity', {
        url: '/main-activity',
        views: {
          'activities': {
            templateUrl: 'views/home/main-activity.html',
            controller: function($stateParams, messages, growl, alertFactory, $scope) {

              var alertQueue = alertFactory.getAll();
              for (var i in alertQueue) {
                var alert = alertQueue[i];
                growl.success(alert.msg);
                alertFactory.remove(alert.id);
              }

              $scope.openMain = true;

            }
          },
          'charts': {
            templateUrl: 'views/home/partials/stock-level-chart.html',
            resolve: {
              stockOutList: function(stockOutBroadcastFactory) {
                return stockOutBroadcastFactory.getAll();
              },
              mostRecentCount: function(stockCountFactory){
                return stockCountFactory.getLatestCompleteStockCount();
              }
            },
            controller: function($q, $log, mostRecentCount, productProfileFactory, $scope, $window, messages, storageService, dashboardfactory, inventoryRulesFactory, productTypeFactory, appConfig, appConfigService, cacheService, stockOutList, utility, $rootScope, isStockCountReminderDue, stockCountFactory, wasteCountFactory) {

              var keys = [
                {
                  key: 'stockBelowReorder',
                  label: messages.stockBelow,
                  color: '#ff7518'
                },
                {
                  key: 'stockAboveReorder',
                  label: messages.stockAbove,
                  color: '#666666'
                }
              ];

              var getProductTypeCounts = function($q, $log, inventoryRulesFactory, productTypeFactory, appConfig, appConfigService) {

                if (typeof appConfig === 'undefined') {
                  var productTypeInfo = {};
                  return $q.when(productTypeInfo);
                }

                var collateProductTypeInfo = function(productType, facility) {
                  var stockLevelPromise = inventoryRulesFactory.getStockLevel(facility, productType.uuid);
                  var bufferStockPromise = inventoryRulesFactory.bufferStock(facility, productType.uuid);
                  var stockLevel = 'stockLevel';
                  var bufferStock = 'bufferStock';
                  var promises = {
                    stockLevel: stockLevelPromise,
                    bufferStock: bufferStockPromise
                  };
                  return $q.all(promises)
                    .then(function(res) {
                      return {
                        name: productType.code,
                        stockLevel: res[stockLevel],
                        bufferStock: res[bufferStock]
                      };
                    });
                };

                function getProductTypesInfo(productTypes, facility) {
                  var promises = {};
                  for (var i in productTypes) {
                    var productType = productTypes[i];
                    promises[productType.uuid] = collateProductTypeInfo(productType, facility);
                  }
                  return $q.all(promises)
                    .then(function(res) {
                      return $q.all([
                        inventoryRulesFactory.getStockBalance(facility.uuid, mostRecentCount.modified),
                        wasteCountFactory.getWastedStockLevel(
                          appConfig.facility.selectedProductProfiles,
                          mostRecentCount.modified
                        )
                      ])
                        .then(function(response) {
                          var pTypesLedgerBal = response[0];
                          var wasted = response[1];

                          var ledgerBal = 0;
                          for (var ptUuid in res) {
                            if (wasted[ptUuid]) {
                              res[ptUuid].stockLevel -= wasted[ptUuid];
                            }
                            if (!isNaN(pTypesLedgerBal[ptUuid])) {
                              ledgerBal = pTypesLedgerBal[ptUuid];
                              res[ptUuid].stockLevel += ledgerBal;
                            }
                          }
                          return res;
                        })
                        .catch(function() {
                          return res;
                        });
                    });
                }

                var currentFacility = appConfig.facility;
                return appConfigService.getProductTypes()
                  .then(function(res) {
                    return getProductTypesInfo(res, currentFacility);
                  });
              };

              $scope.showChart = !isStockCountReminderDue;
              if ($scope.showChart) {
                getProductTypeCounts($q, $log, inventoryRulesFactory, productTypeFactory, appConfig, appConfigService)
                  .then(function(productTypeCounts) {
                    var values = [], product = {}, stockOutWarning = [];

                    var filterStockCountWithNoStockOutRef = function(stockOutList, uuid) {
                      return stockOutList.filter(function(element) {
                        var dayTest = function() {
                          var createdTime = new Date(element.created).getTime();
                          var stockCountDueDate = stockCountFactory.getStockCountDueDate(appConfig.facility.stockCountInterval, appConfig.facility.reminderDay);
                          return stockCountDueDate.getTime() < createdTime;
                        };
                        return element.productType.uuid === uuid && dayTest();
                      });
                    };

                    for (var uuid in productTypeCounts) {
                      product = productTypeCounts[uuid];

                      //filter out stock count with no reference to stock out broadcast since the last stock count
                      var filtered = filterStockCountWithNoStockOutRef(stockOutList, uuid);

                      //create a uuid list of products with zero or less reorder days
                      //TODO: gather those below reorder point and send background alert, if (product.stockLevel <= product.bufferStock && filtered.length === 0) {
                      if (product.stockLevel <= 0 && filtered.length === 0) {
                        stockOutWarning.push(uuid);
                      }
                      //skip prods where we don't have inventory rule information
                      if (product.bufferStock < 0) {
                        continue;
                      }

                      values.push({
                        label: utility.ellipsize(product.name, 7),
                        stockAboveReorder: inventoryRulesFactory.stockAboveReorder(
                          product.stockLevel, product.bufferStock
                        ),
                        stockBelowReorder: inventoryRulesFactory.stockBelowReorder(
                          product.stockLevel, product.bufferStock
                        )
                      });
                    }

                    $scope.stockOutWarning = stockOutWarning;
                    var items = messages.items(stockOutWarning.length);
                    $scope.stockOutWarningMsg = messages.stockOutWarningMsg(stockOutWarning.length.toString(), items);
                    $scope.roundLegend = function() {
                      return function(d) {
                        return $window.d3.round(d);
                      };
                    };

                    $scope.productTypesChart = dashboardfactory.chart(keys, values);
                  })
                  .catch(function(err) {
                    console.log('getProductTypeCounts Error: ' + err);
                  });
              }
            }
          }
        }
      });
  });
