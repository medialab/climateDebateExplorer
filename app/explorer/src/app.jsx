'use strict';

var _ = require('lodash'),
    djax = require('djax'),
    React = require('react'),
    Papa = require('papaparse'),
    ReactDOM = require('react-dom'),
    BaobabRootMixin = require('baobab-react/mixins').root,

    tree = require('./tree.js'),
    DataStore = require('./utils/datastore'),
    container = document.getElementById('app-container'),
    Layout = require('./components/Layout.jsx'),
    App = React.createClass({
      mixins: [ BaobabRootMixin ],
      render: function() {
        return <Layout />;
      }
    });

// Load JSON config file:
djax({
  url: 'assets/data/config.json',
  success: function(config) {
    // Load CSV data file:
    Papa.parse('assets/data/data.csv', {
      header: true,
      download: true,
      complete: function(results) {
        // Feed the store:
        var store = new DataStore({
          fields: config.fields,
          index: config.index
        });

        var splitables = [];
        _.forEach(config.fields, function(field, key) {
          if (field.separator)
            splitables.push({
              id: key,
              separator: field.separator
            });
        });

        results.data.forEach(function(row) {
          splitables.forEach(function(field) {
            row[field.id] = (row[field.id] || '').split(field.separator);
          })
          store.append(row);
        });

        // Reference the store as a tree attribute, to make it easily accessible
        // from outside of here:
        tree.datastore = store;

        // Initial rendering:
        ReactDOM.render(
          <App tree={ tree } />,
          container
        );
      }
    });
  }
})

module.exports = {
  tree: tree
};
