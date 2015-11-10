var targetFile = "../ENB-data/metadata_overview/metadata.csv"

var margin = {top: 20, right: 200, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y%m%d").parse;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.volume); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(targetFile, function(error, data) {
  if (error) throw error;

  // Get years
  data.forEach(function(d, i) {
    var two_digit_year = +d.enb_start_date.split('-')[2]
      , year

    if ( two_digit_year < 50 ) {
      year = 2000 + two_digit_year
    } else {
      year = 1900 + two_digit_year
    }

    d.year = year

  });

  // Actors as an array
  data.forEach(function(d){
    d.actors = d.actors.split('|').filter(function(d){ return d != '' })
  })

  // Total yearly
  var totalVolumeYearly = {}
  data.forEach(function(d){
    totalVolumeYearly[d.year] = ( totalVolumeYearly[d.year] || 0 ) + 1
  })

  // Agregate volume
  var volumeByActorYearly = {}
  data.forEach(function(d){
    d.actors.forEach(function(actor){
      var volumeYearly = volumeByActorYearly[actor] || {}
        , volume = ( volumeYearly[d.year] || 0 ) + ( 100 / totalVolumeYearly[d.year] )
      volumeYearly[d.year] = volume
      volumeByActorYearly[actor] = volumeYearly
    })
  })

  // Flatten data
  var volumes = []
  for ( var actor in volumeByActorYearly ) {
    for ( var year = 1995 ; year <= 2015 ; year++ ) {
      volumes.push({
        actor: actor
      , year: year
      , volume: volumeByActorYearly[actor][year] || 0
      })
    }
  }

  // Curves by actor
  var nested_data = d3.nest()
    .key(function(d) { return d.actor; })
    .entries(volumes)
    .filter(function(d, i){
        return d3.max(d.values.map(function(d2){return d2.volume})) > 10
      })

  color.domain(nested_data.map(function(d){return d.key}));

  x.domain(d3.extent(volumes, function(d) { return d.year; }));

  y.domain([
    d3.min(nested_data, function(volumes) { return d3.min(volumes.values, function(d) { return d.volume; }); }),
    d3.max(nested_data, function(volumes) { return d3.max(volumes.values, function(d) { return d.volume; }); })
  ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("x", width)
      .attr("y", 30)
      .style("text-anchor", "end")
      .text("Year");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Volume (%)");

  var actor = svg.selectAll(".actor")
      .data(nested_data)
    .enter().append("g")
      .attr("class", "actor");

  actor.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.key); });

  actor.append("text")
      .datum(function(d) { return {name: d.key, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.volume) + ")"; })
      .attr("x", 3)
      .attr("y", function(d){
        // console.log(d.name)
          if ( d.name == 'Alliance of Small Island States' ) {
              return -7
            }
          if ( d.name == 'Group of 77' ) {
              return -6
            }
          if ( d.name == 'African Group' ) {
              return 0
            }
          if ( d.name == 'Independent association of Latin America and the Caribbean' ) {
              return 9
            }
          return 0
        })
      .attr("dy", '.35em')
      .style("fill", function(d) { return color(d.name); })
      .text(function(d) {
        if ( d.name == "Independent association of Latin America and the Caribbean" ) {
          return "I.A. of Latin America & the Caribbean"
        } else if ( d.name == "Organisation for Economic Co.operation and Development" ) {
          return "Org. for Economic Coop. & Development"
        }
        return d.name;
      })
});