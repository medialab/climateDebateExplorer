'use strict';

var React = require('react'),
    BaobabBranchMixin = require('baobab-react/mixins').branch;

module.exports = React.createClass({
  displayName: 'climateDebateExplorer/explorer/about',
  mixins: [ BaobabBranchMixin ],
  cursors: {
    deployed: ['appState', 'deployedHeader']
  },

  close: function(e) {
    var className = e.target.getAttribute('class');

    if (className === 'about' || className === 'about-cross')
      this.cursors.deployed.set(false);
  },

  render: function() {
    return (
      <div  className={
              this.state.deployed ?
                'about' :
                'about hidden'
            }
            onClick={ this.close }>
        <div className="about-content">
          <div  className="about-cross"
                onClick={ this.close }></div>
          <div className="about-logo"></div>
          <div className="about-text">
            <p>The Climate Negotiation allows the user to navigate over 20 years of UN climate negotiations as captured by the <a href="http://www.iisd.ca/vol12/" target="_blank">Earth Negotiation Bulletin</a> reporting system <br /><br /></p>
            <p>The DISCOVER interface offers a visual overview of the most visible issues and actors of the negotiations.<br />The EXPLORE interface allows the user to search, filter and read verbatim text directly from ENB.</p>
          </div>
          <div className="read-more">Read more</div>
          <div className="about-partners">
            <a  href="http://www.medialab.sciences-po.fr/"
                target="_blank">
              <img  src="assets/img/sciences-po-medialab.svg"
                    alt="Medialab SciencesPo" />
            </a>
            <a  href="http://lsir.epfl.ch/"
                target="_blank">
              <img  src="assets/img/epfl.svg"
                    alt="EPFL" />
            </a>
            <a  href="http://ateliericeberg.fr/"
                target="_blank">
              <img  src="assets/img/atelier-iceberg.svg"
                    alt="Atelier Iceberg" />
            </a>
          </div>
        </div>
      </div>
    );
  }
});
