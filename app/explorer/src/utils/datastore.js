'use strict';

var _ = require('lodash');



/**
 * This method will recursively parse a filters tree, to find if an entry
 * matches it or not.
 *
 * The filters tree must be presented as a root object node, with the following
 * recognized keys:
 *
 *   - {?string} operator
 *     If this key contains "and" or "or", then the entry must respectively
 *     match *all* or *at least one* of the children node.
 *
 *   - {?array} branches
 *     The optional array of children nodes. Only used if the current node has a
 *     valid "operator" value.
 *
 *   - {?string} method
 *     If the node does not have any "operator" value, then it is recognized as
 *     a last-level node, and must have a "method" value. The recognized methods
 *     are at the moment "eq", "lt", "lte", "gt", "gte", "has" and "search".
 *
 *   - {?string} field
 *     If the "method" value is valid, then the function will use the method
 *     relatively to the "field" value, if needed.
 *
 *   - {?*} value
 *     For the "eq", "lt", "lte", "gt" and "gte" methods and for a number field,
 *     the value must be a number.
 *     For the "has" and "search" values, the "value" value can be a string, but
 *     is not required.
 *
 * A node must have a valid "operator" or a valid "method" value, or it will not
 * effectively be used to filter the entry.
 *
 *
 *
 * @param  {object}  tree  A filters tree.
 * @param  {object}  entry The entry to test.
 * @return {boolean}       True if the entry matches, and false else.
 */
function matchEntry(tree, entry) {
  var k,
      val,
      test,
      expected;

  // Operator node:
  if (tree.operator)
    switch (tree.operator.toLowerCase()) {
      case 'and':
        return tree.branches.every(function(subTree) {
          return matchEntry(subTree, entry);
        });

      case 'or':
        return tree.branches.some(function(subTree) {
          return matchEntry(subTree, entry);
        });
    }

  // Method node:
  else
    switch ((tree.method || '').toLowerCase()) {
      case 'eq':
        if (!tree.field)
          return false;

        val = entry[tree.field];
        return (
          (typeof val === 'number') ?
            val === tree.value :
            false
        );

      case 'lt':
        if (!tree.field)
          return false;

        val = entry[tree.field];
        return (
          (typeof val === 'number') ?
            val < tree.value :
            false
        );

      case 'lte':
        if (!tree.field)
          return false;

        val = entry[tree.field];
        return (
          (typeof val === 'number') ?
            val <= tree.value :
            false
        );

      case 'gt':
        if (!tree.field)
          return false;

        val = entry[tree.field];
        return (
          (typeof val === 'number') ?
            val > tree.value :
            false
        );

      case 'gte':
        if (!tree.field)
          return false;

        val = entry[tree.field];
        return (
          (typeof val === 'number') ?
            val >= tree.value :
            false
        );

      case 'has':
        if (tree.field) {
          return (
            Array.isArray(entry[tree.field]) ?
              entry[tree.field] :
              [entry[tree.field]]
          ).some(function(value) {
            return value === tree.value;
          });

        } else {
          test = function(value) {
            return value === tree.value;
          };

          for (k in entry)
            if ((Array.isArray(entry[k]) ? entry[k] : [entry[k]]).some(test))
              return true;

          return false;
        }
        break;

      case 'search':
      /* falls through */
      default:
        if (tree.field) {
          expected = tree.value.toLowerCase();
          return (
            Array.isArray(entry[tree.field]) ?
              entry[tree.field] :
              [entry[tree.field]]
          ).some(function(value) {
            return value && ('' + value).toLowerCase().match(expected);
          });

        } else {
          expected = tree.value.toLowerCase();
          test = function(value) {
            return value && ('' + value).toLowerCase().match(expected);
          };

          for (k in entry)
            if ((Array.isArray(entry[k]) ? entry[k] : [entry[k]]).some(test))
              return true;

          return false;
        }
    }

  return false;
}



/**
 * The constructor of the DataStore class.
 *
 * Each instance exposes a #append public method to feed the store, and a #query
 * public method to query the store.
 *
 * @param {?object} specs An optional object with a key "fields", specifying the
 *                        types and eventually some more (such as format mask
 *                        for date fields) for some / all fields. Another key,
 *                        "index", can refer to an array of field IDs, that will
 *                        be indexed through a reverse dictionary.
 */
