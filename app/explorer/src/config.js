'use strict';

var _ = require('lodash'),
    events =
      require('../../../ENB-data/metadata_overview/events_metadata.json'),
    continents =
      require('../../../ENB-data/metadata_overview/continents-countries.json');

module.exports = {
  // Fields to index through reverse dictionaries in data store:
  index: [],

  // Fields that can be used to filter the dataset:
  filters: [
    { field: 'topics' },
    { field: 'event_id' },
    { field: 'actors' },
    { field: 'countries' }
  ],

  // Fields that are displayed in the Stats column:
  stats: [
    'topics',
    'event_id',
    'actors'
  ],

  // Fields that must be aggregated when filtering the dataset:
  aggregations: [
    'topics',
    'event_id',
    'actors',
    'year'
  ],

  // Fields metadata:
  fields: {
    countries: {
      label: 'Countries',
      cacheValues: true,
      separator: '|',
      groupBy: 'continent',
      values: _.transform(
        continents,
        function(result, countries, continent) {
          countries.forEach(function(country) {
            result[country] = {
              id: country,
              label: country,
              continent: continent
            }
          });
        }
      )
    },
    actors: {
      label: 'Groupings',
      cacheValues: true,
      separator: '|'
    },
    topics: {
      label: 'Topics',
      cacheValues: true,
      separator: '|'
    },
    year: {
      label: 'Year',
      cacheValues: true,
      operator: 'or'
    },
    event_id: {
      label: 'Events',
      cacheValues: true,
      operator: 'or',
      groupBy: 'year',
      values: _.transform(
        events,
        function(result, value, key) {
          value.id = key;
          result[key] = value;
        }
      )
    }
  }
};
