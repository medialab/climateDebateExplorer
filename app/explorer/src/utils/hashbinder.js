'use strict';

var PREFIX = '#/?',
    PREFIX_REGEXP = /^(#\/\?)+/g,

    SEPARATOR_EQ = '=',
    SEPARATOR_KEYS = '&',
    SEPARATOR_VALUES = '|';

module.exports = function(cursor, keys) {
  var _oldHash;

  function _treeToHash() {
    var hash = [],
        state = cursor.get();

    for (var key in state)
      // Filters:
      if (key === 'filters')
        state.filters.forEach(function(filter) {
          hash.push(
            filter.field + SEPARATOR_EQ + filter.values.join(SEPARATOR_VALUES)
          );
        });
      // Other parameters:
      else if (state[key] && ~keys.indexOf(key))
        hash.push(key + SEPARATOR_EQ + state[key]);

    return PREFIX + hash.join(SEPARATOR_KEYS);
  }

  function _hashToTree() {
    var state = { filters: [] },
        hash = location.hash.replace(PREFIX_REGEXP, '');

    hash.split(SEPARATOR_KEYS).forEach(function(str) {
      var arr = str.split(SEPARATOR_EQ),
          key = arr[0],
          val = arr[1];

      if (!val || !key)
        return;

      if (~keys.indexOf(key))
        state[key] = val;
      else
        state.filters.push({
          field: key,
          values: val.split(SEPARATOR_VALUES)
        });
    });

    return state;
  }

  cursor.on('update', function() {
    location.hash = _treeToHash();
  });

  window.addEventListener('hashchange', function() {
    var hash = location.hash;

    if (hash !== _oldHash) {
      _oldHash = hash
      cursor.set(_hashToTree());
    }
  });

  // Boostrap:
  _oldHash = location.hash;
  cursor.set(_hashToTree());
};
