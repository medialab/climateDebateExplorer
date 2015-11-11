'use strict';

var Baobab = require('baobab');

module.exports = new Baobab({
  // Data that does depend on current filters:
  cached: {
    valuesLists: {}
  },

  // Data that strongly depend on current filters:
  contextual: {
    aggregatedLists: {}
  },

  // Data that is used for the routing:
  appState: {
    filters: [],
    deployedList: undefined,
    deployedVerbatim: undefined
  },

  // Dynamic views:
  views: {
    filtersIndex: Baobab.monkey({
      cursors: {
        filters: ['appState', 'filters']
      },
      get: function(data) {
        return data.filters.reduce(function(res, filter) {
          res[filter.field] = filter.values.reduce(function(res, value) {
            res[value] = true;
            return res;
          }, {});
          return res;
        }, {})
      }
    })
  }
});
