'use strict';

require('dotenv').config();

const express = require('express'),
      app     = express();

const DEFAULT_PORT = process.env.DEFAULT_PORT;


app.use('/public', express.static('./public'));
app.set('view engine', 'pug');


// APPLICATION ROUTES
app.get('/', (req, res) => {
    res.render('home');
});


// FIRE UP APPLICATION
app.listen(DEFAULT_PORT, () => console.log('Listening on port 3000!'))
