'use strict'

angular.module('lmisChromeApp')
  .controller('OnboardingController', function ($uibModalInstance) {
    var vm = this;

    vm.close = function () {
      $uibModalInstance.close('continue to next step');
    };

  });
