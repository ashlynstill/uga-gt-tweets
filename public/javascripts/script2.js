$(function() {
$('#tooltip').hide();
    var socket = io.connect(window.location.hostname);
    var date;
    socket.on('data', function(results) {
    	var counts = results[0];
    	var data = results[2];
    	var places = results[1];
		$('#map-view').empty();
		var w = $('#map-view').width();
        var h = 600;
        var margin = {top: 40, right: 10, bottom: 20, left: 10},
            width = w - margin.left - margin.right - 100,
            height = h - margin.top - margin.bottom - 100,
            svg_width = w,
            svg_height = h;
            
            //Create SVG element

        var projection = d3.geo.albersUsa()
            .scale(w*10.5)
            .translate([(-1.5)*w, (-0.55)*h]);

        var path = d3.geo.path()
            .projection(projection);


        var svg = d3.select('#map-view')
            .append("svg")
            .attr("width", svg_width)
            .attr("height", svg_height);

        svg.append("rect")
            .attr("class", "background")
            .attr("width", svg_width)
            .attr("height", svg_height);
                

        var g = svg.append("g");

        d3.json("us.json", function(error, us) {
            g.append("g")
              .attr("id", "states")
            .selectAll("path")
              .data(topojson.feature(us, us.objects.states).features)
            .enter().append("path")
              .attr("d", path);

            g.append("path")
              .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
              .attr("id", "state-borders")

           places.forEach(function(d,i) {
           		console.log(d.coords);
				var coords = projection(d.coords);
				console.log(d);
				g.append('circle')
					.attr('cx', coords[0])
					.attr('cy', coords[1])
					.attr('r', 4)
					.style('fill', d.color)
					.on("mouseover", function() {
	                    $('#tooltip').fadeIn();
	                    //Get this bar's x/y values, then augment for the tooltip
	                    var xPosition = d3.event.pageX-40;
	                    var yPosition = d3.event.pageY+20;
	                    //Update Tooltip Position & value
	                    d3.select("#tooltip")
	                        .style("left", xPosition+'px')
	                        .style("top", yPosition+'px')
	                        .html(d.team);
	                })
	                .on("mouseout", function() {
	                    //Remove the tooltip
	                    $('#tooltip').hide();
	                });
			});
		});

       $('#bar-view').empty();
        var chart_width = $('#bar-view').width();
		var margin = {top: 20, right: 20, bottom: 30, left: 40},
		    width = chart_width - margin.left - margin.right,
		    height = 700 - margin.top - margin.bottom;



   	});
});