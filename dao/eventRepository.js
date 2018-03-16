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

/**
 * API
 * - findAll:
 *      Get all entries of this type.
 * - save:
 *      Create a new row entry.
 */

db.add(require('../models/eventType.js'));

db.add(require('../models/eventSubscriber.js'));

db.add(require('../models/user.js'))
    .relatesTo({
        'name'     : 'events',
        'table'    : 'event',
        'through'  : 'event_subscriber',
        'leftKey'  : 'sub_id', // note the reverse order here
        'rightKey' : 'org_id'
    })
    .relatesTo({
        'name'     : 'events2',
        'table'    : 'event',
        'through'  : 'event_subscriber',
        'leftKey'  : 'org_id', // note the reverse order here
        'rightKey' : 'sub_id'
    });

db.add(require('../models/event.js'))

const User  = db.get('user');
const Event = db.get('event');

const findAll = function(cb) {
    let events;
    db.connect(function(conn, cb) {
        cps.seq([
            function(_, cb) {
                Event.Table.findAll(conn, cb);
            },
            function(results, cb) {
                events = results;
                cb(null, events);
            }
        ], cb);
    }, cb);
};

const findByOrgId = function(id, cb) {
    let events;
    db.connect(function(conn, cb) {
        cps.seq([
            function(_, cb) {
                /* I really need to fix this */
                User.Table.findById(conn, id, cb);
            },
            function(user, cb) {
                user.relatesTo(conn, 'events2', cb);
            },
            function(results, cb) {
                console.log(results);
                events = results;
                cb(null, events);
            }
        ], cb);
    }, cb);
};

const save = function(org, msg, cb) {
    db.connect(function(conn, cb) {
        cps.seq([
            function(_, cb) {

               Event.Table.create(conn, {
                    "org_id"   : org,
                    "message"  : msg
               }, cb);
            },
            function(results, cb) {
                cb(null, results);
            }
        ], cb)
    }, cb)
};

const unsubscribe = function(orgId, subId, cb) {
    db.connect(function(conn, cb) {
        cps.seq([
            function(_, cb) {
                conn.query('delete from event_subscriber where org_id = ' + orgId + ' and sub_id = ' + subId, cb);
            },
            function(results, cb) {
                cb(null, results);
            }
        ], cb);
    }, cb);
};

const subscribe = function(orgId, subId, cb) {
    const EventSubscriber = db.get('event_subscriber');
    db.connect(function(conn, cb) {
        cps.seq([
            function(_, cb) {
                conn.query('insert into event_subscriber (org_id, sub_id) values (' + orgId + ', ' + subId + ')', cb);
            },
            function(results, cb) {
                cb(null, results);
            }
        ], cb);
    }, cb);
};


module.exports = { save, findAll, findByOrgId, subscribe, unsubscribe };


