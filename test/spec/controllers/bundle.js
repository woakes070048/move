'use strict';

describe('Inventory controller', function () {
  // Load the controller's module
  beforeEach(module('lmisChromeApp'));

  beforeEach(inject(function ($templateCache) {
    // Mock each template used by the state
    var templates = [
      'index/index',
      'index/header',
      'index/footer',
      'home/index',
      'home/main-activity',
      'home/home',
      'index/loading-fixture-screen'
    ];

    angular.forEach(templates, function (template) {
      $templateCache.put('views/' + template + '.html', '');
    });
  }));

  var $state;
  beforeEach(inject(function(_$state_) {
    $state = _$state_;
  }));

  it('logBundleHome state should point to log-bundle-home url', function() {
    var state = $state.get('logBundleHome');
    expect($state.href(state)).toEqual('/log-bundle-home');
  });
});