var DataStore = function(specs) {
  var _store = [],          // The original entries
      _storeModified = [],  // The modified entries (parsed dates, etc...)

      _indexes = [],        // The indexes definitions
      _indexed = {},        // The indexed entries
      _specs = specs || {}, // Fields specifications

      _reverseDicts = {};

  // Default keys in _specs object:
  _specs.fields = _specs.fields || {};

  // Initiate reverse dictionaries:
  if (Array.isArray(_specs.index))
    _reverseDicts = _specs.index.reduce(function(res, field) {
      res[field] = {};
      return res;
    }, {});


  /**
   * This method appends a new entry in the document store.
   *
   * @param  {object}    obj The entry to append.
   * @return {DataStore}     Returns itself.
   */
  this.append = function(obj) {
    var k,
        entry = {};

    for (k in obj)
      entry[k] = obj[k];

    function registerInDicts(value) {
      if (!_reverseDicts[k][value])
        _reverseDicts[k][value] = [];
      _reverseDicts[k][value].push(obj);
    }

    for (k in _reverseDicts)
      (
        Array.isArray(entry[k]) ?
          entry[k] :
        entry[k] ?
          [entry[k]] :
          []
      ).forEach(registerInDicts);

    _store.push(obj);
    _storeModified.push(entry);

    return this;
  };



  /**
   * This method queries the store with a set of filters, to retrieve:
   *
   *   1. A list of documents
   *
   *   2. The total count of documents that match the filters
   *
   *   3. Some specific metrics about the subset of matching documents:
   *     -> Extrema for some orderable fields (dates, numbers)
   *     -> The list of present values (TODO)
   *
   *   4. Aggregations:
   *     -> Aggregated values for some fields
   *     -> Weighted aggregated values for some fields
   *     -> Crossed aggregations for multiple fields
   *
   *
   *
   * Available options:
   * ******************
   *
   *   1. Filtering the documents list:
   *   ********************************
   *
   *   - {?object} query:
   *     The optional filters tree. Check matchEntry.js documentation to know
   *     more.
   *
   *   - {?string} query_string:
   *     Will be ignored if the "query" key specifies a valid filters tree. The
   *     optional query tree, represented as a "query_string" string. Check
   *     http://gitlab.notil.us/lbonnargent/query-string documentation to know
   *     more.
   *
   *
   *   2. Retrieving the documents list:
   *   *********************************
   *
   *   The retrieved documents array will be returned under the key "hits", and
   *   the total number of matching documents under "total".
   *
   *   - {?number} from:
   *     The index of the first document to retrieve.
   *
   *   - {?number} size:
   *     The number of documents to retrieve.
   *
   *   - {?array} sort:
   *     The array of fields to sort the documents on. Each element of the array
   *     can be either the name of the field (string) or an object, with the
   *     related field as the only key, and "asc" or "desc" as the related
   *     value.
   *
   *
   *   3. Extracting metrics:
   *   **********************
   *
   *   - {?object} extrema:
   *     An optional object with some extrema orders, indexed by whatever ids
   *     you want.
   *     The extracted extrema will be returned in the key "extrema" in the
   *     results object.
   *     In each extrema object, the key "field" specifies the number or date
   *     field to extract the extrema from.
   *
   *   - {?object} aggregations:
   *     An optional object with some aggregation orders, indexed by whatever
   *     ids you want.
   *     The extracted aggregations will be returned in the key "aggregations"
   *     in the results object.
   *     Also, in case of number fields, the key "interval" can specify a number
   *     describing the tranches to aggregate, and the key "start" can specify a
   *     delay to start the tranches from.
   *     Finally, in case of date fields, the key "interval" can contain the
   *     string "day", "month" or "year".
   *
   *
   *
   * @param  {object}           options  An object describing the filters and
   *                                     what to extract from the documents.
   * @param  {?Function}        callback The optional callback that will be
   *                                     called with the results object as only
   *                                     parameter.
   * @return {object|DataStore}          Returns itself if a callback is given,
   *                                     and the results object else.
   */
  this.query = function(options, callback) {
    options = options || {};

    var k,
        res = {},
        set = _store,
        hitsModified = [];

    function _checkOneField(tree) {
      var tmp;

      // Single value:
      if (
        tree.field &&
        _reverseDicts[tree.field]
      )
        return {
          field: tree.field,
          operator: 'and',
          values: [tree.value]
        };

      // Multiple values:
      else if (
        tree.branches &&
        ( tmp = _.uniq(tree.branches.map(function(branch) {
            return branch.field;
          }) ).length === 1 &&
        _reverseDicts(tmp[0]) )
      )
        return {
          field: tmp[0],
          operator: tree.operator,
          values: tree.branches.map(function(branch) {
            return branch.value;
          })
        };

      // No match:
      return false;
    }

    // Object queries:
    if (options.query && typeof options.query === 'object') {
      // Reverse dictionaries:
      var indexParams,
          tree = options.query;

      if (
        // First case: Single field
        ( (indexParams = _checkOneField(tree)) ) ||

        // Second case: Multiple fields
        ( tree.operator &&
          tree.operator.toLowerCase() === 'and' &&
          tree.branches.some(function(branch) {
            return (indexParams = _checkOneField(branch));
          }) )
      ) {
        var arrays = indexParams.values.map(function(value) {
              return _reverseDicts[indexParams.field][value];
            }),
            method = indexParams.operator.toLowerCase() === 'and' ?
              _.intersection :
              _.union;

        if (arrays.length > 1)
          set = method.apply(_, arrays);
        else
          set = arrays[0].slice(0);
      }

      res.hits = set.filter(function(obj, i) {
        obj = _storeModified[i];
        if (matchEntry(tree, obj)) {
          hitsModified.push(obj);
          return true;
        }
      });
    }

    else {
      hitsModified = _storeModified.slice(0);
      res.hits = _store.slice(0);
    }

    // Total:
    res.total = res.hits.length;

    // Sort:
    if (options.sort) {
      var sortOptions =
        (
          Array.isArray(options.sort) ?
             options.sort :
             [options.sort]
        ).map(function(val) {
          var res = {};

          if (typeof val === 'string')
            res[val] = 'asc';
          else
            res = val;

          return res;
        });

      res.hits = res.hits.sort(function(a, b) {
        var res = 0;
        sortOptions.some(function(obj) {
          var field = Object.keys(obj)[0],
              desc = obj[field] === 'desc';

          return (
            res = (desc ? -1 : 1) *
            (
              a[field] === b[field] ?
                0 :
              a[field] > b[field] ?
                1 :
                -1
            )
          );
        });
        return res;
      });
    }

    // Pagination:
    res.hits = res.hits.slice(
      options.from || 0,
      (options.from || 0) + (options.size || _store.length)
    );
    hitsModified = hitsModified.slice(
      options.from || 0,
      (options.from || 0) + (options.size || _storeModified.length)
    );

    // Extrema:
    if (options.extrema) {
      res.extrema = {};

      var extremaIterator = function(data) {
        val = data[options.extrema[k].field];

        switch (_specs.fields[options.extrema[k].field].type) {
          case 'date':
            if (
              extrema.min === undefined ||
              (val.valueOf() < extrema.min.valueOf())
            )
              extrema.min = val;

            if (
              extrema.max === undefined ||
              (val.valueOf() > extrema.max.valueOf())
            )
              extrema.max = val;
            break;

          case 'number':
          /* falls through */
          default:
            extrema.min =
              (extrema.min === undefined) ?
                val :
                Math.min(extrema.min, val);
            extrema.max =
              (extrema.max === undefined) ?
                val :
                Math.max(extrema.max, val);
            break;
        }
      };

      for (k in options.extrema) {
        var val,
            extrema = {
              min: undefined,
              max: undefined
            };

        res.extrema[k] = {};
        res.extrema[k][options.extrema[k].field] = extrema;

        hitsModified.forEach(extremaIterator);
      }
    }

    // Aggregations:
    if (options.aggregations) {
      var aggregations = {};

      for (k in options.aggregations) {
        aggregations[k] = {
          fields:
            // If the "fields" key specifies an array:
            options.aggregations[k].fields ?
              options.aggregations[k].fields :

            // If the "field" key specifies one field:
            options.aggregations[k].field ?
              [options.aggregations[k]] :

            // If the object is actually an array of fields:
            Array.isArray(options.aggregations[k]) ?
              options.aggregations[k] :

            // If the object is actually one string field:
              [options.aggregations[k]]
        };

        aggregations[k].fields = aggregations[k].fields.map(function(v) {
          return (
            typeof v === 'string' ?
              { field: v } :
            typeof v === 'object' ?
              v :
              null
          );
        });

        // Store options for multi-aggregations:
        if (
          typeof options.aggregations[k] === 'object' &&
          'weight' in options.aggregations[k]
        )
          aggregations[k].weight = options.aggregations[k].weight;
      }

      res.aggregations = hitsModified.reduce(function(aggregationsRes, data) {
        function reduceOnFieldsFn(currentObjects, field, i, a) {
          var nextLevelObjects = [],
              lastField = i === a.length - 1;

          (
            Array.isArray(data[field.field]) ?
              data[field.field] :
              [data[field.field]]
          ).forEach(function(value) {
            var val;

            // Numbers:
            if ((_specs.fields[field.field] || {}).type === 'number') {
              // Group by intervals
              if (field.interval) {
                var start = field.start || 0,
                    section = Math.floor(
                      (value - start) / field.interval
                    ) * field.interval + start;

                val = section + '-' + (section + field.interval);
              }

            // Common cases:
            } else
              val = value;

            if (val !== undefined && val !== null) {
              if (lastField)
                currentObjects.forEach(function(obj) {
                  obj[val] =
                    (obj[val] || 0) +
                    (aggregations[k].weight ?
                      data[aggregations[k].weight] || 0 :
                      1);
                });
              else
                currentObjects.forEach(function(obj) {
                  obj[val] = obj[val] || {};
                  nextLevelObjects.push(obj[val]);
                });
            }
          });

          return nextLevelObjects;
        }

        for (k in aggregations) {
          aggregationsRes[k] = aggregationsRes[k] || {};
          aggregations[k].fields.reduce(
            reduceOnFieldsFn,
            [aggregationsRes[k]]
          );
        }

        return aggregationsRes;
      }, {});
    }

    // Return results (sync or async):
    if (callback) {
      setTimeout(function() {
        callback(res);
      }, 0);
      return this;
    } else
      return res;
  };
};



module.exports = DataStore;
