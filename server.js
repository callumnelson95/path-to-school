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
app.use(express.static(path.join(__dirname, 'public')));
 
// GET response for '/'
app.get('/', function (req, res) {
    // render the 'index' template, and pass in a few variables
    res.render('index.html');

});

//Page requests

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

//Connect to database
con.connect();


//Data requests
app.get('/mapData.json', getMapData);

function getMapData(req, res){

	console.log("Request for map data received!");

	var query = "SELECT * FROM basic \
					INNER JOIN success \
					ON basic.school_id = success.school_id\
					AND basic.year = success.year\
					INNER JOIN enrollments\
					ON basic.school_id = enrollments.school_id\
					AND basic.year = enrollments.year\
					INNER JOIN neighbors\
					ON basic.school_id = neighbors.school_id\
					AND basic.year = neighbors.year;"

	con.query(query, function(error, result) {
		if (error != null){
			console.log(error);
		}
		else{
			console.log(result);
			res.json(result);
			console.log("Map data loaded to client!");
		}
	});
}


app.get('/grab_data.json', grab_data);

function grab_data(req, res) {

	var query = "SELECT * FROM basic_info WHERE Home_room='Denver";

	con.query(query, function(error, result) {
		if (error != null){
			console.log(error);
		}
		else{
			console.log(result);
			//res.json(result);
			//console.log("Data sent to client!");
		}
	});
}

// start up the server
app.listen(8080, function () {
    console.log('Listening on http://localhost:8080');
});

