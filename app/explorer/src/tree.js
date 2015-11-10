'use strict';

var Baobab = require('baobab');

module.exports = new Baobab({
  cached: {
    valuesLists: {}
  },

  appState: {
    filters: [],
    deployedList: undefined,
    deployedVerbatim: undefined
  },

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
