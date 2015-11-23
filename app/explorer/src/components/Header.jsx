'use strict';

var React = require('react'),
    BaobabBranchMixin = require('baobab-react/mixins').branch;

module.exports = React.createClass({
  displayName: 'climateDebateExplorer/explorer/header',
  mixins: [ BaobabBranchMixin ],
  cursors: {
    deployed: ['appState', 'deployedHeader'],
    contextual: ['contextual']
  },

  componentDidMount: function() {
    document.body.addEventListener('click', this.bodyHandler);
  },
  componentWillUnmount: function() {
    document.body.removeEventListener('click', this.bodyHandler);
  },

  bodyHandler: function(e) {
    if (this.state.permalinkDeployed) {
      var el = e.target,
          matches = false;

      while (!matches && el && el.hasAttribute) {
        if (el.hasAttribute('data-preserve-share'))
          matches = true;

        el = el.parentNode;
      }

      if (!matches)
        this.setState({ permalinkDeployed: false });
    }
  },

  toggleAbout: function(e) {
    this.cursors.deployed.set(!this.state.deployed);
  },
  onClickShare: function() {
    if (this.state.permalinkDeployed)
      this.setState({
        permalinkDeployed: false
      });

    else {
      this.setState({
        permalinkDeployed: true
      });

      this.refs['permalink-input'].select();
    }
  },

  _makeUrl: function(network) {
    var networks = {
      facebook: {
        api: 'http://www.facebook.com/sharer/sharer.php?',
        title: 'title=',
        url: '&u='
      },
      twitter: {
        api: 'http://twitter.com/intent/tweet?',
        title: 'status=',
        url: '%0D%0A'
      },
      linkedin: {
        api: 'http://www.linkedin.com/shareArticle?mini=true&',
        title: 'title=',
        url: '&url='
      }
    };

    return networks[network].api +
      ( networks[network].title ? networks[network].title + encodeURIComponent('Climate Negociations Browser') : '' ) +
      ( networks[network].url ? networks[network].url + encodeURIComponent(this.state.contextual.permalink) : '' );
  },

  render: function() {
    return (
      <div className="header">
        <div  className="permalink-container"
              data-preserve-share="true"
              data-deployed={
                this.state.permalinkDeployed || undefined
              }>
          <div>Copy the following link:</div>
          <input  ref="permalink-input"
                  className="permalink-display"
                  value={ this.state.contextual.permalink }
                  onChange={ function() {} } />
        </div>
        <a href="../">
          <img  className={
                this.state.deployed ?
                  'header-logo hidden' :
                  'header-logo'
              }
              src="../assets/img/black-logo.svg" />
        </a>
        <div className="links">
          <a  className="button"
              onClick={ this.toggleAbout }>How to use</a>
          <a  className="button"
              href="../about.html">About</a>
        </div>
        <div className="social">
          <a  className="button"
              onClick={ this.onClickShare }>
            <img src="../assets/img/share.svg" />
          </a>
          <a  className="button"
              href={ this._makeUrl('facebook') }
              target="_blank">
            <img src="../assets/img/facebook.svg" />
          </a>
          <a  className="button"
              href={ this._makeUrl('twitter') }
              target="_blank">
            <img src="../assets/img/twitter.svg" />
          </a>
          <a  className="button"
              href={ this._makeUrl('linkedin') }
              target="_blank">
            <img src="../assets/img/linkedin.svg" />
          </a>
        </div>
        <div className="menu">
          <a  className="discover"
              href="../">Discover</a>
          <a className="explore"
              href="#">Explore</a>
        </div>
      </div>
    );
  }
});
