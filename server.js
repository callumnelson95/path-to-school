var express = require('express');
var bodyParser = require('body-parser');
var engines = require('consolidate');
var path = require('path');
var pug = require('pug');
var app = express();
 
// set up the template engine
app.set('views', './views');
app.set('view engine', 'pug');
 
// GET response for '/'
app.get('/', function (req, res) {
    // render the 'index' template, and pass in a few variables
    res.render('index.pug');
    
});
 
// start up the server
app.listen(8080, function () {
    console.log('Listening on http://localhost:8080');
});

