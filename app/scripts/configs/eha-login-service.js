'use strict'

angular.module('lmisChromeApp')
  .config(function (ehaLoginServiceProvider, config) {
    // Use appConfig as 'main' database, since the login plugin
    // wants to connect to a specific DB
    var url = config.api.url + '/app_config'

    ehaLoginServiceProvider.config(url)
  })
