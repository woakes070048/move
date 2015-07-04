describe('Controller: AppConfig', function() {
  'use strict';

  var scope;
  var $q;
  var element;
  var controller;
  var productProfileFactory;
  var ccuProfileFactory;


  function hasElement(element, query) {
    var elements = element.querySelectorAll(query);
    return elements.length >= 1;
  }

  function hasQa(element, qa) {
    return hasElement(element, '[data-qa=' + qa + ']');
  }


  beforeEach(module('lmisChromeApp', 'lmisChromeApp.templates', 'memoryStoreMocks'));

  beforeEach(inject(function(
    $rootScope,
    _$q_,
    $templateCache,
    $compile,
    memoryStorageService,
    memoryStoreMock,
    _productProfileFactory_,
    _ccuProfileFactory_
  ) {
    scope = $rootScope.$new();
    $q = _$q_;
    productProfileFactory = _productProfileFactory_;
    ccuProfileFactory = _ccuProfileFactory_;

    // Set up memoryStorage Mocks
    spyOn(memoryStorageService, 'get').andCallFake(function(dbName, uuid){
      var db = memoryStoreMock.memoryStore[dbName];
      if(typeof db === 'object'){
        return db[uuid];
      }
    });

    spyOn(memoryStorageService, 'getDatabase').andCallFake(function(dbName){
      return memoryStoreMock.memoryStore[dbName];
    });
  }));

  afterEach(function() {
    try {
      if(element) {
        element.parentNode.removeChild(element);
        element = null;
      }
    } catch(e) {
      console.log('Removing element failed', e);
    }
  });

  describe('Initial Setup', function() {
    beforeEach(inject(function($templateCache, $compile, $controller) {
      controller = $controller('AppConfigWizard', {
        appConfig: {
          uuid: 'my.email.address@eoc.org',
          facility: { },
          contactPerson: {
            name: '',
            phoneNo: ''
          },
          selectedCcuProfiles: [],
          dateActivated: undefined
        },
        isEdit: false,
        $scope: scope,
        $state: {
          go: jasmine.createSpy('switching state')
        },
        ccuProfilesGroupedByCategory: ccuProfileFactory.getAllGroupedByCategory(),
        lgaList: [],
        productProfilesGroupedByCategory: productProfileFactory.getAllGroupedByCategory(),
        zones: []
      });

      var template = $templateCache.get('views/app-config/wizard.html');
      // this returns an angular element
      var $element = $compile(template)(scope);
      element = document.createElement('div');
      for(var i = 0; i < $element.length; i++) {
        element.appendChild($element[i]);
      }

      document.body.appendChild(element);
      scope.$digest();
    }));

    it('does an initial setup', function() {
      expect(hasQa(element, 'wizard-one')).toEqual(true);
    });
  });

  describe('Display/Edit App Config', function() {
    beforeEach(inject(function($templateCache, $compile, $controller) {
      controller = $controller('AppConfigWizard', {
        appConfig: {
          uuid: 'my.email.address@eoc.org',
          facility: { },
          contactPerson: {
            name: '',
            phoneNo: ''
          },
          selectedCcuProfiles: [],
          dateActivated: undefined
        },
        isEdit: true,
        $scope: scope,
        $state: {
          go: jasmine.createSpy('switching state')
        },
        ccuProfilesGroupedByCategory: ccuProfileFactory.getAllGroupedByCategory(),
        lgaList: [],
        productProfilesGroupedByCategory: productProfileFactory.getAllGroupedByCategory(),
        zones: []
      });

      var template = $templateCache.get('views/app-config/edit-configuration.html');
      // this returns an angular element
      var $element = $compile(template)(scope);
      element = document.createElement('div');
      for(var i = 0; i < $element.length; i++) {
        element.appendChild($element[i]);
      }

      document.body.appendChild(element);
      scope.$digest();
    }));

    it('does an initial setup', function() {
      expect(hasQa(element, 'edit-config')).toEqual(true);
    });
  });
});
