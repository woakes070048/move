'use strict';

angular.module('lmisChromeApp')
  .factory('facilityFactory', function(storageService) {

    var getByUUID = function(uuid) {
      return storageService.find(storageService.FACILITY, uuid);
    };

    var getAllFacilities = function() {
      return storageService.all(storageService.FACILITY);
    };

    var saveBatch = function(facilities) {
      return storageService.setDatabase(storageService.FACILITY, facilities);
    };

    var getFacilities = function(facilityIds) {
      return getAllFacilities()
        .then(function(hfs) {
          return hfs.filter(function(hf) {
            return facilityIds.indexOf(hf.uuid) !== -1;
          });
        });
    };

    var find = function(filter){
      return getAllFacilities()
        .then(function(r){
          return filter(r);
        });
    };

    var removeFacilityUnderLgaId = function(lgaIds) {
      return getAllFacilities()
          .then(function(res){
            var toBeRemoved = [];
            var facility;
            for(var i = 0; i < res.rows; i++){
              facility = res.rows[i].doc;
              if(lgaIds.indexOf(facility.lgaUUID)){
                facility._deleted = true;//mark for deletion
                toBeRemoved.push(facility);
              }
            }
            return saveBatch(toBeRemoved);
          })
    };

    var getFacilityByType = function(type){
      return getAllFacilities()
          .then(function (facilities) {
            return facilities.filter(function (facility) {
                  return facility.doc_type === type;
                });
          });
    };

    return {
      getAll: getAllFacilities,
      get: getByUUID,
      saveBatch: saveBatch,
      getFacilities: getFacilities,
      find: find,
      removeByLgaIds: removeFacilityUnderLgaId,
      getByType: getFacilityByType
    };

  });
