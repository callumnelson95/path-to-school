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

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to Database!");
});


//Data requests
app.get('/mapData.json', getMapData);

function getMapData(req, res){

	console.log("Request for map data received!");

	var query = "SELECT * FROM mapdata"

	con.query(query, function(error, result) {
		if (error != null){
			console.log(error);
		}
		else{
			//console.log(result);
			res.json(result);
			console.log("Map data loaded to client!");
		}
	});
}

app.get('/neighbors.json', nearestNeighbors);

function nearestNeighbors(req, res) {
  	
  	console.log("nearest neighbors data loading");
  	var school_id = req.query.id;
  	var year = req.query.y;
  	console.log(school_id);
  	console.log(year);

	var query = "SELECT * FROM neighbors WHERE school_id = ? and year = ?";

	con.query(query, [school_id, year], function(error, result) {
		if (error != null){
			console.log(error);
		}
		else{
			res.json(result);
		}
	});
}

app.get('/neighbors_info.json', neighborsInfo);

function neighborsInfo(req, res) {

	console.log("Neighbors info requested");
	var n = req.query;

	var query = "SELECT DISTINCT b.school_id, b.school, b.town, s.success, s.year \
					FROM success s LEFT JOIN basic b \
					ON s.school_id = b.school_id \
					WHERE s.year = ? AND (s.school_id = ? OR s.school_id = ? OR s.school_id = ? OR s.school_id = ? \
					OR s.school_id = ? OR s.school_id = ? OR s.school_id = ? \
					OR s.school_id = ? OR s.school_id = ? OR s.school_id = ? \
					OR s.school_id = ?) \
					ORDER BY s.success asc;"

	con.query(query, [n.year, n.school_id, n.n1, n.n2, n.n3, n.n4, n.n5, n.n6, n.n7, n.n8, n.n9, n.n10, n.n11], function(error, result) {
		
		if (error != null){
			console.log(error);
		}
		else {
			res.json(result);
		}
	})
}

app.get('/school_chars.json', getCharacteristics);

function getCharacteristics(req, res) {

	console.log("School characteristics requested");
	var n = req.query;

	var query = "SELECT * FROM basic b INNER JOIN racegender r ON b.school_id=r.school_id \
				 INNER JOIN teachers t ON b.school_id = t.school_id INNER JOIN selectedpopulation s \
				 ON b.school_id = s.school_id \
				 WHERE b.school_id = ? AND b.year = ? AND r.year = ? and \
				 s.year = ? and t.year = ?;"

	con.query(query, [n.id, n.y, n.y, n.y, n.y], function(error, result) {

		if (error){
			console.log(error);
		}
		else{
			res.json(result);
		}
	})
}

app.get('/search.json', search_results);

function search_results(req, res) {

	var n = req.query;
	var search = '%' + n.search + '%';

	var query = "SELECT DISTINCT m.school_id FROM mapdata m WHERE m.year = ? \
				AND (m.school LIKE ? OR m.town LIKE ?);"

	console.log("User searching for " + search + "in year " + n.year);

	con.query(query, [n.year, search, search], function(error, result) {

		if (error){
			console.log(error);
		}
		else{
			console.log(result);
			res.json(result);
		}
	})
}

// start up the server
app.listen(8080, function (error, response) {
    if (error != null){
		console.log("Error: " + error);
	}
	else {
		console.log('listening on http://localhost:8080');
	}

});

