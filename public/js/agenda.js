$( document ).ready(function() {
   drawBeforeMap();
});


var mapScale = 500000,
	latitude = 71.1097,
	longitude = 42.3736;

var startColor = '#ce473d',
	endColor = '#37a378';

var colorScale = d3.scaleLinear().domain([0, 10]).range([startColor, endColor]);

// Width and Height of the whole visualization

function drawBeforeMap(){
	var width = 650;
	var height = 500;

	// Create SVG
	var svg = d3.select("#map")
	    .append("svg")
	    .attr("width", width)
	    .attr("height", height);

	// Append empty placeholder g element to the SVG
	// g will contain geometry elements
	var g = svg.append("g");

	var albersProjection = d3.geoAlbers()
	    .scale(mapScale)
	    .rotate( [latitude,0] )
	    .center( [0, longitude] )
	    .translate( [width/2, height/1.85] );

	// Create GeoPath function that uses built-in D3 functionality to turn
	// lat/lon coordinates into screen coordinates
	var geoPath = d3.geoPath()
	    .projection(albersProjection);

	var neighborhood = g.selectAll("path")
	    .data(neighborhoods_json.features)
	    	.enter()
	    .append( "path" )
	    .attr( "fill", "#ccc")
	    .attr( "stroke", "#333")
	    .attr( "d", geoPath );

	var schools = svg.append( "g" );

	var school = schools.selectAll( "path" )
		.data( schools_json.features )
			.enter()
		.append( "path" )
		.attr( "fill", "#900" )
		.attr( "stroke", "#999" )
		.attr( "d", geoPath )
		.attr( "class", "school");

	school.on("click", function(d){
		d3.select("h4").text(d.properties.SITE_NAME);
		d3.select("h5").text(d.properties.ADDRESS);
		d3.select(this).attr("class","incident hover");
	});

	/*school.on("mouseout", function(d){
		d3.select("h4").text("");
		d3.select(this).attr("class","incident");
	});*/

}
