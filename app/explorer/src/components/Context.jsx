'use strict';

var React = require('react'),
    BaobabBranchMixin = require('baobab-react/mixins').branch;

module.exports = React.createClass({
  displayName: 'climateDebateExplorer/explorer/context',
  mixins: [ BaobabBranchMixin ],
  cursors: {},

  render: function() {
    return (
      <div className="context">context</div>
    );
  }
});
