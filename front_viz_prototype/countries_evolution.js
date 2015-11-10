var targetFile = "../app/data/sections_metadata.csv"

var margin = {top: 20, right: 200, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var color = d3.scale.category10();

var html = d3.select("body").append("div")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

d3.csv(targetFile, function(error, data) {
  if (error) throw error;

  // Countries as an array
  data.forEach(function(d){
    d.countries = d.countries.split('|').filter(function(d){ return d != '' })
  })

  // Total yearly
  var totalVolumeYearly = {}
  data.forEach(function(d){
    totalVolumeYearly[d.year] = ( totalVolumeYearly[d.year] || 0 ) + 1
  })

  // Agregate volume
  var volumeByCountryYearly = {}
  data.forEach(function(d){
    d.countries.forEach(function(actor){
      var volumeYearly = volumeByCountryYearly[actor] || {}
        , volume = ( volumeYearly[d.year] || 0 ) + ( 100 / totalVolumeYearly[d.year] )
      volumeYearly[d.year] = volume
      volumeByCountryYearly[actor] = volumeYearly
    })
  })

  // Flatten data
  var volumes = []
  for ( var country in volumeByCountryYearly ) {
    for ( var year = 1995 ; year <= 2015 ; year++ ) {
      volumes.push({
        country: country
      , year: year
      , volume: volumeByCountryYearly[country][year] || 0
      })
    }
  }

  // Top 5 country each year
  var nested_data = d3.nest()
    .key(function(d) { return d.year; })
    // .key(function(d) { return d.countries; })
    .entries(volumes)
  nested_data.forEach(function(d){
    d.values.sort(function(a, b){
          return b.volume - a.volume
        })

    d.values = d.values.filter(function(d2, i2){
          return i2 < 5
        })
  })

  var countries = {}
  nested_data.forEach(function(d){
    d.values.forEach(function(d2){
      countries[d2.country] = true
    })
  })

  color.domain(d3.keys(countries));

  var year = html.selectAll(".year")
      .data(nested_data)
    .enter().append("div")
      .attr("class", "year");

  year
    .text(function(d) {
        return d.key;
      })
    .selectAll('.country')
      .data(function(d){ 
          return d.values
        })
    .enter().append('p')
      .style('color', function(d){ return color(d.country) })
      .text(function(d){
        return d.country + ' ' + Math.round(d.volume) + '%'
      })






});