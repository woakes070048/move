'use strict'

angular.module('lmisChromeApp')
  .service('consumptionService', function (storageService, stockCountFactory) {
    var DOC_TYPE = storageService.CONSUMPTION
    var self = this

    self.all = function () {
      return storageService.all(DOC_TYPE)
    }

    self.get = function (id) {
      return storageService.find(DOC_TYPE, id)
    }

    self.save = function (data) {
      return storageService.save(DOC_TYPE, data)
    }

    self.remove = function (id) {
      return storageService.removeRecord(DOC_TYPE, id)
    }

    self.isEmptyEntry = function (entryObject) {
      var emptyEntry = true
      if (toString.call(entryObject) === '[object Object]' && (Object.keys(entryObject)).length > 0) {
        for (var key in entryObject) {
          if (entryObject.hasOwnProperty(key) && parseInt(entryObject[key], 10) > 0) {
            emptyEntry = false
            break
          }
        }
      }

      return emptyEntry
    }

    self.loadDefault = function (products, entryObject) {
      products = products || []
      entryObject = entryObject || {}
      var i = products.length
      var reversed = {}
      while (i--) {
        if (!entryObject.hasOwnProperty(products[i]._id)) {
          entryObject[products[i]._id] = 0
        }
        reversed[products[i]._id] = reverseValue(entryObject[products[i]._id], products[i])
      }

      return {
        consumption: entryObject,
        entries: reversed
      }
    }

    self.loadProduct = function (report, reportList) {
      reportList = reportList || []
      var i = reportList.length
      var product = {}
      while (i--) {
        var row = reportList[i]
        if (report._id === row._id) {
          product = row
          break
        }
      }
      return product
    }

    self.getLatestStockLevel = function (date) {
      return stockCountFactory.getStockCountByDate(date)
    }

    function reverseValue (value, product) {
      value = parseInt(value, 10)
      if (value !== 0 && !isNaN(value)) {
        value = value / parseInt(product.presentation.value, 10)
      }
      return value
    }
  })
