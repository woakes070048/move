'use strict'

angular.module('lmisChromeApp')
  .config(function (pouchDBProvider, POUCHDB_METHODS) {
    // expose login method to angular
    POUCHDB_METHODS.login = 'qify'
  })
