'use strict'

angular.module('lmisChromeApp')
  .config(function (ehaCounterProvider, notificationServiceProvider) {
    var notificationService = notificationServiceProvider.$get()
    var vibrate = notificationService.vibrate.bind(null, 50)
    ehaCounterProvider.increment = ehaCounterProvider.decrement = vibrate
  })
