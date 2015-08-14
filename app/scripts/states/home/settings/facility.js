'use strict';

angular.module('lmisChromeApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('home.index.settings.facility', {
        url: '/facility',
        templateUrl: 'views/home/settings/facility.html',
        controller: function($scope, settings) {
          $scope.facility = settings.facility;
        }
      });
  });
