'use strict'

angular.module('lmisChromeApp')
  .service('LoginService', function (ehaLoginService, storageService) {
    var self = this;

    self.login = function (username, password) {
      return ehaLoginService.login(username, password);
    };

  });
