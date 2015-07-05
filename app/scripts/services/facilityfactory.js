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
      return storageService.insertBatch(storageService.FACILITY, facilities);
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
          .then(function(rows){
            var toBeRemoved = [];
            var facility;
            for(var i = 0; i < rows.length; i++){
              facility = rows[i];
              if(lgaIds.indexOf(facility.lgaUUID) !== -1){
                facility._deleted = true;//mark for deletion
                toBeRemoved.push(facility);
              }
            }
            return saveBatch(toBeRemoved);
          });
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
