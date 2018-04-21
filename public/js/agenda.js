var mapScale = 500000,
	latitude = 71.1097,
	longitude = 42.3736;

var startColor = '#ce473d',
	endColor = '#37a378';

var before_data = schools_json.before_features,
	after_data = schools_json.after_features,
	current_data = before_data;

var before_connections = school_connections.before_connections,
	after_connections = school_connections.after_connections,
	current_connections = before_connections;

var math_data,
	ela_data,
	ela_averages,
	math_averages; 

var colorScaleMap = d3.scaleOrdinal(d3.schemeCategory10)
	colorScaleGraph = d3.scaleOrdinal(d3.schemeCategory20)
		.domain([0,1,2,3,4,5,6,7,8,9]);

var current_subject = $("#subject_form")[0].value,
	current_factor = $("#factor_form")[0].value,
	current_grade = $("#grade_form")[0].value;


$( document ).ready(function() {

	d3.queue(5)
		.defer(d3.request, '/IAschooldemogs.json')
		.defer(d3.request, '/IAmathmcas.json')
		.defer(d3.request, '/IAelamcas.json')
		.defer(d3.request, '/IAMATHaverages.json')
		.defer(d3.request, '/IAELAaverages.json')
		.awaitAll(start);

});

function start(error, results) {

	//Setup map data
	var allData = JSON.parse(results[0].response);
		//console.log(allData);
	var i,j,k;
	for(i = 0; i < allData.length; i++){
		var row = allData[i];
		var school_id = row.school_id;
		if(row.year == 2012){
			for(j = 0; j < before_data.length; j++){
				var key = before_data[j];
				var id = key.id;
				if(id == school_id){
					key.aa = +row.aa;
					key.asian = +row.asian;
					key.hispanic = +row.hispanic;
					key.white = +row.white;
					key.native = +row.native;
					key.ELL = +row.ELL;
					key.disabilities = +row.disabilities;
					key.low_income = +row.low_income;
				}
			}
		}else{
			for(k = 0; k < after_data.length; k++){
				var key = after_data[k];
				var id = key.id;
				if(id == school_id){
					key.aa = +row.aa;
					key.asian = +row.asian;
					key.hispanic = +row.hispanic;
					key.white = +row.white;
					key.native = +row.native;
					key.ELL = +row.ELL;
					key.disabilities = +row.disabilities;
					key.low_income = +row.low_income;
				}
			}
		}
	}

	//Set up ELA data

	math_data = JSON.parse(results[1].response);
	ela_data = JSON.parse(results[2].response);
	math_averages = JSON.parse(results[3].response);
	ela_averages = JSON.parse(results[4].response);

	var selected_data;

	if(current_subject == "Math"){
		selected_data = interpolate(math_data, current_grade, current_factor);
	}else{
		selected_data = interpolate(ela_data, current_grade, current_factor);
	}
	
	drawMap(current_data);
	drawGraph(selected_data);
}

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
		.scaleExtent([1, 20])
		.translateExtent([[-100, -100], [width + 90, height + 100]])
		.on("zoom", zoomed);

	//Add tooltip to hover over basically whatever I want
	var toolTip = d3.select("#map")
		.append("div")
		.attr("class", "toolTip");

	var schoolTooltip = d3.select("#map")
		.append("div")
		.attr("class", "schoolToolTip");

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

	var city_boundary = g.selectAll("path")
	    .data(boundary_json.features)
	    	.enter()
	    .append( "path" )
	    .attr( "fill", "#E3E3E3")
	    .attr( "stroke", "#333")
	    .attr( "d", geoPath )
	    .attr( "class", "boundary");

	/*var neighborhoods = svg.append( "g" );

	var neighborhood = neighborhoods.selectAll("path")
	    .data(neighborhoods_json.features)
	    	.enter()
	    .append( "path" )
	    .attr( "fill", "#E3E3E3")
	    .attr( "stroke", "#333")
	    .attr( "d", geoPath )
	    .attr( "class", "neighborhood");*/

	/*var buildings = svg.append( "g" );

	var building = buildings.selectAll( "path" )
		.data(buildings_json.features)
			.enter()
		.append( "path" )
		.attr( "fill", null)
		.attr( "stroke", "#5D5D5D")
		.attr( "d", geoPath)
		.attr( "class", "building");*/

	var water_bodies = g.append( "g" );

	var water = water_bodies.selectAll( "path" )
		.data(water_json.features)
			.enter()
		.append( "path" )
		.attr( "fill", "#9DE1FF")
		.attr( "stroke", "#5D5D5D")
		.attr( "d", geoPath)
		.attr( "class", "water");

	var roads = g.append( "g" );

	var road = roads.selectAll( "path" )
		.data(roads_json.features)
			.enter()
		.append( "path" )
		.attr( "stroke", "black")
		.attr( "stroke-width", 1)
		.attr( "d", geoPath)
		.attr( "class", "road");

	//Add paths connect schools before adding schools so schools are
	//on top

	//Need to add paths for post-IA schools so that they're drawn
	//correctly

	/*var school_paths = g.append("g");

	var path = school_paths.selectAll( "path" )
		.data(current_connections)
			.enter()
		.append( "path" )
		.attr( "fill" , "none")
		.attr( "stroke" , function(d){
			return colorScaleMap(d.properties.level);
		})
		.attr( "stroke-width" , 2)
		.attr( "d" , geoPath)
		.attr( "class" , "school-paths");*/

	var schools = g.append( "g" );

	var school = schools.selectAll( "path" )
		.data( current_data )
			.enter()
		.append( "path" )
		.attr( "fill", function(d){
			return colorScaleMap(d.properties.level);
		})
		.attr( "stroke", "black" )
		.attr( "d", geoPath )
		.attr( "class", "school");

	//I think animating the paths fucks up the asynchronous nature
	//of the initial requests for data. Might have to go back and queue
	//all the calls for data

	//Adding a key
	var radius = 10;

	var key_svg = d3.select("#key")
		.append("svg")
		.attr("width", 500);

	var key_data = [{"code": 0, "level": "K-5"}, 
					{"code": 1, "level": "K-8"}, 
					{"code": 2, "level": "6-8"},
					{"code": 3, "level": "High School"}];

	var keys = key_svg.append( "g" );

	var key = keys.selectAll( "circle" )
		.data(key_data)
			.enter()
		.append( "circle" )
		.attr( "r", radius )
		.attr( "fill", function(d){
			return colorScaleMap(d.code);
		})
		.attr("cy", 20)
		.attr("cx", function(d, i){
			return i*80 + 140;
		})
		.attr("stroke", "black");

	var key_labels = key_svg.selectAll( "text" )
		.data(key_data)
			.enter()
		.append("text")
		.attr("x", function(d,i){
			return i*80 + 155;
		})
		.attr("y", 19)
		.attr("text-anchor", "start")
      	.attr("dy", ".35em")
		.text(function(d){
			return "= " + d.level;
		});

	/*key_svg.append( "text" )
		.attr("x", 10)
		.attr("y", 20)
		.attr("font-weight", "bold")
		.text("KEY");*/

	school.on("mouseover", function(d){
		schoolTooltip
			.style("left", d3.event.pageX - 110 + "px")
          	.style("top", d3.event.pageY - 250 + "px")
          	.style("display", "inline-block")
          	.html("<h4>"+d.properties.SITE_NAME+"</h4>" +
				"<table>" +
				"<tr><th>Race</th><th>%</th></tr>"+
				"<tr><td>African American</td><td>"+d.aa.toFixed(2)+"</td></tr>"+
				"<tr><td>Asian</td><td>"+d.asian.toFixed(2)+"</td></tr>"+
				"<tr><td>Hispanic</td><td>"+d.hispanic.toFixed(2)+"</td></tr>"+
				"<tr><td>Native</td><td>"+d.native.toFixed(2)+"</td></tr>"+
				"<tr><td>White</td><td>"+d.white.toFixed(2)+"</td></tr>"+
				"<tr><th>Selected Population</th><th>%</th></tr>"+
				"<tr><td>ELLs</td><td>"+d.ELL.toFixed(2)+"</td></tr>"+
				"<tr><td>With Disabilities</td><td>"+d.disabilities.toFixed(2)+"</td></tr>" +
				"<tr><td>Low Income</td><td>"+d.low_income.toFixed(2)+"</td></tr>"+
				"</table>");
          	/*.html("<h4>"+d.properties.SITE_NAME+"</h4>" +
          			"<h6> Enrollment by Race (%)</h6>" +
          			"<p>African American: " + d.aa.toFixed(2) + "</p>" +
          			"<p>Asian: " + d.asian.toFixed(2) + "</p>" +
          			"<p>Hispanic: " + d.hispanic.toFixed(2) + "</p>" +
          			"<p>Native: " + d.native.toFixed(2) + "</p>" +
          			"<p>White: " + d.white.toFixed(2) + "</p>");*/
	});

	school.on("mouseout", function(d){ 
		schoolTooltip.style("display", "none");
	});

	road.on("mousemove", function(d){
        toolTip
          .style("left", d3.event.pageX - 175 + "px")
          .style("top", d3.event.pageY - 180 + "px")
          .style("display", "inline-block")
          .html(d.properties.STREET);
    });

	road.on("mouseout", function(d){ 
		toolTip.style("display", "none");
	});

	water.on("mousemove", function(d){
		if (d.properties.NAME==undefined){
			toolTip.style("display", "none");
		}else{
			toolTip
				.style("left", d3.event.pageX - 175 + "px")
				.style("top", d3.event.pageY - 180 + "px")
				.style("display", "inline-block")
				.html(d.properties.NAME);
		}
    });

    water.on("mouseout", function(d){ 
		toolTip.style("display", "none");
	});

	//Testing connections
	/*path.on("mousemove", function(d){
        toolTip
          .style("left", d3.event.pageX - 175 + "px")
          .style("top", d3.event.pageY - 180 + "px")
          .style("display", "inline-block")
          .html(d.properties.connection);
    });*/

	d3.select("#before_button")
		.on("click", function() {
			$("#map").empty();
			$("#key").empty();
			current_data = before_data;
			$(this).addClass("active");
			$("#after_button").removeClass("active");
			current_connections = before_connections;
			drawMap(current_data);
		});

	d3.select("#after_button")
		.on("click", function() {
			$("#map").empty();
			$("#key").empty();
			current_data = after_data;
			$(this).addClass("active");
			$("#before_button").removeClass("active");
			current_connections = after_connections;
			drawMap(current_data);
		});

	function zoomed() {
		g.attr("transform", d3.event.transform);
	}

	//d3.select("#map").call(zoom);

}

