'use strict'

angular.module('lmisChromeApp')
  .controller('LoginCtrl', function ($scope, $modalInstance, modalParams, ehaLoginService, deviceInfoFactory) {
    $scope.headerMessage = !angular.isArray(modalParams.title) ? modalParams.title : ''
    $scope.headerMessage2 = modalParams.title
    $scope.bodyMessage = modalParams.bodyText
    $scope.confirmBtnMsg = modalParams.buttonLabels.YES
    $scope.cancelBtnMsg = modalParams.buttonLabels.NO
    $scope.confirm = $modalInstance.close
    $scope.cancel = $modalInstance.dismiss
    $scope.wrongPasskey = false
    $scope.dismissMessage = 'Cancel confirm dialog'
    $scope.online = true
    deviceInfoFactory.getDeviceInfo()
      .then(function (result) {
        $scope.username = result.mainAccount
      })

    $scope.authenticate = function (username, passkey) {
      $scope.wrongPasskey = false
      $scope.cannotReachServer = false

      if (!username || !passkey) {
        $scope.wrongPasskey = true
        return
      }

      return ehaLoginService.login(username, passkey)
        .then($modalInstance.close)
        .catch(function (err) {
          // TODO: allow to dismiss / cancel if user wants to keep
          //       using the app

          // pw is wrong, update form with error, ask to enter again
          if (err.status === 401) {
            $scope.wrongPasskey = true
          // Server is unreachable/phone is offline
          } else {
            $scope.cannotReachServer = true
          }

          console.log('error', err)
        })
    }

    console.log($scope.cannotReachServer)

    $scope.cancel = function () {
      $modalInstance.dismiss('cancelled')
    }
  })
  .service('loginDialogService', function ($modal, $log, $q, gettextCatalog) {
    /*
     * The loginDialogService caches the modal that is currently shown
     * to be able to call multiple retriables, while not showing more
     * than one modal
     */
    var dialog
    return function loginDialog () {
      if (dialog) {
        return dialog
      }

      var buttonLabels = [
        gettextCatalog.getString('yes'),
        gettextCatalog.getString('no')
      ]

      var confirmDialog = $modal.open({
        templateUrl: 'views/login/login.html',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          modalParams: function ($q) {
            return $q.when({
              buttonLabels: {
                YES: buttonLabels[0],
                NO: buttonLabels[1]
              }
            })
          }
        },
        controller: 'LoginCtrl'
      })

      dialog = confirmDialog.result
      confirmDialog.result.finally(function () {
        dialog = null
      })

      return confirmDialog.result
    }
  })
