'use strict';

require('dotenv').config();

const opts = {
    host :      process.env.DB_HOST,
    user :      process.env.DB_USERNAME,
    password  : process.env.DB_PASSWORD,
    database  : process.env.DB
};

const nodeMysql  = require('node-mysql');
const cps  = require('cps');
const DB   = nodeMysql.DB;
const db   = new DB(opts);

db.add(require('../models/post.js'));

db.add(require('../models/user.js'));


const Post = db.get('post');

const findAllLimit = (start_index, limit, cb) => {
    let posts;
    db.connect((conn, cb) => {
        cps.seq([
            (_, cb) => {
                Post.Table.find(conn, 'select * from post order by id desc limit ' + limit + ' offset ' + start_index, cb);
            },
            (results, cb) => {
                posts = results;
                cb(null, posts);
            }
        ], cb);
    }, cb);
};

module.exports = { findAllLimit };
