'use strict'

angular.module('lmisChromeApp')
  .service('LoginService', function (ehaLoginService) {
    var self = this;

    self.EVENT = {
      LOGIN_SUCCESS: 'login-successful'
    };

    self.login = function (username, password) {
      return ehaLoginService.login(username, password);
    };

  });
