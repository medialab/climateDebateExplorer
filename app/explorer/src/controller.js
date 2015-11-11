'use strict';

var _ = require('lodash'),
    tree = require('./tree'),
    filtersFacet = require('./utils/filtersFacet');

// BINDINGS:
tree.select('appState', 'filters').on('update', function() {
  tree.emit('actions:gather');
});

// ACTIONS:
tree.on('actions:filter', function(e) {
  var field = e.data.field,
      value = e.data.value,
      filters = _.cloneDeep(tree.get('appState', 'filters')),
      filter = _.find(filters, { field: field });

  // If no filter has been set yet, create it:
  if (!filter)
    filters.push({
      field: field,
      values: [ value ]
    });

  // If the filter is set, but the value hasn't been added:
  else if (filter.values.indexOf(value) < 0)
    filter.values.push(value);

  // If the filter is set and the value has already been added:
  else
    _.pull(filter.values, value);

  // Check if there are still some keys:
  if (filter && !filter.values.length)
    filters = _.pull(filters, filter);

  tree.set(['appState', 'filters'], filters);
  tree.commit();
});
tree.on('actions:gather', function() {
  var result = tree.datastore.query({
    size: 0,
    query: filtersFacet(
      tree.get('appState', 'filters'),
      tree.get('cached', 'config', 'fields')
    ),
    aggregations:
      tree.get('cached', 'config', 'aggregations').reduce(function(result, field) {
        result[field] = field;
        return result;
      }, {})
  });

  // Store aggregations:
  var total = tree.set(['contextual', 'total'], result.total);

  // Store aggregations:
  _.forEach(result.aggregations, function(list, field) {
    tree.set(
      ['contextual', 'aggregatedLists', field],
      _.sortBy(
        _.reduce(list, function(result, value, key) {
          result.push({ id: key, value: value / total });
          return result;
        }, []),
        'value'
      ).reverse()
    );
  });

  tree.commit();
});
