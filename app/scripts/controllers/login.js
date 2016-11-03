'use strict'

angular.module('lmisChromeApp')
  .controller('LoginController', function (LoginService, $uibModal) {
    var vm = this;

    vm.username = '';
    vm.password = '';
    init();

    vm.openOnboardingModal = function () {
      $uibModal.open({
        backdrop: 'static',
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/onboarding/onboarding.html',
        controller: 'OnboardingController',
        controllerAs: 'onboardingCtrl',
        size: 'modal-lg'
      });
    };

    vm.openOnboardingModal();

    vm.cleanUp = function () {
      vm.isAuthenticating = false;
    };

    vm.onLoginError = function (loginErr) {
      if (loginErr.status === 401) {
        vm.wrongCredential = true;
      } else {
        // assume login error is because server is not reachable
        vm.cannotReachServer = true;
      }
    };

    vm.submit = function () {
      init();
      vm.isAuthenticating = true;
      if (!vm.username || !vm.password) {
        vm.cleanUp();
        return;
      }
      return LoginService.login(vm.username, vm.password)
        .then(console.info.bind(console))
        .catch(vm.onLoginError)
        .finally(vm.cleanUp);
    };

    function init () {
      vm.isAuthenticating = false;
      vm.wrongCredential = false;
      vm.cannotReachServer = false;
    }

  });
