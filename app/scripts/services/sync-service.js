'use strict';

angular.module('lmisChromeApp').service('syncService', function ($q, storageService, pouchdb, config, $window) {

  var isSyncing = false;

  var getLocalDB = function(dbUrl){
    return pouchdb.create(dbUrl);
  };

  var getRemoteDB = function(dbName){
    var REMOTE = config.api.url + '/' + dbName;
    return pouchdb.create(REMOTE);
  };

  var updateItemKeysAndUpdateLocalCopy = function(dbName, item, response){
    item._id = response.id;
    item._rev = response.rev;
    var updateModifiedDate = false;
    return storageService.update(dbName, item, updateModifiedDate);
  };

  var saveItem = function(dbName, db, item){
    var deferred = $q.defer();
    item.dateSynced = new Date().toJSON();//update sync date
    db.get(item.uuid).then(function (response) {
      item._id = response._id;
      item._rev = response._rev;
      db.put(item, response._id, response._rev)
      .then(function (result) {
        updateItemKeysAndUpdateLocalCopy(dbName, item, result);//FIXME: resolve this promise and return it.
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });

    }, function () {
      db.put(item, item.uuid)
      .then(function (result) {
        updateItemKeysAndUpdateLocalCopy(dbName, item, result); //FIXME: resolve this promise and return it.
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });

    });
    return deferred.promise;
  };

  this.syncItem = function(dbName, item){
    var deferred = $q.defer();
    if (isSyncing) {
      deferred.reject('Syncing is already in progress');
    }else if(!$window.navigator.onLine){
      deferred.reject('device is not online, check your internet connection settings.');
    }else{
      isSyncing = true;
      var remoteDB = getRemoteDB(dbName);
      remoteDB.info()
        .then(function(){
          saveItem(dbName, remoteDB, item).then(function(response){
            isSyncing = false;
            deferred.resolve(response);
          }, function(saveError){
            isSyncing = false;
            deferred.reject(saveError);
          });
        }, function(dbConError){
          isSyncing = false;
          deferred.reject(dbConError);
        });
    }
    return deferred.promise;
  };

  this.clearPouchDB = function(dbName){
    return getLocalDB(dbName).destroy();
  };

  this.addSyncStatus = function (objList) {
    //FIXME: consider passing property keys that will be used in comparism as function parameter.
    if (!angular.isArray(objList)) {
      throw 'an array parameter is expected.';
    }
    return objList.map(function (obj) {
      if (obj !== 'undefined') {
        obj.synced = (obj.dateSynced && obj.modified) &&  (new Date(obj.dateSynced) >= new Date(obj.modified));
        return obj;
      }
    });
  };

});