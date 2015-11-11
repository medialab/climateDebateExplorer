'use strict';

var _ = require('lodash'),
    djax = require('djax'),
    React = require('react'),
    Papa = require('papaparse'),
    ReactDOM = require('react-dom'),
    BaobabRootMixin = require('baobab-react/mixins').root,

    tree = require('./tree.js'),
    config = require('./config.js'),
    controller = require('./controller.js'),
    DataStore = require('./utils/datastore'),
    HashBinder = require('./utils/hashbinder'),
    container = document.getElementById('app-container'),
    Layout = require('./components/Layout.jsx'),
    App = React.createClass({
      mixins: [ BaobabRootMixin ],
      render: function() {
        return <Layout />;
      }
    });

// Cache config:
tree.set(
  ['cached', 'config'],
  config
);

// Load CSV data file:
Papa.parse('assets/data/data.csv', {
  header: true,
  download: true,
  complete: function(data) {
    // Reference the store as a tree attribute, to make it easily accessible
    // from outside of here:
    tree.datastore = new DataStore({
      fields: config.fields,
      index: config.index
    });

    // Feed the store:
    var splitables = [];
    _.forEach(config.fields, function(field, key) {
      if (field.separator)
        splitables.push({
          id: key,
          separator: field.separator
        });
    });

    data.data.forEach(function(row) {
      splitables.forEach(function(field) {
        row[field.id] = row[field.id] ?
          row[field.id].split(field.separator) :
          [];
      })
      tree.datastore.append(row);
    });

    // Hash bindings:
    new HashBinder(
      tree.select('appState'),
      ['deployedList', 'deployedVerbatim']
    );

    // Compute once and for all some relevant metrics:
    var aggregations = {};
    _.forEach(config.fields, function(obj, field) {
      if (obj.cacheValues)
        aggregations[field] = field;
    });

    var result = tree.datastore.query({
      aggregations: aggregations
    });

    for (var k in result.aggregations)
      result.aggregations[k] =
        _.map(result.aggregations[k], function(value, key) {
          return key;
        });

    // Cache values lists:
    tree.set(
      ['cached', 'valuesLists'],
      result.aggregations
    );

    // Initial rendering:
    ReactDOM.render(
      <App tree={ tree } />,
      container
    );
  }
});

module.exports = {
  tree: tree
};
