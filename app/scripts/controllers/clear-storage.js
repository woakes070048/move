'use strict';

angular.module('lmisChromeApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('clearStorage', {
        parent: 'root.index',
        url: '/clear-storage',
        controller: 'ClearStorage'
      });
  })
  .controller('ClearStorage', function($scope, storageService, $state, backgroundSyncService, cacheService, $q, alertFactory, notificationService, messages, memoryStorageService, fixtureLoaderService, growl) {
    $scope.clearAndLoadFixture = function() {
      var deferred = $q.defer();
      backgroundSyncService.cancel();
      cacheService.clearCache();
      memoryStorageService.clearAll();
      storageService.clear()
        .then(function() {
          //reload fixtures into memory store.
          fixtureLoaderService.setupLocalAndMemoryStore(fixtureLoaderService.REMOTE_FIXTURES)
            .then(function() {
              $state.go('appConfigWelcome');
            })
            .catch(function(reason) {
              console.error(reason);
              growl.error(reason, {ttl: -1});
            });
        })
        .catch(function(reason) {
          growl.error(messages.clearStorageFailed, {ttl: -1});
          console.error(reason);
        });
      return deferred.promise;
    };

    var confirmationTitle = messages.clearStorageTitle;
    var confirmationQuestion = messages.clearStorageConfirmationMsg;
    var buttonLabels = [messages.yes, messages.no];
    notificationService.getConfirmDialog(confirmationTitle, confirmationQuestion, buttonLabels)
      .then(function(isConfirmed) {
        if (isConfirmed === true) {
          $scope.clearAndLoadFixture();
          $state.go('loadingFixture');
        } else {
          $state.go('home.index.home.mainActivity');
        }
      })
      .catch(function(reason) {
        console.error(reason);
        $state.go('home.index.home.mainActivity');
      });
  });
