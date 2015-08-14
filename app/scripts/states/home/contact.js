'use strict';

angular.module('lmisChromeApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('contact', {
        parent: 'root.index',
        url: '/contact',
        templateUrl: 'views/home/contact.html'
      });
  });
