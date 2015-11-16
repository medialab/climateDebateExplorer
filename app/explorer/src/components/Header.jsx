'use strict';

var React = require('react'),
    BaobabBranchMixin = require('baobab-react/mixins').branch;

module.exports = React.createClass({
  displayName: 'climateDebateExplorer/explorer/header',
  mixins: [ BaobabBranchMixin ],
  cursors: {},

  render: function() {
    return (
      <div className="header">
        <div className="links">
          <a>About</a>
          <a>Disclaimer</a>
        </div>
        <div className="social">
          <a href="#"><img src="assets/facebook.svg" /></a>
          <a href="#"><img src="assets/twitter.svg" /></a>
          <a href="#"><img src="assets/linkedin.svg" /></a>
        </div>
        <div className="menu">
          <a className="discover">Discover</a>
          <a className="explore">Explore</a>
        </div>
      </div>
    );
  }
});
