var express = require('express');
var bodyParser = require('body-parser');
var engines = require('consolidate');
var path = require('path');
var mysql = require('mysql');
var app = express();
 
// set up the template engine
app.engine('html', engines.hogan);
app.set('views', './views');
app.set('view engine', 'html');
 
// GET response for '/'
app.get('/', function (req, res) {
    // render the 'index' template, and pass in a few variables
    res.render('index.html');

});

app.get('/page1.html', function(request, response){
	console.log('page1 requested');
	response.render('page1.html');
});

app.get('/page2.html', function(request, response){
	console.log('page2 requested');
	response.render('page2.html');
});

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Brownbear1!",
  database: "mydb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("SELECT * FROM basic_info", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});

// start up the server
app.listen(8080, function () {
    console.log('Listening on http://localhost:8080');
});

