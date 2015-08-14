'use strict';

angular.module('lmisChromeApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('appConfig', {
        parent: 'root.index',
        abstract: true,
        templateUrl: 'views/home/index.html'
      });
  });
