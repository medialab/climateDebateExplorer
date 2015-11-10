'use strict';

var React = require('react'),
    BaobabBranchMixin = require('baobab-react/mixins').branch;

module.exports = React.createClass({
  displayName: 'anihwa/front/layout',
  mixins: [ BaobabBranchMixin ],
  cursors: {
    view: [ 'state', 'view' ],
    dragging: [ 'state', 'dragging' ]
  },

  render: function() {
    return <div>My App</div>;
  }
});
