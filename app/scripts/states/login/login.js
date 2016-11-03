'use strict'

angular.module('lmisChromeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('Login', {
        url: '/login',
        templateUrl: 'views/login/login.html',
        controller: 'LoginController as loginCtrl'
      });
  })
