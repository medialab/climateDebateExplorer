'use strict';

var _ = require('lodash');

function getOneField(filter, spec) {
  spec = spec || {};

  // Full-text search:
  if (filter.fullText)
    return {
      method: 'search',
      value: filter.value.replace(/"/g, '\\"'),
      _double_quotes: true
    };

  if (filter.values.length === 1)
    return {
      method: 'has',
      field: filter.field,
      value: filter.values[0].replace(/"/g, '\\"'),
      _double_quotes: true
    };
  else
    return {
      operator: 'OR',
      _brackets: true,
      branches:
        filter.values.map(function(value) {
          return {
            method: 'has',
            field: filter.field,
            value: value.replace(/"/g, '\\"'),
            _double_quotes: true
          };
        })
    };
}

module.exports = function(filters, fields) {
  return (
    // First case:
    // One field
    filters.length === 1 ?
      getOneField(filters[0], fields[filters[0].field]) :

    // Third case:
    // Several fields
    ( filters.length > 1 ) ?
      { operator: 'AND',
        branches:
          filters.map(function(obj) {
            return getOneField(obj, fields[obj.field]);
          }) } :

    // Default case:
    // No field
    null
  );
}
