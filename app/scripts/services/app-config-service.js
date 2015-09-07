'use strict'

angular.module('lmisChromeApp').service('appConfigService', function ($q, storageService, pouchStorageService, config, syncService, productProfileFactory, facilityFactory, utility, cacheService, $filter, reminderFactory, toastr, messages, $http, memoryStorageService, ehaRetriable) {
  this.APP_CONFIG = storageService.APP_CONFIG
  this.stockCountIntervals = [
    {name: 'Daily', value: reminderFactory.DAILY},
    {name: 'Weekly', value: reminderFactory.WEEKLY},
    {name: 'Bi-Weekly', value: reminderFactory.BI_WEEKLY},
    {name: 'Monthly', value: reminderFactory.MONTHLY}
  ]

  this.weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]

  function getAppConfigFromMemory () {
    var appConfigDb = memoryStorageService.getDatabase(storageService.APP_CONFIG)
    var appConfig
    if (typeof appConfigDb === 'undefined') {
      return appConfig
    }
    var keys = Object.keys(appConfigDb)
    if (keys.length === 1) {
      var key = keys[0]
      appConfig = appConfigDb[key]
    } else if (keys.length > 1) {
      throw new Error('there should be only one app config on this device.')
    }
    return appConfig
  }

  function getAppConfigFromMemoryOrStorage () {
    var appConfig = getAppConfigFromMemory()

    if (angular.isObject(appConfig)) {
      return $q.when(appConfig)
    } else {
      return getAppConfigFromStorage()
    }
  }

  /**
   * @param {Object} appConfig
   * @returns {*|Promise|Promise|!Promise.<R>}
   */
  var saveAppConfig = function (appConfig) {
    // cast to integer in case it is a string
    appConfig.facility.reminderDay = parseInt(appConfig.facility.reminderDay, 10)
    appConfig.facility.stockCountInterval = parseInt(appConfig.facility.stockCountInterval, 10)
    var appConfigCopy
    return getAppConfigFromMemoryOrStorage().then(function (existingAppConfig) {
      if (!angular.isObject(existingAppConfig)) {
        appConfigCopy = utility.copy({}, appConfig)
      } else {
        // update app config by merging both fields.
        appConfigCopy = utility.copy(appConfig, existingAppConfig)
      }

      if (typeof appConfigCopy.dateActivated === 'undefined') {
        appConfigCopy.dateActivated = new Date().toJSON()
      }

      return storageService.save(storageService.APP_CONFIG, appConfigCopy)
        .then(function () {
          // update memory copy.
          memoryStorageService.put(storageService.APP_CONFIG, appConfigCopy)
          return appConfigCopy
        })
    })
  }

  this.save = function (appConfig) {
    return saveAppConfig(appConfig)
  }

  this.setup = function (appConfig) {
    return saveAppConfig(appConfig)
      .then(function (appCfg) {
        return syncService.syncUpRecord(storageService.APP_CONFIG, appCfg)
          .catch(function (err) {
            console.error(err)
            // TODO: resolve properly.
            return { type: 'SAVED_NOT_SYNCED', error: err, appConfig: appConfig }
          })
      })
  }

  this.getAppFacilityProfileByEmail = ehaRetriable(function (email) {
    var REMOTE_URI = config.api.url + '/facilities/_design/config/_view/template?key="' + email + '"'
    REMOTE_URI = encodeURI(REMOTE_URI)
    return $http.get(REMOTE_URI, { withCredentials: true })
      .then(function (res) {
        var rows = res.data.rows
        if (rows.length > 0) {
          var facilityProfile = rows[0].value // pick the first facility profile.
          facilityProfile.selectedProductProfiles = productProfileFactory.getBatch(facilityProfile.selectedProductProfiles)
          return facilityProfile
        } else {
          return $q.reject({ message: 'profile for given email does not exist.', status: 404 })
        }
      })
  })

  var getAppConfigFromStorage = function () {
    var appConfig
    return storageService.get(storageService.APP_CONFIG)
      .then(function (data) {
        if (angular.isArray(data) && data.length > 0) {
          if (data.length > 1) {
            throw new Error('there are more than one app config on this device.')
          }
          appConfig = data[0]
          if (angular.isObject(appConfig)) {
            appConfig.facility.selectedProductProfiles = productProfileFactory.getBatch(appConfig.facility.selectedProductProfiles)
            // add app config to memory
            memoryStorageService.put(storageService.APP_CONFIG, appConfig)
          } else {
            console.error('app config is not an object.')
          }
        }
        return appConfig
      })
  }

  this.getCurrentAppConfig = function () {
    return getAppConfigFromMemoryOrStorage()
  }

  /**
   * this returns current app config product types.
   *
   * */
  this.getProductTypes = function () {
    return getAppConfigFromMemoryOrStorage()
      .then(function (appConfig) {
        var facilityStockListProductTypes = []
        var uuidListOfProductTypesAlreadyRecorded = []
        var DOES_NOT_EXIST = -1
        if (angular.isObject(appConfig)) {
          var facilityProductProfiles = appConfig.facility.selectedProductProfiles
          if (angular.isArray(facilityProductProfiles)) {
            for (var index in facilityProductProfiles) {
              var productProfile = facilityProductProfiles[index]
              var productType = productProfile.product
              if (!angular.isObject(productType)) {
                throw new Error("product profile's  product type is not an object." + productType)
              }
              var uuid = utility.getStringUuid(productType)

              if (uuidListOfProductTypesAlreadyRecorded.indexOf(uuid) === DOES_NOT_EXIST) {
                uuidListOfProductTypesAlreadyRecorded.push(uuid)
                facilityStockListProductTypes.push(productType)
              }
            }
          } else {
            console.error('facility selected product profile is not an array but: ' + (typeof facilityProductProfiles))
          }
        } else {
          console.error('app config: ' + appConfig + ' is not an object.')
        }
        return facilityStockListProductTypes
      })
  }

  // Loads an existing config, and saves it locally if found
  this.loadRemoteConfig = ehaRetriable(function (email) {
    var db = pouchStorageService.getRemoteDB(storageService.APP_CONFIG)
    return db.get(email)
      .then(function (config) {
        // save the config locally
        return saveAppConfig(config)
      })
  })
})
