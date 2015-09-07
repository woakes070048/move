'use strict'

angular.module('lmisChromeApp')
  .service('pouchStorageService', function (pouchDB, utility, config) {
    this.put = function (db, data) {
      db = pouchDB(db)
      return db.put(data, data.uuid)
    }

    this.allDocs = function (db) {
      db = pouchDB(db)
      return db.allDocs({
        include_docs: true
      })
        .then(function (result) {
          return utility.pluck(result.rows, 'doc')
        })
    }

    this.get = function (db, id) {
      db = pouchDB(db)
      return db.get(id)
    }

    this.remove = function (db, id, rev) {
      db = pouchDB(db)
      return db.remove(id, rev)
    }

    this.destroy = function (db) {
      db = pouchDB(db)
      return db.destroy()
    }

    this.bulkDocs = function (db, docs) {
      db = pouchDB(db)
      return db.bulkDocs(docs)
    }

    this.getRemoteDB = function (dbName) {
      var REMOTE_URI = [config.api.url, '/', dbName].join('')
      return pouchDB(REMOTE_URI)
    }

    this.compact = function (db) {
      db = pouchDB(db)
      return db.compact()
    }

    this.viewCleanup = function (db) {
      db = pouchDB(db)
      return db.viewCleanup()
    }

    this.query = function (db, view, options) {
      db = pouchDB(db)
      return db.query(view, options)
        .then(function (res) {
          return res.rows
            .map(function (r) {
              if (options.include_docs) {
                return r.doc
              } else {
                return r.value
              }
            })
        })
    }
  })
