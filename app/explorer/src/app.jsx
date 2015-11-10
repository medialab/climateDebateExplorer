'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    BaobabRootMixin = require('baobab-react/mixins').root,

    tree = require('./tree.js'),
    container = document.getElementById('app-container'),
    Layout = require('./components/Layout.jsx'),
    App = React.createClass({
            mixins: [ BaobabRootMixin ],
            render: function() {
              return <Layout />;
            }
          });

ReactDOM.render(
  <App tree={ tree } />,
  container
);

module.exports = {
  tree: tree
};
