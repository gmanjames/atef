'use strict';

require('dotenv').config();

const express    = require('express'),
      app        = express(),
      dao        = require('./dao/access.js'),
      session    = require('express-session'),
      md5        = require('md5'),
      sanitizer  = require('sanitizer');
const bodyParser = require('body-parser')

const profRoutes = require('./routes/profile.js');

const DEFAULT_PORT = process.env.DEFAULT_PORT;


app.use('/public', express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 600000 }}));

app.set('view engine', 'pug');

// Apparently important to do this AFTER view engine is set...
app.use('/app', profRoutes);


// APPLICATION ROUTES

app.get(["/", "/login"], (req, res) => {
    if (req.session.username) {
        res.redirect('/app/home');
    }
    res.render('begin');
});

app.get('/test', (req, res) => {
    dao.findTest(results => {
        res.send( '' + results);
    })
});

app.post('/login', (req, res) => {
    const usrname = sanitizer.sanitize(req.body.username),
          passwd  = sanitizer.sanitize(req.body.password);

    const str = usrname + ", " + passwd;

    dao.findUser(usrname, function(errors, results) {
        if (errors) {
            res.send('An error occurred: ' + error);
        } else {
             const u = results[0];

            if (u && u._data.password === md5(passwd)) {
                req.session.username = u._data.username;
                res.redirect('/app/home');
            } else {
                res.send('Incorrect username or password.');
            }
        }
    });
});

app.get("/register", (req, res) => {
    res.render('register');
});

app.post("/register", (req, res) => {
    dao.findUser(req.body.username, function(errors, results) {
        if (errors) {
            res.send("An error occurred: " + errors);
        } else {
            const u = results[0];

            if (u) {
                res.send("A user with the name '" + u._data.username + "' already exists!");
            } else {
                dao.createUser(req.body.username, req.body.email, md5(req.body.password), function (errors, results) {
                    if (errors) {
                        res.send("An error occurred: " + errors);
                    } else {
                        req.session.username = req.body.username;
                        res.redirect('/app/home');
                    }
                })
            }
        }
    })
});


// FIRE UP APPLICATION
app.listen(DEFAULT_PORT, () => console.log('Listening on port 3000!'));
