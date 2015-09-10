'use strict'

angular.module('lmisChromeApp')
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
