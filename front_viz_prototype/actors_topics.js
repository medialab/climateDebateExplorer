var targetFile = "../app/data/sections_metadata.csv"

var actor
  , topic

var margin = {top: 20, right: 20, bottom: 20, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeBands([0, width]);

var y = d3.scale.ordinal()
    .rangeBands([height, 0]);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(targetFile, function(error, data) {
  if (error) throw error;

  // Actors and topics as arrays
  data.forEach(function(d){
    d.actors = d.actors.split('|').filter(function(d){ return d != '' })
    d.topics = d.topics.split('|').filter(function(d){ return d != '' })
  })

  // Agregate volumes
  var volumeByActorByTopic = {}
    , actors = {}
    , topics = {}
  data.forEach(function(d){
    d.actors.forEach(function(actor){
      d.topics.forEach(function(topic){
        volumeByActorByTopic[actor] = volumeByActorByTopic[actor] || {}
        volumeByActorByTopic[actor][topic] = ( volumeByActorByTopic[actor][topic] || 0 ) + 1
        actors[actor] = ( actors[actor] || 0 ) + 1
        topics[topic] = ( topics[topic] || 0 ) + 1
      })
    })
  })

  // Complete data + compute averages
  var averageByActor = {}
    , averageByTopic = {}
    , volByTopic = {}
    , vol
  for ( actor in actors ) {
    vol = 0
    for ( topic in topics ) {
      volumeByActorByTopic[actor][topic] = volumeByActorByTopic[actor][topic] || 0
      volByTopic[topic] = (volByTopic[topic] || 0) + volumeByActorByTopic[actor][topic]
      vol += volumeByActorByTopic[actor][topic]
    }
    averageByActor[actor] = vol / Object.keys(topics).length
  }
  for ( topic in topics ) {
    averageByTopic[topic] = volByTopic[topic] / Object.keys(actors).length
  }
  
  // Flatten data
  var volumes = []
    , normalizedVolumeByActorByTopic = {}
  for ( actor in actors ) {
    normalizedVolumeByActorByTopic[actor] = {}
    for ( topic in topics ) {
      volumes.push({
        actor : actor
      , topic : topic
      , volume : vol
      , normalizedVolume: normVol
      })
      var vol = volumeByActorByTopic[actor][topic] || 0
        , normVol = ( vol - averageByActor[actor] ) / ( averageByActor[actor] )
      normalizedVolumeByActorByTopic[actor][topic] = normVol
    }
  }

  // Nested
/*  var nested_data = d3.nest()
    .key(function(d) { return d.actor })
    .key(function(d) { return d.topic })
    .entries(volumes)

  console.log('nested_data', nested_data)
*/
  x.domain(d3.keys(actors));
  y.domain(d3.keys(topics));
  
  // volumes.forEach(function(d){
  //  console.log(d.normalizedVolume, d.actor, d.topic)
  // })

  var crossing = svg.selectAll(".crossing")
      .data(volumes)
    .enter().append("g")
      .attr("class", "crossing")
    .append("circle")
      .attr("cx", function(d){ return x(d.actor) })
      .attr("cy", function(d){ return y(d.topic) })
      .attr("r", function(d) { return Math.sqrt(Math.abs(d.normalizedVolume*5)) })
      .style("fill", function(d){
          if ( d.normalizedVolume < 0 ) {
            return '#D42116'
          } else {
            return '#36D464'
          }
        });


  /*
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
  */
});
