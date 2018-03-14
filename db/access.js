'use strict';

/* TODO: Move towards exporting something like '{Post: ..., User: ... }' */

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
      db   = new DB(opts),
      BaseRow    = db.Row,
      BaseTable  = db.Table;

const dao = {};


// Add models
db.add(require('../models/commentPost.js'));
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
        cps.rescue({
            'try'   : function() {
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
            },
            'catch' : function(err, cb) {
                cb("catch: " + err, null);
            }
        }, cb);
    }, cb);
};

dao.getComments = function(id, cb) {
    const Post = db.get('post');

    db.connect(function(conn, cb) {
        cps.rescue({
            'try'   : function() {
                 cps.seq([
                    function(_, cb) {
                        console.log(id);
                        Post.Table.findById(conn, id, cb);
                    },
                    function(post, cb) {
                        console.log(post);
                        post.getComments(conn, cb);
                    },
                    function(comments, cb) {
                        cb(null, comments)
                    }
                ], cb);
            },
            'catch' : function(err, cb) {
                cb("catch: " + err, null);
            }
        }, cb);
    }, cb);
}

const mysql = require('mysql');

function connection() {
    return mysql.createConnection({
        host :      process.env.DB_HOST,
        user :      process.env.DB_USERNAME,
        password  : process.env.DB_PASSWORD,
        database  : process.env.DB

    });
}



dao.findUser = function(username) {
    return new Promise((resolve, reject) => {
        const con = connection();
        con.query("SELECT * FROM user WHERE user.username = '" + username + "'",
            function (error, results, fields) {
                con.destroy();
                if (error) reject(error);

                resolve(results);
            }
        )
    })
};

dao.saveUser = function(username, email, password_hash) {
  return new Promise((resolve, reject) => {
        const con = connection();
        con.query("INSERT INTO user (username, password, email) values ('" + username + "', '" + password_hash + "', '" + email + "')",
            function (error, results, fields) {
                con.destroy();
                if (error) reject(error);

                resolve(results);
            }
        )
    })
};

dao.allUsers = function() {
  return new Promise((resolve, reject) => {
        const con = connection();
        con.query("SELECT username FROM user",
            function (error, results, fields) {
                con.destroy();
                if (error) reject(error);

                resolve(results);
            }
        )
    })
};

dao.savePost = function (username, content) {
    return new Promise((resolve, reject) => {
        const con = connection();
        let mm, dd, yyyy, date_str, date = new Date();
        mm   = date.getMonth() + 1;
        dd   = date.getDate();
        yyyy = date.getFullYear();
        date_str = yyyy + '-' + mm + '-' + dd;
        con.query("INSERT INTO post (user_username, content, posted) values ('" + username + "', '" + content + "', '" + date_str + "')",
            function (error, results, fields) {
                con.destroy();
                if (error) reject(error);

                resolve(results);
            }
        )
    })
};

dao.likesForPost = function (post_id) {
  return new Promise((resolve, reject) => {
        const con = connection();
        con.query("SELECT * FROM post_like WHERE post_id = " + post_id,
            function (error, results, fields) {
                con.destroy();
                if (error) reject(error);

                resolve(results);
            }
        )
    })
};

module.exports = dao;
