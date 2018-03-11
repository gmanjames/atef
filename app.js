'use strict';

require('dotenv').config();

const express    = require('express'),
      app        = express(),
      dao        = require('./db/access.js'),
      session    = require('express-session'),
      md5        = require('md5');
const bodyParser = require('body-parser')

const DEFAULT_PORT = process.env.DEFAULT_PORT;


app.use('/public', express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));

app.set('view engine', 'pug');


// APPLICATION ROUTES
app.get(["/", "/login"], (req, res) => {
    if (req.session.username) {
        res.redirect('/home');
    }
    res.render('begin');
});

app.get("/home", auth, (req, res) => {
    res.render('home', { username: req.session.username });
})

app.post('/login', (req, res) => {
    const usrname = req.body.username,
          passwd  = req.body.password;

    const str = usrname + ", " + passwd;

    dao.findUser(usrname).then((results) => {
        const u = results[0];

        if (u && u.password === md5(passwd)) {
            req.session.username = u.username;
            res.redirect('/home');
        } else {
            res.send('Incorrect username or password.');
        }
    }).catch((error) => {
        res.send('An error occurred: ' + error);
    });
});


app.get("/register", (req, res) => {
    res.render('register');
});

app.post("/register", (req, res) => {
    dao.findUser(req.body.username).then(results => {
        const u = results[0];

        if (u) {
            res.send("A user with the name '" + u.username + "' already exists!");
        } else {
            dao.saveUser(req.body.username, req.body.password).then(results => {
                req.session.username = req.body.username;
                res.redirect('/home');
            }).catch(errors => {
                res.send('An error occured: ' + errors);
            });
        }
    }).catch(errors => {
        res.send('An error occurred: ' + errors);
    });
});

// MIDDLEWARE
function auth(req, res, next) {
    if (!req.session.username) {
        res.redirect("/login");
    } else {
        next();
    }
};


// FIRE UP APPLICATION
app.listen(DEFAULT_PORT, () => console.log('Listening on port 3000!'));
