'use strict'

angular.module('lmisChromeApp')
  .config(function (ehaGoogleAnalyticsProvider, config) {
    ehaGoogleAnalyticsProvider.trackingID = config.analytics.propertyID
  })
