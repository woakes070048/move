'use strict'

angular.module('lmisChromeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login/:redirectTo/:onboarding',
        templateUrl: 'views/login/login.html',
        controller: 'LoginController as loginCtrl'
      });
  })
