
var mapScale = 500000,
	latitude = 71.1097,
	longitude = 42.3736;

var startColor = '#ce473d',
	endColor = '#37a378';

var before_data = schools_json.before_features,
	after_data = schools_json.after_features,
	current_data = before_data;

var colorScale = d3.scaleOrdinal(d3.schemeCategory10);


$( document ).ready(function() {
   drawMap(current_data);
});



// Width and Height of the whole visualization

function drawMap(current_data){

	var width = 650;
	var height = 475;

	// Create SVG
	var svg = d3.select("#map")
	    .append("svg")
	    .attr("width", width)
	    .attr("height", height);

	var zoom = d3.zoom()
		//.scaleExtent([1, 40])
		//.translateExtent([[-100, -100], [width + 90, height + 100]])
		.on("zoom", zoomed);

	//Add tooltip to hover over basically whatever I want
	var tooltip = d3.select("#map")
		.append("div")
		.attr("class", "toolTip");

	// Append empty placeholder g element to the SVG
	// g will contain geometry elements
	var g = svg.append("g");

	var albersProjection = d3.geoAlbers()
	    .scale(mapScale)
	    .rotate( [latitude,0] )
	    .center( [0, longitude] )
	    .translate( [width/2, height/1.75] );

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

	/*var buildings = svg.append( "g" );

	var building = buildings.selectAll( "path" )
		.data(buildings_json.features)
			.enter()
		.append( "path" )
		.attr( "fill", null)
		.attr( "stroke", "#5D5D5D")
		.attr( "d", geoPath)
		.attr( "class", "building");*/

	var roads = svg.append( "g" );

	var road = roads.selectAll( "path" )
		.data(roads_json.features)
			.enter()
		.append( "path" )
		.attr( "fill", null)
		.attr( "stroke", "#D50087")//Violet-ish
		.attr( "stroke-width", 2)
		.attr( "d", geoPath)
		.attr( "class", "road");

	var schools = svg.append( "g" );

	var school = schools.selectAll( "path" )
		.data( current_data )
			.enter()
		.append( "path" )
		.attr( "fill", function(d){
			return colorScale(d.properties.level);
		})
		.attr( "stroke", "black" )
		.attr( "d", geoPath )
		.attr( "class", "school");

	//Adding a key

	var key = d3.select("#key");

	key.append( "circle" )
		.attr( "r", 20 )
		.attr( "fill", colorScale(0));

	//Load other data

	school.each(function(d) {
	
	});

	school.on("click", function(d){
		d3.select("h4").text(d.properties.SITE_NAME);
		d3.select("h5").text(d.properties.ADDRESS);
		d3.select(this).attr("class","incident hover");
	});

	road.on("mousemove", function(d){
        tooltip
          .style("left", d3.event.pageX - 125 + "px")
          .style("top", d3.event.pageY - 180 + "px")
          .style("display", "inline-block")
          .html(d.properties.STREET);
    });

	road.on("mouseout", function(d){ 
		tooltip.style("display", "none");
	});

	d3.select("#before_button")
		.on("click", function() {
			$("#map").empty();
			current_data = before_data;
			$(this).addClass("active");
			$("#after_button").removeClass("active");
			drawMap(current_data);
		});

	d3.select("#after_button")
		.on("click", function() {
			$("#map").empty();
			current_data = after_data;
			$(this).addClass("active");
			$("#before_button").removeClass("active");
			drawMap(current_data);
		});

	function zoomed() {
		svg.attr("transform", d3.event.transform);
	}

	//d3.select("#map").call(zoom);

}
