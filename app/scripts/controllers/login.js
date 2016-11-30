'use strict'

angular.module('lmisChromeApp')
  .controller('LoginController', function (LoginService, $uibModal,  $rootScope, $stateParams) {
    var vm = this;
    var showOnboarding = $stateParams.onboarding;
    var redirectTo = $stateParams.redirectTo;

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

    if (showOnboarding == 'true') {
      vm.openOnboardingModal();
    }

    vm.cleanUp = function () {
      vm.isAuthenticating = false;
    };

    /**
     *
     * @param loggedInUserArray {Array} - e.g [username, password]
     */
    vm.onLoginSuccess = function (loggedInUserArray) {
      var loggedInUsername = loggedInUserArray[0];
      var password = loggedInUserArray[1];
      var eventData = {username: loggedInUsername, password: password, redirectTo: redirectTo};
      $rootScope.$broadcast(LoginService.EVENT.LOGIN_SUCCESS, eventData);
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
        .then(vm.onLoginSuccess)
        .catch(vm.onLoginError)
        .finally(vm.cleanUp);
    };

    function init () {
      vm.isAuthenticating = false;
      vm.wrongCredential = false;
      vm.cannotReachServer = false;
    }

  });
