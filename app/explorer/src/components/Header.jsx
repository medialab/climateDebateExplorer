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
  share: function(e) {
    window.open(
      this._makeUrl(
        e.currentTarget.getAttribute('data-network'),
        encodeURIComponent('Climate Negociations Browser'),
        encodeURIComponent(window.location.href)
      ),
      null,
      'status=1,' +
      'width=700,' +
      'height=400,' +
      'top=' + ( window.innerHeight / 2 - 200 ) + ',' +
      'left=' + ( window.innerWidth / 2 - 350 )
    );
  },

  _makeUrl: function(network, title, url) {
    var networks = {
      facebook: {
        api: 'http://www.facebook.com/sharer/sharer.php?',
        title: 'title=',
        url: '&u='
      },
      twitter: {
        api: 'http://twitter.com/intent/tweet?',
        title: 'status='
      },
      linkedin: {
        api: 'http://www.linkedin.com/shareArticle?mini=true&',
        title: 'title=',
        url: '&url='
      }
    };

    return networks[network].api +
      ( networks[network].title ? networks[network].title + title : '' ) +
      ( networks[network].url ? networks[network].url + url : '' );
  },

  render: function() {
    return (
      <div className="header">
        <img  className={
                this.state.deployed ?
                  'header-logo hidden' :
                  'header-logo'
              }
              src="assets/img/black-logo.svg" />
        <div className="links">
          <a  className="button"
              onClick={ this.toggleAbout }>About</a>
        </div>
        <div className="social">
          <a  className="button"
              data-network="facebook"
              onClick={ this.share }><img src="assets/img/facebook.svg" /></a>
          <a  className="button"
              data-network="twitter"
              onClick={ this.share }><img src="assets/img/twitter.svg" /></a>
          <a  className="button"
              data-network="linkedin"
              onClick={ this.share }><img src="assets/img/linkedin.svg" /></a>
        </div>
        <div className="menu">
          <a  className="discover"
              href="discover.html">Discover</a>
          <a className="explore"
              href="#">Explore</a>
        </div>
      </div>
    );
  }
});
