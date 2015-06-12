'use strict';

angular.module('lmisChromeApp')
  .service('locationService', function(storageService, $http, ehaRetriable, config, pouchStorageService) {
    var service = this;
    this.KANO_UUID = 'f87ed3e017cf4f8db26836fd910e4cc8';

    // This doc is used to find by type (lga, ward, zone)
    // and parent in the locations db
    var doc = {
      _id: '_design/type',
      views: {
        by_type: {
          map: function(doc) {
            if(!doc.doc_type) {
              return;
            }

            // note: never emit the full document,
            // you can get it with include_docs: true
            emit([doc.doc_type, doc.parent], null);
          }.toString()
        }
      }
    };
    // Put the design doc above
    pouchStorageService.get(storageService.LOCATIONS, doc._id)
      .catch(function(err) {
        if(err.status === 404) {
          return {};
        }
      })
      .then(function(res) {
        // return here if view isn't changed,
        // to avoid re-indexing
        if(res.views && res.views.by_type.map === doc.views.by_type.map) {
          return;
        }

        if(res._rev) {
          doc._rev = res._rev;
        }

        return pouchStorageService.put(storageService.LOCATIONS, doc);
      });

    this.getLgas = function(stateId) {
      return pouchStorageService.query(storageService.LOCATIONS, 'type/by_type', {
          startkey: ['lga', stateId],
          endkey: ['lga', stateId],
          include_docs: true
        })
        .then(function(items) {
          return items.sort(sort);
        });
    };

    this.getWards = function(lgaId) {
      return pouchStorageService.query(storageService.LOCATIONS, 'type/by_type', {
          startkey: ['ward', lgaId],
          endkey: ['ward', lgaId],
          include_docs: true
        })
        .then(function(items) {
          return items.sort(sort);
        });
    };

    this.getZones = ehaRetriable(function(stateId){
       return $http.get(config.api.url + '/locations/_design/zones/_view/by_id', {
           withCredentials: true
         })
         .then(function(result){
           return result.data.rows.map(function(row){
             return row.value;
           });
         })
         .then(function(zones) {
           // save zones
           service.saveBatch(zones);
           return zones;
         })
         .catch(function(err) {
           // check offline status
           if(err.status === 0) {
             // get the ones we have locally
             return pouchStorageService.query(storageService.LOCATIONS, 'type/by_type', {
                  startkey: ['zone', stateId],
                  endkey: ['zone', stateId],
                  include_docs: true
                });
           }

           // if not rethrow for retriable to catch it
           throw err;
         });
    });
    this.saveBatch = function(locations) {
      return storageService.setDatabase(storageService.LOCATIONS, locations);
    };

    var sort = function(a, b) {
      var aName = a.name.toLowerCase();
      var bName = b.name.toLowerCase();
      if (aName < bName) {
        return -1;
      } else if (aName > bName) {
        return  1;
      } else {
        return 0;
      }
    };

  });
