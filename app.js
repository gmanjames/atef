'use strict';

require('dotenv').config();

const express    = require('express'),
      app        = express(),
      dao        = require('./db/access.js');
const bodyParser = require('body-parser')

const DEFAULT_PORT = process.env.DEFAULT_PORT;


app.use('/public', express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');


// APPLICATION ROUTES
app.get('/', (req, res) => {
    res.render('begin');
});

app.post('/login', (req, res) => {
    const usrname = req.body.username,
          passwd  = req.body.password;

    const str = usrname + ", " + passwd;

    dao.findUser(usrname).then((results) => {
        const u = results[0];

        if (u) {
            res.send(u);
        } else {
            res.send('No user found by name ' + usrname)
        }
    }).catch((error) => {
        res.send('An error occurred: ' + error);
    });
});


// FIRE UP APPLICATION
app.listen(DEFAULT_PORT, () => console.log('Listening on port 3000!'));
