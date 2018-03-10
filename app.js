'use strict';

const express = require('express'),
      app     = express();

app.use('/public', express.static('./public'));



// FIRE UP APPLICATION
app.listen(3000, () => console.log('Listening on port 3000!'))
