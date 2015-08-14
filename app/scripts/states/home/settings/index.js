'use strict';

angular.module('lmisChromeApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('home.index.settings', {
        url: '/settings',
        abstract: true,
        templateUrl: 'views/home/settings.html',
        resolve: {
          settings: function(settingsService) {
            return settingsService.load();
          }
        },
        controller: function($scope, settings, settingsService, growl, messages, utility) {
          var fields = ['facility', 'inventory'];
          for (var i = fields.length - 1; i >= 0; i--) {
            if (!utility.has(settings, fields[i])) {
              settings[fields[i]] = {};
            }
          }

          $scope.settings = settings;
          $scope.save = function(settings) {
            settingsService.save(settings)
              .then(function() {
                growl.success(messages.settingsSaved);
              })
              .catch(function() {
                growl.success(messages.settingsFailed);
              });
          };
        }
      });
  });