function drawGraph(data) {

	var subject,
		grade,
		factor;

	var width = 425;
	var height = 475;

	var margin = {top: 50, right: 50, bottom: 50, left: 50};

	var xScale = d3.scaleTime()
		.domain([new Date(2007, 0, 0), new Date(2016, 0, 0)])
		.range([0, width]);

	var xAxis = d3.axisBottom(xScale)
		.tickFormat(d3.timeFormat("%Y"))
		.tickSizeOuter(0);

	var yScale = d3.scaleLinear()
	    .domain([0, 100])
	    .range([height, 0]);

	var yAxis = d3.axisLeft(yScale);

	var graphToolTip = d3.select("#graph")
		.append("div")
		.attr("class", "graphToolTip");

	// Create SVG
	var svg = d3.select("#graph").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
	    .attr("class", "x-axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);

	var x_label =  svg.append("text")             
		.attr("transform",
		    "translate(" + (width/2) + " ," + 
		                   (height + margin.top - 10) + ")")
		.style("text-anchor", "middle")
		.text("Year");

	svg.append("g")
	    .attr("class", "y-axis")
	    .call(yAxis);

	var y_label = svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin.left)
		.attr("x",0 - (height / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text("Percent Advanced or Proficient");


	//Draw average lines before making scatter plot
    var valueline = d3.line()
	    .x(function(d) { 
	    	return xScale(new Date(d.adminyear, 0, 0)); 
	    })
	    .y(function(d) { 
	    	return yScale(d.average); 
	    }).curve(d3.curveCardinal);
    
    var	current_average_data;

    if(current_grade == "ALL" && current_subject == "Math"){

    	current_average_data = averages_interpolate(math_averages);

	    svg.append("path")
			.data([current_average_data.lineOne])
			.attr("class", "line")
			.attr("d", valueline);

		svg.append("path")
			.data([current_average_data.lineTwo])
			.attr("class", "line")
			.attr("d", valueline);

    }else if (current_grade == "ALL" && current_subject == "ELA"){

    	current_average_data = averages_interpolate(ela_averages);

	    svg.append("path")
			.data([current_average_data.lineOne])
			.attr("class", "line")
			.attr("d", valueline);

		svg.append("path")
			.data([current_average_data.lineTwo])
			.attr("class", "line")
			.attr("d", valueline);
    }

	var points = svg.selectAll("dot")
		.data(data)
			.enter()
		.append("circle")
			.attr("r", 5)
			.attr("cx", function(d) { 
				return xScale(new Date(d.adminyear, 0, 0)); 
			})
			.attr("cy", function(d) { 
				return yScale(d.pro_adv_per); 
			})
			.attr("fill", function(d){
				return color(d);
			})
			.attr("class", "point")
			.attr("stroke", "black");

	points.on("mouseover", function(d){
        graphToolTip
          .style("left", d3.event.pageX - 775 + "px")
          .style("top", d3.event.pageY - 150 + "px")
          .style("display", "inline-block")
          .html("<p>" + d.student_group + "</p>" +
          		"<p>Grade: " + d.grade + "</p>" +
          		"<p>" + d.pro_adv_per.toFixed(2) + " %</p>");
    });

    points.on("mouseout", function(d){
    	graphToolTip.style("display", "none");
    });

    //Draw red vertical line to show when IA passed
    var divider_data = [{"adminyear": 2012, "average": 0},
    					{"adminyear": 2012, "average": 100}];

   	var divider_line = d3.line()
	    .x(function(d) { 
	    	return xScale(new Date(d.adminyear, 6, 0)); 
	    })
	    .y(function(d) { 
	    	return yScale(d.average); 
	    });

	var divider = svg.append("path")
			.data([divider_data])
			.attr("class", "divider-line")
			.attr("d", divider_line);

	divider.on("mouseover", function(d){
		graphToolTip
          .style("left", d3.event.pageX - 775 + "px")
          .style("top", d3.event.pageY - 200 + "px")
          .style("display", "inline-block")
          .html("The Innovation Agenda was implemented in the 2012-2013 school year. \
          		Data to the left of this line are from K-8 schools. Data to the right \
          		are from the middle schools that the Innovation Agenda created.");
	});

	divider.on("mouseout", function(d){
		graphToolTip.style("display", "none");
	});

	//Working on changing data in response to forms!
	d3.select("#factor_form").on("change", function(d){
		var new_data;
		current_factor = $("#factor_form")[0].value;
		if(current_subject == "ELA"){
			new_data = interpolate(ela_data, current_grade, current_factor);
		}else if (current_subject == "Math"){
			new_data = interpolate(math_data, current_grade, current_factor);
		}
		$("#graph").empty();
		drawGraph(new_data);
	});

	d3.select("#subject_form").on("change", function(d){
		var new_data;
		current_subject = $("#subject_form")[0].value;
		if(current_subject == "ELA"){
			new_data = interpolate(ela_data, current_grade, current_factor);
		}else if (current_subject == "Math"){
			new_data = interpolate(math_data, current_grade, current_factor);
		}
		$("#graph").empty();
		drawGraph(new_data);
	});

	d3.select("#grade_form").on("change", function(d){
		var new_data;
		current_grade = $("#grade_form")[0].value;
		if(current_subject == "ELA"){
			new_data = interpolate(ela_data, current_grade, current_factor);
		}else if (current_subject == "Math"){
			new_data = interpolate(math_data, current_grade, current_factor);
		}
		$("#graph").empty();
		drawGraph(new_data);
	});

}

function color(d){

	if(current_factor == "Race"){
		if(d.student_group == "Black"){
			return colorScaleMap(4);
		}else{
			return colorScaleMap(5);
		}
	}else{
		if(d.student_group == "Low Income"){
			return colorScaleMap(6);
		}else{
			return colorScaleMap(7);
		}
	}
	
}

function interpolate(data, grade, factor) {
	//Function that selects all the data depending on the parameters
	var interpolated = [];

	if (grade !== "ALL"){
		grade = +grade;
	}

	var i;
	for(i = 0; i < data.length; i++){
		var row = data[i];
		if(factor=="Race"){
			if(grade == "ALL"){
				if(row.student_group == "Black" || row.student_group == "White"){
					interpolated.push(row);
				}
			}else{
				if(row.grade == grade && (row.student_group == "Black" || row.student_group == "White")){
					interpolated.push(row);
				}
			}
		}else if (factor == "Income"){
			if(grade == "ALL"){
				if(row.student_group == "Low Income" || row.student_group == "Non-Low Income"){
					interpolated.push(row);
				}
			}else{
				if(row.grade == grade && (row.student_group == "Low Income" || row.student_group == "Non-Low Income")){
					interpolated.push(row);
				}
			}
		}
		
	}

	return interpolated;
}

function averages_interpolate(data){
	var lineOne = [];
	var lineTwo = [];
	var interpolated = {};

	var i;
	for(i = 0; i < data.length; i++){
		var row = data[i];
		if(current_factor == "Race"){
			if(row.student_group == "Black"){
				lineOne.push(row);
			}else if (row.student_group == "White"){
				lineTwo.push(row);
			}
		}else{
			if(row.student_group == "Low Income"){
				lineOne.push(row);
			}else if (row.student_group == "Non-Low Income"){
				lineTwo.push(row);
			}
		}
	}

	interpolated.lineOne = lineOne;
	interpolated.lineTwo = lineTwo;

	return interpolated;
}


