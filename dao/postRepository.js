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

db.add(require('../models/commentPost.js'));

db.add(require('../models/post.js'))
    .relatesTo({
        "name"     : "comments",
        "through"  : "comment_post",
        "table"    : "post",
        "leftKey"  : "post_id",
        "rightKey" : "comment_id"
    });

db.add(require('../models/user.js'));


const Post = db.get('post');

const findAllLimit = (start_index, limit, cb) => {
    let posts;
    db.connect((conn, cb) => {
        cps.seq([
            (_, cb) => {
                Post.Table.find(conn, 'select * from post where has_replies = 1 order by id desc limit ' + limit + ' offset ' + start_index, cb);
            },
            (results, cb) => {
                posts = results;
                cb(null, posts);
            }
        ], cb);
    }, cb);
};

const findById = (id, cb) => {
    let post = {};
    db.connect((conn, cb) => {
        cps.seq([
            (_, cb) => {
                Post.Table.find(conn, 'select * from post where has_replies = 1 and id = ' + id, cb);
            },
            (results, cb) => {
                post.post = results[0];
                results[0].getComments(conn, cb);
            },
            (results, cb) => {
                post.comments = results;
                cb(null, post);
            }
        ], cb);
    }, cb);
};


module.exports = { findAllLimit, findById };
