'use strict'

angular.module('lmisChromeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('clearStorage', {
        parent: 'root.index',
        url: '/clear-storage',
        controller: 'ClearStorage'
      })
  })
  .controller('ClearStorage', function ($scope, storageService, $state, backgroundSyncService, cacheService, $q, alertFactory, notificationService, messages, memoryStorageService, fixtureLoaderService, toastr, ehaLoginService) {
    $scope.clearAndLoadFixture = function () {
      var deferred = $q.defer()
      backgroundSyncService.cancel()
      cacheService.clearCache()
      memoryStorageService.clearAll()
      storageService.clear()
        .then(function () {
          // reload fixtures into memory store.
          return fixtureLoaderService.setupLocalAndMemoryStore(fixtureLoaderService.REMOTE_FIXTURES)
        })
        .then(function () {
          return ehaLoginService.logout()
        })
        .catch(function (reason) {
          toastr.error(messages.clearStorageFailed, {ttl: -1})
          console.error(reason)
        })
        .finally(function () {
          $state.go('loadingFixture')
        })
      return deferred.promise
    }

    var confirmationTitle = messages.clearStorageTitle
    var confirmationQuestion = messages.clearStorageConfirmationMsg
    var buttonLabels = [messages.yes, messages.no]
    notificationService.getConfirmDialog(confirmationTitle, confirmationQuestion, buttonLabels)
      .then(function (isConfirmed) {
        if (isConfirmed === true) {
          $scope.clearAndLoadFixture()
        } else {
          $state.go('home.mainActivity')
        }
      })
      .catch(function (reason) {
        console.error(reason)
        $state.go('home.mainActivity')
      })
  })
