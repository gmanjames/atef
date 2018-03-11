require('dotenv').config();


const mysql = require('mysql');
const con   = mysql.createConnection({
    host :      process.env.DB_HOST,
    user :      process.env.DB_USERNAME,
    password  : process.env.DB_PASSWORD,
    database  : process.env.DB

})

const dao = {};


dao.findUser = function(username) {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM user WHERE user.username = '" + username + "'",
            function (error, results, fields) {
                if (error) reject(error);

                resolve(results);
            }
        )
    })
}

module.exports = dao;
