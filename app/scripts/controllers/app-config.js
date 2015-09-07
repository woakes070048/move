'use strict'

angular.module('lmisChromeApp')
  .controller('AppConfigWizard', function (
    $filter,
    $log,
    $rootScope,
    $scope,
    $state,
    $q,
    alertFactory,
    appConfig,
    appConfigService,
    ccuProfilesGroupedByCategory,
    fixtureLoaderService,
    toastr,
    isEdit,
    lgaList,
    facilityFactory,
    locationService,
    messages,
    productProfilesGroupedByCategory,
    utility,
    zones,
    notificationService
  ) {
    $scope.spaceOutUpperCaseWords = utility.spaceOutUpperCaseWords
    $scope.isSubmitted = false
    $scope.preSelectProductProfileCheckBox = {}
    $scope.stockCountIntervals = appConfigService.stockCountIntervals
    $scope.weekDays = appConfigService.weekDays
    $scope.STEP_ONE = 1
    $scope.STEP_TWO = 2
    $scope.STEP_THREE = 3
    $scope.STEP_FOUR = 4
    $scope.STEP_FIVE = 5
    $scope.STEP_SIX = 6
    $scope.ccuProfilesCategories = Object.keys(ccuProfilesGroupedByCategory)
    $scope.ccuProfilesGroupedByCategory = ccuProfilesGroupedByCategory
    $scope.productProfileCategories = Object.keys(productProfilesGroupedByCategory)
    $scope.productProfilesGroupedByCategory = productProfilesGroupedByCategory
    $scope.productProfileCheckBoxes = [] // used to productProfile models for checkbox
    $scope.ccuProfileCheckBoxes = []
    $scope.lgaCheckBoxes = {}
    $scope.zoneCheckBoxes = []
    $scope.preSelectLgaCheckBox = {}
    $scope.preSelectZoneCheckBox = {}
    $scope.preSelectCcuProfiles = {}
    $scope.developerMode = true
    $scope.serialNumber = {}
    $scope.errorMsg = {}
    $scope.firstConfig = false

    // Methods used by both 'create' and 'edit'
    $scope.onCcuSelection = function (ccuProfile) {
      $scope.appConfig.selectedCcuProfiles =
        utility.addObjectToCollection(ccuProfile, $scope.appConfig.selectedCcuProfiles, 'dhis2_modelid')
      $scope.preSelectCcuProfiles = utility.castArrayToObject($scope.appConfig.selectedCcuProfiles, 'dhis2_modelid')
    }

    $scope.onProductProfileSelection = function (productProfile) {
      $scope.appConfig.facility.selectedProductProfiles =
        utility.addObjectToCollection(productProfile, $scope.appConfig.facility.selectedProductProfiles, 'uuid')
      $scope.preSelectProductProfileCheckBox = utility.castArrayToObject($scope.appConfig.facility.selectedProductProfiles, 'uuid')
    }

    $scope.onLgaSelection = function (lga) {
      var uuid = lga.uuid
      var added = !!$scope.lgaCheckBoxes[uuid]
      if (added) {
        $scope.appConfig.facility.selectedLgas.push(lga)
      } else {
        $scope.appConfig.facility.selectedLgas = $scope.appConfig.facility.selectedLgas.filter(function (item) {
          return item.uuid !== uuid
        })
      }

      $scope.preSelectLgaCheckBox[uuid] = true
    }
    $scope.onZoneSelection = function (zone) {
      $scope.appConfig.facility.selectedZones = utility.addObjectToCollection(zone, $scope.appConfig.facility.selectedZones, '_id')
      $scope.preSelectZoneCheckBox = utility.castArrayToObject($scope.appConfig.facility.selectedZones, '_id')
    }

    $scope.appConfig = appConfig
    // Those 2 are fetched by ui-router
    $scope.lgaList = lgaList
    $scope.zones = zones

    // Methods dedicated to the Wizard
    function applyAppConfig (result) {
      $scope.disableBtn = false
      $scope.isSubmitted = false
      $scope.profileNotFound = false

      $scope.appConfig.facility = result
      $scope.appConfig.facility.reminderDay = result.reminderDay
      $scope.appConfig.facility.stockCountInterval = result.stockCountInterval
      $scope.appConfig.facility.selectedLgas = result.selectedLgas || []
      $scope.appConfig.facility.selectedZones = result.selectedZones || []
      $scope.appConfig.contactPerson = result.contactPerson || {}
      $scope.appConfig.contactPerson.name = $scope.appConfig.facility.contact.name
      $scope.appConfig.contactPerson.phoneNo = $scope.appConfig.facility.contact.oldphone
      $scope.appConfig.selectedCcuProfiles = $scope.appConfig.selectedCcuProfiles || []

      $scope.preSelectCcuProfiles = utility.castArrayToObject($scope.appConfig.selectedCcuProfiles, 'dhis2_modelid')
      // the pre-selected product profiles come either from the document,
      // or (default) from the _design/config documents 'template' view
      $scope.preSelectProductProfileCheckBox = utility.castArrayToObject($scope.appConfig.facility.selectedProductProfiles, 'uuid')
    }

    if (!isEdit) {
      // We've got a facility config
      // Update props as if we loaded it
      if (appConfig.preloaded) {
        applyAppConfig(appConfig.facility)
        $scope.currentStep = $scope.STEP_TWO
      } else {
        // No config template found
        $scope.currentStep = $scope.STEP_ONE // set initial step
      }
      $scope.firstConfig = true
    }

    $scope.moveTo = function (step) {
      $scope.currentStep = step
    }

    $scope.loadAppFacilityProfile = function (nextStep, isEmailValid) {
      $scope.isSubmitted = true
      $scope.disableBtn = isEmailValid
      appConfigService.getAppFacilityProfileByEmail($scope.appConfig.uuid)
        .then(applyAppConfig)
        .then(function () {
          $scope.moveTo(nextStep)
        })
        .catch(function () {
          $scope.disableBtn = false
          $scope.isSubmitted = false
          $scope.profileNotFound = true
        })
    }

    // Methods/Props dedicated to 'Edit Config'
    function preLoadConfigForm (appConfig) {
      if (appConfig === undefined) {
        return
      }

      if (utility.has(appConfig, 'lastUpdated')) {
        var updatedDate = $filter('date')(new Date(appConfig.lastUpdated), 'yyyy-MM-dd HH:mm:ss')
        $scope.lastUpdated = messages.lastUpdated(updatedDate)
      } else {
        $scope.lastUpdated = messages.lastUpdated('N/A')
      }

      $scope.appConfig.facility.selectedProductProfiles = appConfig.facility.selectedProductProfiles || []
      $scope.appConfig.selectedCcuProfiles = appConfig.selectedCcuProfiles || []
      $scope.appConfig.facility.selectedLgas = appConfig.facility.selectedLgas || []
      $scope.appConfig.facility.selectedZones = appConfig.facility.selectedZones || []
      $scope.preSelectLgaCheckBox = $scope.appConfig.facility.selectedLgas.reduce(function (sum, item) {
        sum[item.uuid] = true
        return sum
      }, {})
      $scope.lgaCheckBoxes = angular.copy($scope.preSelectLgaCheckBox)

      $scope.preSelectZoneCheckBox = utility.castArrayToObject($scope.appConfig.facility.selectedZones, '_id')

      $scope.preSelectCcuProfiles = utility.castArrayToObject(appConfig.selectedCcuProfiles, 'dhis2_modelid')
      $scope.preSelectProductProfileCheckBox = utility.castArrayToObject($scope.appConfig.facility.selectedProductProfiles, 'uuid')
    }

    var oldLgas = []
    if (isEdit) {
      if (utility.has(appConfig.facility, 'selectedLgas')) {
        oldLgas = angular.copy(appConfig.facility.selectedLgas)
      }

      preLoadConfigForm(appConfig)

      $scope.developerMode = false
      $rootScope.developerMode = false
    }

    var noOfAttempts = 0
    $scope.enterDeveloperMode = function () {
      var MAX_ATTEMPTS = 5
      noOfAttempts = noOfAttempts + 1
      if (MAX_ATTEMPTS <= noOfAttempts) {
        $rootScope.developerMode = true
        $scope.developerMode = true
        noOfAttempts = 0
      }
    }

    var isSameLgas = function (old, recent) {
      if (old.length !== recent.length) {
        return false
      }
      var hasOddElem = true
      recent.forEach(function (rLga) {
        var similar = old.filter(function (oLga) {
          return rLga._id === oLga._id
        })
        if (similar.length === 0) {
          hasOddElem = false
        }
      })
      return hasOddElem
    }

    // Save Methods:
    $scope.save = function (forSerial) {
      $scope.isSaving = true
      var nearbyLgaIds = locationService.extractIds($scope.appConfig.facility.selectedLgas)
      var loadLga
      if (isSameLgas(oldLgas, $scope.appConfig.facility.selectedLgas)) {
        loadLga = $q.when(true)
      } else {
        loadLga = fixtureLoaderService.setupWardsAndFacilitesByLgas(nearbyLgaIds)
      }

      loadLga
        .catch(function (err) {
          // set selectedLga to previous selection since fetching of update fromm server failed
          $scope.appConfig.facility.selectedLgas = oldLgas
          toastr.error(messages.lgaFacilityListFailed)
          return err
        })
        .then(function (res) {
          return appConfigService.setup($scope.appConfig)
        })
        .then(function (result) {
          if (typeof result !== 'undefined') {
            afterSave(forSerial)
          } else {
            toastr.error(messages.appConfigFailedMsg)
          }
        }).catch(function (reason) {
        if (!isEdit) {
          return toastr.error(messages.appConfigFailedMsg)
        }

        if (utility.has(reason, 'type') && reason.type === 'SAVED_NOT_SYNCED') {
          afterSave(forSerial)
        } else {
          toastr.error(messages.appConfigFailedMsg)
        }
      }).finally(function () {
        $scope.isSaving = false
        var facilityLgaIds = lgaList.filter(function (lga) {
          return (lga._id && nearbyLgaIds.indexOf(lga._id) === -1)
        }).map(function (lga) {
          return lga._id
        })
        facilityFactory.removeByLgaIds(facilityLgaIds)
      })
    }

    $scope.addSerialNumber = function () {
      var ccuItemID = Object.keys($scope.selectedCCEItem)[0]
      var ccuProfile = $scope.preSelectCcuProfiles[ccuItemID]
      ccuProfile.serialNumbers = ccuProfile.serialNumbers || []
      $scope.errorMsg[ccuItemID] = ''

      if (ccuProfile.serialNumbers.indexOf($scope.serialNumber[ccuItemID]) !== -1) {
        $scope.errorMsg[ccuItemID] = 'Duplicate entry! serial already exist'
        return
      }

      if ($scope.serialNumber[ccuItemID] === '' || angular.isUndefined($scope.serialNumber[ccuItemID]) ||
        ccuProfile.serialNumbers.indexOf($scope.serialNumber[ccuItemID]) !== -1) {
        toastr.error('enter a value to add')
        return
      }

      ccuProfile.serialNumbers.push($scope.serialNumber[ccuItemID])
      $scope.preSelectCcuProfiles = utility.castArrayToObject($scope.appConfig.selectedCcuProfiles, 'dhis2_modelid')

      $scope.serialNumber[ccuItemID] = ''
    }

    $scope.removeSerial = function (ccuProfile, index) {
      $scope.errorMsg[ccuProfile.dhis2_modelid] = ''
      var confirmationTitle = 'Remove Serial Number'
      var confirmationQuestion = 'Are you sure you want to delete serials?'
      var buttonLabels = ['Yes', 'No']

      notificationService.getConfirmDialog(confirmationTitle, confirmationQuestion, buttonLabels)
        .then(function (isConfirmed) {
          if (isConfirmed === true) {
            ccuProfile.serialNumbers.splice(index, 1)
          }
        })
        .catch(function (reason) {})
    }

    function resetRowState () {
      $scope.selectedCCEItem = {}
    }

    function toggleRow (ccuProfile) {
      $scope.errorMsg[ccuProfile.dhis2_modelid] = ''
      if (!angular.isObject(ccuProfile)) {
        ccuProfile = JSON.parse(ccuProfile)
      }

      if (!$scope.preSelectCcuProfiles[ccuProfile.dhis2_modelid]) {
        toastr.error('Equipment need to be selected to add serial number')
      }

      if (utility.isEmptyObject($scope.selectedCCEItem)) {
        $scope.selectedCCEItem[ccuProfile.dhis2_modelid] = true
      } else if ($scope.selectedCCEItem.hasOwnProperty(ccuProfile.dhis2_modelid)) {
        $scope.selectedCCEItem[ccuProfile.dhis2_modelid] = !$scope.selectedCCEItem[ccuProfile.dhis2_modelid]
      } else {
        resetRowState()
        $scope.selectedCCEItem[ccuProfile.dhis2_modelid] = true
      }

      if ($scope.ccuProfileCheckBoxes[ccuProfile.dhis2_modelid]) {
        var selectedProfile = $scope.ccuProfileCheckBoxes[ccuProfile.dhis2_modelid]
        var selectedCCU = angular.isObject(selectedProfile) ? selectedProfile : JSON.parse(selectedProfile)
        if (selectedCCU.deSelected) {
          resetRowState()
        }
      }
    }

    function afterSave (forSerial) {
      if (forSerial) {
        toastr.success(messages.appConfigSuccessMsg)
      }
      if (!forSerial) {
        alertFactory.success(messages.appConfigSuccessMsg)
        $state.go('home.mainActivity')
      }
    }

    $scope.toggleRow = toggleRow
    resetRowState()
  })
