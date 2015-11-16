'use strict';

var _ = require('lodash'),
    Baobab = require('baobab'),
    filtersFacet = require('./utils/filtersFacet.js');

var tree = new Baobab({
  // Data that does depend on current filters:
  cached: {
    valuesLists: {}
  },

  // Data that is used for the routing:
  appState: {
    filters: [],
    deployedList: undefined,
    deployedHeader: false,
    deployedVerbatim: undefined
  },

  // Various dynamic views:
  views: {
    deployedVerbatimContent: Baobab.monkey({
      cursors: {
        id: ['appState', 'deployedVerbatim']
      },
      get: function(data) {
        if (!data.id)
          return undefined;

        var results = tree.datastore.query({
          query: {
            field: 'id',
            method: 'has',
            value: '' + data.id
          }
        });

        return (
          results.hits.length ?
            results.hits[0] :
            undefined
        );
      }
    })
  },

  // Data that depend on current filters:
  contextual: Baobab.monkey({
    cursors: {
      filters: ['appState', 'filters'],
      fields: ['cached', 'config', 'fields'],
      aggregations: ['cached', 'config', 'aggregations'],
    },
    get: function(data) {
      if (!tree.datastore)
        return {};

      var result = tree.datastore.query({
        size: 0,
        query: filtersFacet(
          data.filters,
          data.fields
        ),
        aggregations:
          data.aggregations.reduce(function(result, field) {
            result[field] = field;
            return result;
          }, {})
      });

      var lists = {};
      _.forEach(result.aggregations, function(list, field) {
        lists[field] = _.sortBy(
          _.reduce(list, function(result, value, key) {
            result.push({ id: key, value: value });
            return result;
          }, []),
          'value'
        ).reverse()
      });

      return {
        total: result.total,
        aggregatedLists: lists,
        filtersIndex: data.filters.reduce(function(res, filter) {
          res[filter.field] = filter.values.reduce(function(res, value) {
            res[value] = true;
            return res;
          }, {});
          return res;
        }, {})
      }
    }
  })
});

module.exports = tree;
