'use strict';

angular.module('lmisChromeApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('appConfig', {
        parent: 'root.index',
        abstract: true,
        templateUrl: 'views/home/index.html',
      })
      .state('appConfigWelcome', {
        url: '/app-config-welcome',
        parent: 'root.index',
        templateUrl: 'views/app-config/welcome-page.html',
        data: {
          label: 'Welcome'
        }
      })
      .state('appConfig.wizard', {
        url: '/app-config-wizard',
        parent: 'root.index',
        templateUrl: 'views/app-config/wizard.html',
        resolve: {
          appConfig: function(deviceInfoFactory) {
            return deviceInfoFactory.getDeviceInfo()
              .then(function(result) {
                return result.mainAccount;
              })
              .catch(function() {
                return '';
              })
              .then(function(email) {
                return {
                  uuid: email,
                  facility: { },
                  contactPerson: {
                    name: '',
                    phoneNo: ''
                  },
                  selectedCcuProfiles: [],
                  dateActivated: undefined
                };
              });
          },
          ccuProfilesGroupedByCategory: function(ccuProfileFactory) {
            return ccuProfileFactory.getAllGroupedByCategory();
          },
          productProfilesGroupedByCategory: function(productProfileFactory) {
            return productProfileFactory.getAllGroupedByCategory();
          },
          zones: function(locationService) {
            return locationService.getZones('f87ed3e017cf4f8db26836fd910e4cc8');
          },
          lgaList: function(locationService) {
            return locationService.getLgas('f87ed3e017cf4f8db26836fd910e4cc8');
          },
          isEdit: function() {
            return false;
          }
        },
        controller: 'AppConfigWizard',
        data: {
          label: 'Configuration wizard'
        }
      })
      .state('appConfig.edit', {
        url: '/edit-app-config',
        parent: 'root.index',
        templateUrl: 'views/app-config/edit-configuration.html',
        resolve: {
          appConfig: function(appConfigService) {
            return appConfigService.getCurrentAppConfig();
          },
          ccuProfilesGroupedByCategory: function(ccuProfileFactory) {
            return ccuProfileFactory.getAllGroupedByCategory();
          },
          productProfilesGroupedByCategory: function(productProfileFactory) {
            return productProfileFactory.getAllGroupedByCategory();
          },
          zones: function(locationService) {
            return locationService.getZones('f87ed3e017cf4f8db26836fd910e4cc8');
          },
          lgaList: function(locationService) {
            return locationService.getLgas('f87ed3e017cf4f8db26836fd910e4cc8');
          },
          isEdit: function() {
            return true;
          }
        },
        controller: 'AppConfigWizard',
        data: {
          label: 'Settings'
        }
      });

  })
  .controller('AppConfigWizard', function(
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
    growl,
    isEdit,
    lgaList,
    locationService,
    messages,
    productProfilesGroupedByCategory,
    utility,
    zones
  ) {

    console.log('got app config');
    $scope.spaceOutUpperCaseWords = utility.spaceOutUpperCaseWords;
    $scope.isSubmitted = false;
    $scope.preSelectProductProfileCheckBox = {};
    $scope.stockCountIntervals = appConfigService.stockCountIntervals;
    $scope.weekDays = appConfigService.weekDays;
    $scope.STEP_ONE = 1;
    $scope.STEP_TWO = 2;
    $scope.STEP_THREE = 3;
    $scope.STEP_FOUR = 4;
    $scope.STEP_FIVE = 5;
    $scope.STEP_SIX = 6;
    $scope.ccuProfilesCategories = Object.keys(ccuProfilesGroupedByCategory);
    $scope.ccuProfilesGroupedByCategory = ccuProfilesGroupedByCategory;
    $scope.productProfileCategories = Object.keys(productProfilesGroupedByCategory);
    $scope.productProfilesGroupedByCategory = productProfilesGroupedByCategory;
    $scope.productProfileCheckBoxes = [];//used to productProfile models for checkbox
    $scope.ccuProfileCheckBoxes = [];
    $scope.lgaCheckBoxes = {};
    $scope.zoneCheckBoxes = [];
    $scope.preSelectLgaCheckBox = {};
    $scope.preSelectZoneCheckBox = {};
    $scope.preSelectCcuProfiles = {};
    $scope.developerMode = true;

    // Methods used by both 'create' and 'edit'
    $scope.onCcuSelection = function(ccuProfile) {
      $scope.appConfig.selectedCcuProfiles =
        utility.addObjectToCollection(ccuProfile, $scope.appConfig.selectedCcuProfiles, 'dhis2_modelid');
      $scope.preSelectCcuProfiles = utility.castArrayToObject($scope.appConfig.selectedCcuProfiles, 'dhis2_modelid');
    };

    $scope.onProductProfileSelection = function(productProfile) {
      $scope.appConfig.facility.selectedProductProfiles =
        utility.addObjectToCollection(productProfile, $scope.appConfig.facility.selectedProductProfiles, 'uuid');
      $scope.preSelectProductProfileCheckBox = utility.castArrayToObject($scope.appConfig.facility.selectedProductProfiles, 'uuid');
    };

    $scope.onLgaSelection = function(lga){
      var uuid = lga.uuid;
      var added = !!$scope.lgaCheckBoxes[uuid];
      appConfigService.getSelectedFacility(uuid, added);

      if(added) {
        $scope.appConfig.facility.selectedLgas.push(lga);
      } else {
        $scope.appConfig.facility.selectedLgas = $scope.appConfig.facility.selectedLgas.filter(function(item) {
          return item.uuid !== uuid;
        });
      }

      $scope.preSelectLgaCheckBox[uuid] = true;
    };
    $scope.onZoneSelection = function(zone){
      $scope.appConfig.facility.selectedZones = utility.addObjectToCollection(zone, $scope.appConfig.facility.selectedZones, '_id');
      $scope.preSelectZoneCheckBox = utility.castArrayToObject($scope.appConfig.facility.selectedZones, '_id');
    };

    $scope.appConfig = appConfig;
    // Those 2 are fetched by ui-router
    $scope.lgaList = lgaList;
    $scope.zones = zones;

    // Methods dedicated to the Wizard
    $scope.currentStep = $scope.STEP_ONE; //set initial step
    $scope.moveTo = function(step) {
      $scope.currentStep = step;
    };

    $scope.loadAppFacilityProfile = function(nextStep, isEmailValid) {
      $scope.isSubmitted = true;
      $scope.disableBtn = isEmailValid;
      appConfigService.getAppFacilityProfileByEmail($scope.appConfig.uuid)
        .then(function(result) {
          $scope.disableBtn = false;
          $scope.isSubmitted = false;
          $scope.profileNotFound = false;

          $scope.appConfig.facility = result;
          $scope.appConfig.facility.reminderDay = result.reminderDay;
          $scope.appConfig.facility.stockCountInterval = result.stockCountInterval;
          $scope.appConfig.facility.selectedLgas = result.selectedLgas || [];
          $scope.appConfig.facility.selectedZones = result.selectedZones || [];
          $scope.appConfig.contactPerson.name = $scope.appConfig.facility.contact.name;
          $scope.appConfig.contactPerson.phoneNo = $scope.appConfig.facility.contact.oldphone;
          $scope.appConfig.selectedCcuProfiles = $scope.appConfig.selectedCcuProfiles || [];

          $scope.preSelectCcuProfiles = utility.castArrayToObject($scope.appConfig.selectedCcuProfiles, 'dhis2_modelid');
          // the pre-selected product profiles come either from the document,
          // or (default) from the _design/config documents 'template' view
          $scope.preSelectProductProfileCheckBox = utility.castArrayToObject($scope.appConfig.facility.selectedProductProfiles, 'uuid');

          $scope.moveTo(nextStep);

        })
        .catch(function() {
          $scope.disableBtn = false;
          $scope.isSubmitted = false;
          $scope.profileNotFound = true;
        });
    };

    // Methods/Props dedicated to 'Edit Config'
    function preLoadConfigForm(appConfig) {
      if (appConfig === undefined) {
        return;
      }

      if (utility.has(appConfig, 'lastUpdated')) {
        var updatedDate = $filter('date')(new Date(appConfig.lastUpdated), 'yyyy-MM-dd HH:mm:ss');
        $scope.lastUpdated = messages.lastUpdated(updatedDate);
      } else {
        $scope.lastUpdated = messages.lastUpdated('N/A');
      }

      $scope.appConfig.facility.selectedProductProfiles = appConfig.facility.selectedProductProfiles || [];
      $scope.appConfig.selectedCcuProfiles = appConfig.selectedCcuProfiles || [];
      $scope.appConfig.facility.selectedLgas = appConfig.facility.selectedLgas || [];
      $scope.appConfig.facility.selectedZones = appConfig.facility.selectedZones || [];
      $scope.preSelectLgaCheckBox = $scope.appConfig.facility.selectedLgas.reduce(function(sum, item) {
        sum[item.uuid] = true;
        return sum;
      }, {});
      $scope.lgaCheckBoxes = angular.copy($scope.preSelectLgaCheckBox);

      $scope.preSelectZoneCheckBox = utility.castArrayToObject($scope.appConfig.facility.selectedZones, '_id');

      $scope.preSelectCcuProfiles = utility.castArrayToObject(appConfig.selectedCcuProfiles, 'dhis2_modelid');
      $scope.preSelectProductProfileCheckBox = utility.castArrayToObject($scope.appConfig.facility.selectedProductProfiles, 'uuid');
    }

    var oldLgas = [];
    if(isEdit) {
      //console.log(appConfig);
      if (utility.has(appConfig.facility, 'selectedLgas')) {
        oldLgas = angular.copy(appConfig.facility.selectedLgas);
      }

      preLoadConfigForm(appConfig);

      $scope.developerMode = false;
      $rootScope.developerMode = false;
    }

    var noOfAttempts = 0;
    $scope.enterDeveloperMode = function() {
      var MAX_ATTEMPTS = 5;
      noOfAttempts = noOfAttempts + 1;
      if (MAX_ATTEMPTS <= noOfAttempts) {
        $rootScope.developerMode = true;
        $scope.developerMode = true;
        noOfAttempts = 0;
      }
    };


    var isSameLgas = function(old, recent) {
      if (old.length !== recent.length) {
        return false;
      }
      var hasOddElem = true;
      recent.forEach(function(rLga) {
        var similar = old.filter(function(oLga) {
          return rLga._id === oLga._id;
        });
        if (similar.length === 0) {
          hasOddElem = false;
        }
      });
      return hasOddElem;
    };


    // Save Methods:
    $scope.save = function() {
      $scope.isSaving = true;
      var nearbyLgas = $scope.appConfig.facility.selectedLgas
        .map(function(lga) {
          if (lga._id) {
            return lga._id;
          }
        });

      var loadLga;
      if(isEdit && isSameLgas(oldLgas, $scope.appConfig.facility.selectedLgas)) {
        loadLga = $q.when(true);
      } else {
        loadLga = fixtureLoaderService.setupWardsAndFacilitesByLgas(nearbyLgas);
      }

      loadLga
        .then(function() {
          return appConfigService.setup($scope.appConfig);
        })
        .then(function(result) {
          if (typeof result !== 'undefined') {
            $scope.appConfig = result;
            alertFactory.success(messages.appConfigSuccessMsg);
            $state.go('home.index.home.mainActivity');
          } else {
            growl.error(messages.appConfigFailedMsg);
          }
        }).catch(function(reason) {
          if(!isEdit) {
            return growl.error(messages.appConfigFailedMsg);
          }

          if (utility.has(reason, 'type') && reason.type === 'SAVED_NOT_SYNCED') {
            alertFactory.success(messages.appConfigSuccessMsg);
            $state.go('home.index.home.mainActivity');
            console.info('not synced');
          } else {
            growl.error(messages.appConfigFailedMsg);
            console.error(reason);
          }
        }).finally(function() {
          $scope.isSaving = false;
        });
    };
  });
