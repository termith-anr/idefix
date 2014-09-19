/*jshint node:true, laxcomma:true */
'use strict';
var path = require('path')
    , basename = path.basename(__filename, '.js')
    , debug = require('debug')('castor:routes:' + basename)
    , util = require('util')
    , datamodel = require('datamodel')
    , pmongo = require('promised-mongo')
    ;
var map = function () {
    /* global emit */
    for (var key in this) { emit(key, null); }
};
var reduce = function (key, values) {
    return null;
};
module.exports = function(config) {
    var coll = pmongo(config.get('connexionURI')).collection(config.get('collectionName')) ;
    return datamodel()
        .declare('template', function(req, fill) {
            fill(basename + '.html');
        })
        .declare('site', function(req, fill) {
            fill({
                title : config.get('title'),
                description : config.get('description')
            });
        })
        .declare('page', function(req, fill) {
            fill({
                title : 'Overview documents',
                description : null,
                types : ['text/html', 'application/json']
            });
        })
        .declare('user', function(req, fill) {
            fill(req.user ? req.user : {});
        })
        .declare('config', function(req, fill) {
            fill(config.get());
        })
        .declare('url', function(req, fill) {
            fill(require('url').parse(req.protocol + '://' + req.get('host') + req.originalUrl));
        })
        .declare('selector', function(req, fill) {
            fill({ state: { $nin: [ "deleted", "hidden" ] } });
        })
        .append('totalItems', function(req, fill) {
            coll.find().count().then(fill).catch(fill);
        })
        .append('fields', function(req, fill) {
            var self = this;
            var opts = {
                out : {
                    replace: basename + '_fields'
                },
                query: self.selector
            };
            coll.mapReduce(map, reduce, opts).then(function(newcoll) {
                newcoll.find().toArray(function (err, res) {
                        fill(err ? err : res);
                    }
                );
            }).catch(fill);
        })
        .transform(function(req, fill) {
            var n = this;
            n.fields = this.fields.map(function(e) { return e._id; });
            fill(n);
        })
        .send(function(res, next) {
            render(res, this, next);
        }
    )
        .takeout();
};