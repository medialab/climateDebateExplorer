var targetFile = "../ENB-data/metadata_overview/metadata.csv"

var margin = {top: 20, right: 80, bottom: 30, left: 50},
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

  // Agregate volume
  var volumeByActorYearly = {}
  data.forEach(function(d){
    d.actors.forEach(function(actor){
      var volumeYearly = volumeByActorYearly[actor] || {}
        , volume = ( volumeYearly[d.year] || 0 ) + 1
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
    // .key(function(d) { return d.year; })
    .entries(volumes)

  console.log(nested_data)

  color.domain(d3.keys(volumeByActorYearly));

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
      // .attr("dy", ".71em")
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
      .text("Volume");

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
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });

  /*color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });

  var cities = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, temperature: +d[name]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
    d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
  ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Temperature (ºF)");

  var city = svg.selectAll(".city")
      .data(cities)
    .enter().append("g")
      .attr("class", "city");

  city.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

  city.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });*/
});