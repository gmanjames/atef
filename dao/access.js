'use strict';

/* TODO: Move towards exporting something like '{Post: ..., User: ... }' */

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

const dao = {};

db.add(require('../models/eventSubscriber.js'));

db.add(require('../models/commentPost.js'));

db.add(require('../models/user.js'))
    .relatesTo({
        "name"     : "subscribed",
        "through"  : "event_subscriber",
        "table"    : "user",
        "leftKey"  : "sub_id",
        "rightKey" : "org_id"
    });
db.add(require('../models/post.js'))
    .relatesTo({
        "name"     : "comments",
        "through"  : "comment_post",
        "table"    : "post",
        "leftKey"  : "post_id",
        "rightKey" : "comment_id"
    });

dao.allPosts = function(cb) {
    const Post = db.get('post');

    db.connect(function(conn, cb) {
        cps.seq([
            function(_, cb) {
                Post.Table.find(conn, 'select * from post where has_replies = 1', cb);
            },
            function(post, cb) {
                cb(null, post);
            }
        ], cb);
    }, cb);
}

dao.createPost = function(username, content, media, id, has_replies, cb) {
    const Post = db.get('post');

    db.connect(function(conn, cb) {
         cps.seq([
            function(_, cb) {
                Post.Table.create(conn, {
                    'username' : username,
                    'content'  : content,
                    'media'    : media,
                    'has_replies' : (parseInt(has_replies) === 0 ? 0 : 1)
                }, cb);
            },
            function(post, cb) {
                if (parseInt(has_replies) === 0) {
                    post.addComment(conn, id, cb);
                } else {
                    cb(null, post);
                }
            }
        ], cb);
    }, cb);
};

dao.getComments = function(id, cb) {
    const Post = db.get('post');

    db.connect(function(conn, cb) {
         cps.seq([
            function(_, cb) {
                Post.Table.findById(conn, id, cb);
            },
            function(post, cb) {
                post.getComments(conn, cb);
            },
            function(comments, cb) {
                cb(null, comments)
            }
        ], cb);
    }, cb);
}

dao.findUser = function(username, cb) {
    const User = db.get('user');

    db.connect(function(conn, cb) {
         cps.seq([
            function(_, cb) {
                User.Table.find(conn, DB.format('select * from user where username = ?', [username]), cb);
            },
            function(user, cb) {
                cb(null, user)
            }
        ], cb);
    }, cb);
}

dao.createUser = function(username, email, password_hash, cb) {
    const User = db.get('user');

    db.connect(function(conn, cb) {
         cps.seq([
            function(_, cb) {
                User.Table.create(conn, {
                    'username' : username,
                    'email'    : email,
                    'password' : password_hash
                }, cb);
            },
            function(user, cb) {
                cb(null, user);
            }
        ], cb);
    }, cb);
}

dao.allUsers = function(cb) {
    const User = db.get('user');

    db.connect(function(conn, cb) {
        cps.seq([
            function(_, cb) {
                User.Table.findAll(conn, cb);
            },
            function(users, cb) {
                cb(null, users);
            }
        ], cb);
    }, cb);
};

dao.getSubscribed = function(id, cb) {
    const User = db.get('user');
    db.connect(function(conn, cb) {
        cps.seq([
            function(_, cb) {
                User.Table.findById(conn, id, cb);
            },
            function(user, cb) {
                user.relatesTo(conn, "subscribed", cb);
            },
            function(users, cb) {
                cb(null, users);
            }
        ], cb)
    }, cb);
};


module.exports = dao;
