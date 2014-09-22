'use strict';

var path = require('path')
    , basename = path.basename(__filename, '.js')
    , debug = require('debug')('castor:routes:' + basename)
    , util = require('util')
    , datamodel = require('datamodel')
    , pmongo = require('promised-mongo')
    , struct = require('object-path')
    , CSV = require('csv-string')
    ;

module.exports = function(config) {
    var coll = pmongo(config.get('connexionURI')).collection(config.get('collectionName'));

    return datamodel()
        .declare('site', function(req, fill) {
            fill({
                title : config.get('title'),
                description : config.get('description')
            });
        })
        .declare('headers', function(req, fill) {
            var headers = {};
            headers['Content-Type'] = require('../helpers/format.js')(req.params.format);
            if (req.params.format === 'zip') {
                headers['Content-Disposition'] = 'attachment; filename="export.zip"';
            }
            fill(headers);
        })
        .declare('page', function(req, fill) {
            fill({
                title : 'Export some fields',
                description : null,
                types : ['text/csv', 'application/json']
            });
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
        .declare('parameters', function(req, fill) {
            if ( ! Array.isArray(req.query.field)) {
                req.query.field = typeof req.query.field  === 'string' ? [req.query.field] : [];
            }
            fill({
                fields : req.query.field.map(function(x) {return x.replace(/[^\w\._$]/g, '');}) || ['wid']
                , format: req.params.format
                , startPage: Number(req.query.page || 1)
                , nPerPage: Number(req.query.count || config.get('itemsPerPage'))
            });
        })
        .append('items', function(req, fill) {
            coll.find().toArray().then(fill).catch(fill);
        })
        .transform(function(req, fill) {
            var n = this, r = [];
            r.push(n.parameters.fields);
            this.items.each(function(e) {
                if (n.parameters.fields.length > 0) {
                    r.push(n.parameters.fields.map(function(x) {
                            var y = struct.get(e, x);
                            if (y === null || y === undefined) {
                                return undefined;
                            }
                            else if (typeof y === 'string' ||  typeof y === 'number' || y instanceof Date ) {
                                return y;
                            }
                            else {
                                return undefined;
                            }
                        })
                    );
                }
            });
            n.items = r;
            fill(n);
        })
        .send(function(res, next) {
            var self = this;
            if (self.page.types.indexOf(self.headers['Content-Type']) === -1) {
                next();
            }
            else if (self.headers['Content-Type'] === 'text/csv') {
                res.type(self.headers['Content-Type']).send(CSV.stringify(self.items)).end();
            }
            else if (self.headers['Content-Type'] === 'application/json') {
                res.json(self.items);
            }
            else {
                next();
            }
        })
        .takeout();
}
