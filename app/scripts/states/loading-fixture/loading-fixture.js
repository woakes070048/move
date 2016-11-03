'use strict';

angular.module('lmisChromeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('loadingFixture', {
        templateUrl: 'views/loading-fixture/index.html',
        url: '/loading-fixture'
      })
  });
