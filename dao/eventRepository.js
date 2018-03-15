'use strict';

require('dotenv').config();

const opts = {
    host :      process.env.DB_HOST,
    user :      process.env.DB_USERNAME,
    password  : process.env.DB_PASSWORD,
    database  : process.env.DB
};

const nodeMysql  = require('node-mysql'),
      cps  = require('cps'),
      DB   = nodeMysql.DB,
      db   = new DB(opts);


/* Data access functions for 'event' */
db.add(require('../models/eventSubscriber.js'));
db.add(require('../models/user.js'));
db.add(require('../models/event.js'))
    .relatesTo({
        "name"     : "subscribers",
        "through"  : "event_subscriber",
        "table"    : "user",
        "leftKey"  : "org_id",
        "rightKey" : "sub_id"
    });

const findAll = function(cb) {
    const Event = db.get('event');

    db.connect(function(conn, cb) {
        cps.seq([
            function(_, cb) {
                Event.Table.findAll(conn, cb);
            },
            function(events, cb) {
                cb(null, events);
            }
        ], cb);
    }, cb);
};

const save = function(org, sub, msg, cb) {
    const Event = db.get('event');

    db.connect(function(conn, cb) {
        cps.seq([
            function(_, cb) {
               Event.Table.create(conn, {
                    "org_name" : org,
                    "message"  : msg,
               }, cb);
            },
            function(event, cb) {
                cps.peach(
                    sub,
                    function(elem, cb) {
                        cps.seq([
                            function(_, cb) {
                                event.addSubscriber(conn, elem, cb);
                            },
                        ], cb)
                    }, cb);
            },
            function(results, cb) {
                cb(null, results);
            }
        ], cb)
    }, cb)
};

module.exports = { save, findAll };


