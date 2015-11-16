'use strict';

var React = require('react'),
    BaobabBranchMixin = require('baobab-react/mixins').branch;

module.exports = React.createClass({
  displayName: 'climateDebateExplorer/explorer/header',
  mixins: [ BaobabBranchMixin ],
  cursors: {
    deployed: ['appState', 'deployedHeader']
  },

  toggleAbout: function(e) {
    this.cursors.deployed.set(!this.state.deployed);
  },

  render: function() {
    return (
      <div className="header">
        <div className="links">
          <a  className="button"
              onClick={ this.toggleAbout }>About</a>
        </div>
        <div className="social">
          <a className="button"><img src="assets/facebook.svg" /></a>
          <a className="button"><img src="assets/twitter.svg" /></a>
          <a className="button"><img src="assets/linkedin.svg" /></a>
        </div>
        <div className="menu">
          <a className="discover">Discover</a>
          <a className="explore">Explore</a>
        </div>
      </div>
    );
  }
});
