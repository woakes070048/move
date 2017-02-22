'use strict'

angular.module('lmisChromeApp')
  .factory('wasteCountFactory', function ($filter, storageService, utility, $q, syncService) {
    var DB_NAME = storageService.DISCARD_COUNT
    var wasteReasons = {
      '0': 'VVM Stage 3',
      '1': 'VVM Stage 4',
      '2': 'Broken Vial',
      '3': 'Label Missing',
      '4': 'Unopened Expiry',
      '5': 'Opened Expiry',
      '6': 'Suspected Freezing',
      '7': 'Other'
    }

    var isoDate = function (_date) {
      var date = (angular.isDefined(_date)) ? new Date(_date) : new Date()
      return $filter('date')(date, 'yyyy-MM-dd')
    }

    var getCategoriesExcludeFromCount = function () {
      // TODO: this needs to be in a database or some sort of setup script
      return [
        'd5ffa6bd-58d2-41b5-a688-6a9d6894c5ae',
        'a0f10e2e-cffa-42c4-832b-1ba0e48caa64',
        '99fde088-7ff2-4545-b0c1-8f2c36911f01',
        '1c761db0-d7f3-4abf-8c12-6c678f862851'
      ]
    }

    var getWasteCountByDate = function (date) {
      date = date instanceof Date ? isoDate(date.toJSON()) : isoDate(date)
      var deferred = $q.defer()
      storageService.all(DB_NAME)
        .then(function (wasteCounts) {
          wasteCounts = wasteCounts
            .filter(function (countRow) {
              return isoDate(countRow.countDate) === isoDate(date)
            })
          var wasteCount = (wasteCounts.length) ? wasteCounts[0] : null
          deferred.resolve(wasteCount)
        })
        .catch(function (reason) {
          deferred.reject(reason)
        })
      return deferred.promise
    }

    var addRecord = function (object) {
      var deferred = $q.defer()
      if (object.countDate instanceof Date) {
        object.countDate = object.countDate.toJSON()
      }
      getWasteCountByDate(object.countDate).then(function (wasteCount) {
        if (wasteCount !== null) {
          object.uuid = wasteCount.uuid
        }
        object.isUoMSpecified = true;
        console.log(object)
        storageService.save(storageService.DISCARD_COUNT, object)
          .then(function (uuid) {
            deferred.resolve(uuid)
          })
          .catch(function (reason) {
            deferred.reject(reason)
          })
      })
      return deferred.promise
    }

    var load = {
      /**
       *
       * @returns {promise}
       */
      allWasteCount: function () {
        var deferred = $q.defer()
        storageService.all(DB_NAME)
          .then(function (wasteCounts) {
            wasteCounts = syncService.addSyncStatus(wasteCounts)
            deferred.resolve(wasteCounts)
          })
          .catch(function (reason) {
            deferred.reject(reason)
          })
        return deferred.promise
      },

      productObject: function (array) {
        array = array
          .filter(function (product) {
            var excludedCategories = getCategoriesExcludeFromCount()
            if (angular.isObject(product.category)) {
              return excludedCategories.indexOf(product.category.uuid) === -1
            }
            return excludedCategories.indexOf(product.category) === -1
          })
        return utility.castArrayToObject(array, 'uuid')
      },
      wasteCountByType: function (wasteCount, facilityProductProfiles) {
        var arr = []
        if (Object.prototype.toString.call(wasteCount) === '[object Object]') {
          for (var i in wasteCount.discarded) {
            if (angular.isDefined(facilityProductProfiles[i])) {
              var uom = facilityProductProfiles[i].presentation.uom.symbol
              arr.push({
                header: true,
                value: wasteCount.discarded[i],
                key: i,
                uom: uom
              })
              if ((Object.keys(wasteCount.reason[i])).length > 0) {
                for (var j in wasteCount.reason[i]) {
                  if (wasteCount.reason[i][j] !== 0 && wasteCount.reason[i][j] !== '') {
                    arr.push(
                      {
                        header: false,
                        value: wasteCount.reason[i][j],
                        key: j,
                        uom: uom
                      }
                    )
                  }
                }
              }
            }
          }
        }
        return arr
      },
      productName: function (row, facilityProducts) {
        var name = row.key
        if (row.header) {
          name = facilityProducts[row.key].name
        } else {
          name = wasteReasons[row.key]
        }
        return name
      }
    }

    function wasteCounterFilter (mostRecentCountDate) {
      return function (row) {
        return utility.getFullDate(row.created) >= utility.getFullDate(mostRecentCountDate)
      }
    }

    function getWasteCountWithinDueDate (selectedProducts, mostRecentCountDate) {
      return load.allWasteCount()
        .then(function (wasteCounts) {
          return {
            wasteCounts: wasteCounts.filter(wasteCounterFilter(mostRecentCountDate)),
            selectedProducts: selectedProducts
          }
        })
    }

    function computeWastCounts (response) {
      var deferred = $q.defer()
      var wasteCounts = response.wasteCounts
      var selectedProducts = utility.castArrayToObject(response.selectedProducts, 'uuid')
      var productTypes = {}
      for (var i = 0; i < wasteCounts.length; i++) {
        var products = Object.keys(wasteCounts[i].reason)
        for (var j = 0; j < products.length; j++) {
          if (selectedProducts[products[j]]) {
            var pUUID = selectedProducts[products[j]].product.uuid
            var presentation = selectedProducts[products[j]].presentation.value
            var wasteCount = wasteCounts[i].reason[products[j]]
            productTypes[pUUID] = 0
            for (var key in wasteCount) {
              if (wasteCount.hasOwnProperty(key)) {
                productTypes[pUUID] += (wasteCounts[i].reason[products[j]][key] * presentation)
              }
            }
          }
        }
      }
      deferred.resolve(productTypes)
      return deferred.promise
    }

    function getWastedStockLevel (selectedProducts, mostRecentCountDate) {
      return getWasteCountWithinDueDate(selectedProducts, mostRecentCountDate)
        .then(computeWastCounts)
    }

    return {
      wasteReasons: wasteReasons,
      add: addRecord,
      get: load,
      getWasteCountByDate: getWasteCountByDate,
      getWastedStockLevel: getWastedStockLevel,
      DB_NAME: DB_NAME
    }
  })
