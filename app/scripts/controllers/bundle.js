'use strict'

angular.module('lmisChromeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('logBundleHome', {
        parent: 'root.index',
        url: '/log-bundle-home?type',
        templateUrl: 'views/bundles/index.html',
        controller: 'LogBundleHomeCtrl',
        resolve: {
          bundles: function (bundleService) {
            return bundleService.getAll()
          },
          appConfig: function (appConfigService) {
            return appConfigService.getCurrentAppConfig()
          },
          lgaFacilities: function (facilityFactory) {
            var lgaFacilityType = 'cco'
            return facilityFactory.getByType(lgaFacilityType)
                .catch(function () {
                  return []
                })
          }
        }
      })
      .state('logBundle', {
        parent: 'root.index',
        url: '/log-bundle?type&preview&uuid&selectedFacility',
        templateUrl: 'views/bundles/log-incoming.html',
        controller: 'LogBundleCtrl',
        resolve: {
          appConfig: function (appConfigService) {
            return appConfigService.getCurrentAppConfig()
          },
          batchStore: function (batchService) {
            return batchService.getBatchNos()
              .catch(function () {
                return {}
              })
          },
          bundles: function (bundleService) {
            return bundleService.getAll()
          }
        }
      })
  })
  .controller('LogBundleHomeCtrl', function ($scope, appConfig, locationService, lgaFacilities, facilityFactory, $stateParams, bundleService, bundles, $state, utility, productProfileFactory, toastr, messages, productCategoryFactory) {
    var logIncoming = bundleService.INCOMING
    var logOutgoing = bundleService.OUTGOING
    $scope.lgas = appConfig.facility.selectedLgas
    $scope.wards = []
    $scope.ccoFacilities = lgaFacilities
    $scope.selectedLGA = ''
    $scope.selectedWard = ''
    $scope.selectFacilityError = false
    $scope.facilities = []
    $scope.placeholder = { selectedFacility: '' }
    $scope.stateColdStore = {'uuid': '3e1275f1599f695322aaecdafe0c933a', 'name': 'Kano State Cold Store'}

    if ($stateParams.type !== logIncoming && $stateParams.type !== logOutgoing) {
      $state.go('home.mainActivity')
      toastr.error(messages.specifyBundleType)
      return
    }

    function setUITexts (type) {
      if ($stateParams.type === logIncoming) {
        $scope.logBundleTitle = messages.incomingDelivery
        $scope.facilityHeader = messages.receivedFrom
        $scope.previewFacilityLabel = messages.receivedFrom
        $scope.selectFacility = messages.selectSender
        $scope.LGALabel = messages.selectSendingLga
        $scope.WardLabel = messages.selectSendingWard
      } else if ($stateParams.type === logOutgoing) {
        $scope.logBundleTitle = messages.outgoingDelivery
        $scope.facilityHeader = messages.sentTo
        $scope.selectFacility = messages.selectReceiver
        $scope.previewFacilityLabel = messages.sentTo
        $scope.LGALabel = messages.selectReceivingLga
        $scope.WardLabel = messages.selectReceivingWard
      } else {
        $scope.logFormTitle = messages.unknownBundleType
      }
    }

    setUITexts($stateParams.type)

    bundleService.getRecentFacilityIds($stateParams.type)
      .then(function (res) {
        var lgaFacilityIds = utility.castArrayToObject($scope.ccoFacilities, '_id')
        var uniqueIds = res.filter(function (id) {
          return angular.isUndefined(lgaFacilityIds[id])
        })
        facilityFactory.getFacilities(uniqueIds)
          .then(function (facilities) {
            $scope.recentFacilities = facilities
          })
          .catch(function (err) {
            console.error(err)
          })
      })
      .catch(function (err) {
        console.error(err)
      })

    $scope.getWards = function (lga) {
      $scope.facilities = []
      locationService.getWards(lga)
        .then(function (wards) {
          $scope.wards = wards
        })
    }

    $scope.getFacilities = function (ward) {
      ward = JSON.parse(ward)
      $scope.facilities = []
      facilityFactory.find(function (result) {
        result.forEach(function (row) {
          if (row.wardUUID === ward.uuid) {
            $scope.facilities.push(row)
          }
        })
      })
    }

    $scope.setFacility = function () {
      if ($scope.placeholder.selectedFacility === '-1') {
        $scope.showAddNew = true
        $scope.selectFacilityError = false
        $scope.placeholder.selectedFacility = '' // clear facility selection
      } else if ($scope.placeholder.selectedFacility !== '') {
        $scope.selectFacilityError = false
      }
    }

    $scope.showLogBundleForm = function () {
      if ($scope.placeholder.selectedFacility === '-1' || $scope.placeholder.selectedFacility === '') {
        $scope.selectFacilityError = true
        return
      }
      $state.go('logBundle', { type: $stateParams.type, selectedFacility: $scope.placeholder.selectedFacility })
    }

    $scope.bundles = bundles
      .filter(function (e) {
        // TODO: move to service getByType()
        return e.type === $stateParams.type
      })
      .sort(function (a, b) {
        // desc order
        return -(new Date(a.created) - new Date(b.created))
      })
    $scope.previewBundle = {}
    $scope.preview = false

    $scope.showBundle = function (bundle) {
      for (var i in bundle.bundleLines) {
        var ppUuid = bundle.bundleLines[i].productProfile
        bundle.bundleLines[i].productProfile = productProfileFactory.get(ppUuid)
      }
      bundle.bundleLines
        .sort(function (a, b) {
          return (a.productProfile.category.name > b.productProfile.category.name)
        })
      $scope.previewBundle = angular.copy(bundle)
      $scope.preview = true
    }
    $scope.getCategoryColor = productCategoryFactory.getCategoryColor
    $scope.hidePreview = function () {
      $scope.preview = false
    }
    $scope.expiredProductAlert = productProfileFactory.compareDates
  })
  .controller('LogBundleCtrl', function ($scope, batchStore, utility, batchService, appConfig, messages, productProfileFactory, bundleService, toastr, $state, alertFactory, syncService, $stateParams, $filter, locationService, facilityFactory, appConfigService, productCategoryFactory, VVM_OPTIONS) {
    var logIncoming = bundleService.INCOMING
    var logOutgoing = bundleService.OUTGOING

    $scope.isSaving = false
    $scope.selectedProductBaseUOM = {}
    $scope.selectedProductUOMName = {}
    $scope.calcedQty = {}
    $scope.selectedProductUOMVal = {}
    $scope.selectedProductName = []
    $scope.err = {}
    $scope.batchNos = Object.keys(batchStore)

    $scope.vvmOptions = VVM_OPTIONS
    $scope.selectVVMOption = function (bundleLine, option) {
      $scope.toggleIsopen = false
      bundleLine.VVMStatus = option
    }

    $scope.hideFavFacilities = function () {
      $scope.showAddNew = true
    }

    $scope.updateBatchInfo = function (bundleLine) {
      var batch
      if (bundleLine.batchNo) {
        batch = batchStore[bundleLine.batchNo]
        if (angular.isObject(batch)) {
          bundleLine.productProfile = batch.profile
          bundleLine.expiryDate = new Date(batch.expiryDate)
          $scope.getUnitQty(bundleLine)
        }
      }
    }

    $scope.updateUnitQty = function (uom, count, bundleLine) {
      bundleLine.quantity = uom * count
      if (!isNaN(bundleLine.quantity)) {
        if ($scope.err[bundleLine.id].quantity) {
          $scope.err[bundleLine.id].quantity = false
        }
      }
    }

    var setFacility = function () {
      facilityFactory.get($stateParams.selectedFacility)
        .then(function (facility) {
          $scope.selectedFacility = facility
          if ($stateParams.type === logIncoming) {
            $scope.bundle.sendingFacility = facility
            $scope.bundle.receivingFacility = appConfig.facility
          } else if ($stateParams.type === logOutgoing) {
            $scope.bundle.receivingFacility = facility
            $scope.bundle.sendingFacility = appConfig.facility
          } else {
            toastr.error(messages.unknownBundleType)
          }
        })
        .catch(function (err) {
          console.error(err)
          $state.go('logBundleHome', { type: $stateParams.type })
          toastr.error(messages.selectedFacilityNotFound)
        })
    }
    setFacility()
    $scope.selectedProduct = []
    $scope.getUnitQty = function (bundleLine) {
      $scope.productProfiles.map(function (product) {
        if (product.uuid === bundleLine.productProfile) {
          $scope.selectedProduct[bundleLine.id] = product
          $scope.selectedProductName[bundleLine.id] = product.name
          $scope.selectedProductBaseUOM[bundleLine.id] = product.product.base_uom.name
          $scope.selectedProductUOMName[bundleLine.id] = product.presentation.uom.name
          $scope.selectedProductUOMVal[bundleLine.id] = product.presentation.value
        }
      })
    }
    var getLGAs = function () {
      $scope.lgas = appConfig.facility.selectedLgas
    }
    getLGAs()

    $scope.getWards = function (lga) {
      locationService.getWards(lga)
        .then(function (wards) {
          $scope.wards = wards
        })
    }

    $scope.getFacilities = function (ward) {
      ward = JSON.parse(ward)
      facilityFactory.getFacilities(ward.facilities)
        .then(function (facilities) {
          $scope.facilities = facilities
        })
    }

    $scope.goodToGo = function (bundlineForm, field) {
      return bundlineForm.$error[field]
    }

    if ($stateParams.type !== logIncoming && $stateParams.type !== logOutgoing) {
      $state.go('home.mainActivity')
      toastr.error(messages.specifyBundleType)
      return
    }
    $scope.placeholder = {
      selectedFacility: ''
    }
    $scope.previewFacilityLabel = ''

    function validateBundle () {
      var valid = true

      function isValid (bundleLine) {
        $scope.err[bundleLine.id].reset()
        var selectedProduct = $scope.selectedProduct[bundleLine.id]

        if (bundleLine.productProfile === '') {
          valid = false
          $scope.err[bundleLine.id].pp = true
        }

        if (bundleLine.batchNo === '') {
          valid = false
          $scope.err[bundleLine.id].batchNo = true
        }

        if (angular.isUndefined(bundleLine.expiryDate)) {
          valid = false
          $scope.err[bundleLine.id].expiry = true
        }

        if (bundleLine.quantity === '' || isNaN(bundleLine.quantity)) {
          valid = false
          $scope.err[bundleLine.id].quantity = true
        }

        if (bundleLine.VVMStatus === '' && selectedProduct) {
          if (selectedProduct && selectedProduct.category.name === 'cold-store-vaccines') {
            valid = false
            $scope.err[bundleLine.id].vvmstatus = true
          }
        }
      }

      $scope.bundle.bundleLines.forEach(isValid)
      return valid
    }

    function setUIText (type) {
      var today = $filter('date')(new Date(), 'dd MMM, yyyy')
      if ($stateParams.type === logIncoming) {
        $scope.logBundleTitle = [messages.incomingDelivery, '-', today].join(' ')
        $scope.selectFacility = messages.selectSender
        $scope.previewFacilityLabel = messages.receivedFrom
        $scope.LGALabel = messages.selectSendingLga
        $scope.WardLabel = messages.selectSendingWard
      } else if ($stateParams.type === logOutgoing) {
        $scope.logBundleTitle = [messages.outgoingDelivery, '-', today].join(' ')
        $scope.selectFacility = messages.selectReceiver
        $scope.previewFacilityLabel = messages.sendTo
        $scope.LGALabel = messages.selectReceivingLga
        $scope.WardLabel = messages.selectReceivingWard
      } else {
        $scope.logFormTitle = messages.unknownBundleType
      }
    }

    setUIText($stateParams.type)

    bundleService.getRecentFacilityIds($stateParams.type)
      .then(function (res) {
        facilityFactory.getFacilities(res)
          .then(function (facilities) {
            $scope.recentFacilities = facilities
          })
      })
      .catch(function (err) {
        console.error(err)
      })

    $scope.productProfiles = productProfileFactory.getAll()
    $scope.batches = []
    var id = 0
    $scope.previewBundle = {}
    $scope.previewForm = false
    $scope.bundle = {
      type: $stateParams.type,
      receivedOn: new Date().toJSON(),
      receivingFacility: {},
      bundleLines: []
    }

    $scope.addNewLine = function () {
      if (validateBundle()) {
        newLine()
      }
    }
    function newLine () {
      var bundleLineId = id++
      $scope.bundle.bundleLines.push({
        id: bundleLineId,
        batchNo: '',
        productProfile: '',
        VVMStatus: ''
      })
      $scope.err[bundleLineId] = {
        pp: false,
        batchNo: false,
        expiry: false,
        quantity: false,
        reset: function () {
          this.pp = false
          this.batchNo = false
          this.expiry = false
          this.quantity = false
        },
        vvmstatus: false
      }
    }
    newLine()
    $scope.removeLine = function (bundleLine) {
      $scope.bundle.bundleLines = $scope.bundle.bundleLines.filter(function (line) {
        return line.id !== bundleLine.id
      })
    }

    $scope.isSelectedFacility = function (fac) {
      // TODO: refactor
      var sendingFacObj = $scope.bundle.sendingFacility
      if (angular.isDefined(sendingFacObj) && angular.isDefined(fac)) {
        if (angular.isString(sendingFacObj) && sendingFacObj.length > 0) {
          sendingFacObj = JSON.parse(sendingFacObj)
        }
        return sendingFacObj.uuid === fac.uuid
      }
      return false
    }

    var updateBundleLines = function (bundle) {
      for (var i in bundle.bundleLines) {
        var ppUuid = bundle.bundleLines[i].productProfile
        bundle.bundleLines[i].productProfile = productProfileFactory.get(ppUuid)
      }
      return bundle
    }

    $scope.preview = function (invalidForm) {
      // TODO: Validate bundle obj and show preview if valid.
      // TODO: create new facility obj for preview from uuid, hence no need to track currently selected facility.
      validateBundle()
      if (!invalidForm) {
        $scope.previewForm = true
        $scope.previewBundle = angular.copy($scope.bundle)
        if ($stateParams.type === logIncoming) {
          $scope.previewBundle.facilityName = $scope.bundle.sendingFacility.name
        } else if ($stateParams.type === logOutgoing) {
          $scope.previewBundle.facilityName = $scope.bundle.receivingFacility.name
        }
        updateBundleLines($scope.previewBundle)
      } else {
        toastr.error('Form still have missing data')
      }
    }

    $scope.setFacility = function () {
      var selectedFacility = $scope.placeholder.selectedFacility
      if (selectedFacility === '' || angular.isUndefined(selectedFacility)) {
        return
      }
      if ($stateParams.type === logIncoming) {
        $scope.bundle.sendingFacility = JSON.parse(selectedFacility)
        $scope.bundle.receivingFacility = appConfig.facility
      } else if ($stateParams.type === logOutgoing) {
        $scope.bundle.receivingFacility = JSON.parse(selectedFacility)
        $scope.bundle.sendingFacility = appConfig.facility
      } else {
        toastr.error(messages.unknownBundleType)
      }
    }

    $scope.disableSave = function () {
      return $scope.bundle.bundleLines.length === 0 || $scope.placeholder.selectedFacility === ''
    }

    $scope.showForm = function () {
      $scope.previewForm = false
    }

    function updateBatchInfo (bundleLines) {
      var batches = batchService.extractBatch(bundleLines)
      var updatedBatches = batches
        .map(function (b) {
          var oldBatch = batchStore[b.batchNo]
          if (oldBatch) {
            b._id = oldBatch._id
            b._rev = oldBatch._rev
            b.uuid = oldBatch.uuid
          }
          return b
        })
      batchService.saveBatches(updatedBatches)
        .catch(function (err) {
          console.error(err)
        })
    }

    $scope.finalSave = function () {
      var bundle = angular.copy($scope.bundle)
      $scope.isSaving = true
      var successMsg = ''
      if ($stateParams.type === logIncoming) {
        successMsg = messages.incomingDeliverySuccessMessage
        bundle.facilityName = bundle.sendingFacility.name
      } else {
        successMsg = messages.outgoingDeliverySuccessMessage
        bundle.facilityName = bundle.receivingFacility.name
      }
      var newProductProfiles = []
      bundle.bundleLines.forEach(function (bundleLine) {
        var i = 1
        appConfig.facility.selectedProductProfiles.filter(function (product) {
          if (product.uuid === bundleLine.productProfile) {
            i = 0
          }
        })
        if (i === 1) {
          newProductProfiles.push(bundleLine.productProfile)
        }
      })
      if (newProductProfiles.length > 0) {
        $scope.productProfiles.map(function (product) {
          if (newProductProfiles.indexOf(product.uuid) !== -1) {
            appConfig.facility.selectedProductProfiles.push(product)
          }
        })
        appConfigService.save(appConfig)
      }

      bundle.receivingFacility = bundle.receivingFacility.uuid
      bundle.sendingFacility = bundle.sendingFacility.uuid
      bundleService.save(bundle)
        .then(function () {
          syncService.syncUpRecord(bundleService.BUNDLE_DB, bundle)
            .finally(function () {
              alertFactory.success(successMsg)
              $state.go('home.mainActivity')
              $scope.isSaving = false
              updateBatchInfo(bundle.bundleLines)
            })
        })
        .catch(function (error) {
          console.error(error)
          toastr.error('Save incoming bundle failed, contact support.')
          $scope.isSaving = false
        })
    }

    $scope.getCategoryColor = productCategoryFactory.getCategoryColor
    $scope.expiredProductAlert = productProfileFactory.compareDates
    $scope.productIsVaccine = function (product, bundleLine) {
      if (!(product && product.category && product.category.name)) {
        return false
      }
      if (productCategoryFactory.getCategoryColor(product.category.name) === 'cold-store-vaccines') {
        return true
      }
      bundleLine.VVMStatus = ''
      return false
    }
  })

