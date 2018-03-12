require('dotenv').config();


const mysql = require('mysql');
const opts  = {
    host :      process.env.DB_HOST,
    user :      process.env.DB_USERNAME,
    password  : process.env.DB_PASSWORD,
    database  : process.env.DB
};

function connection() {
    return mysql.createConnection({
        host :      process.env.DB_HOST,
        user :      process.env.DB_USERNAME,
        password  : process.env.DB_PASSWORD,
        database  : process.env.DB

    });
}

const dao = {};


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

dao.saveUser = function(username, password_hash) {
  return new Promise((resolve, reject) => {
        const con = connection();
        con.query("INSERT INTO user (username, password) values ('" + username + "', '" + password_hash + "')",
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

dao.allPosts = function () {
  return new Promise((resolve, reject) => {
        const con = connection();
        con.query("SELECT * FROM post ORDER BY id DESC",
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
