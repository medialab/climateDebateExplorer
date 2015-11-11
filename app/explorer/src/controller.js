'use strict';

var _ = require('lodash'),
    tree = require('./tree'),
    filtersFacet = require('./utils/filtersFacet');

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
