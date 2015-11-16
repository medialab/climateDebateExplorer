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
          <p className="about-text">The climate is changing. Efforts to reduce greenhouse emissions have so far been ineffective or, at least, insufficient. As the impacts of global warming are emerging, our societies experience an unprecedented pressure. How to live with climate change without giving up fighting it? How to share the burden of adaptation among countries, regions and communities? How to be fair to all human and non-human beings affected by such a planetary transition?The climate is changing. Efforts to reduce greenhouse emissions have so far been ineffective or, at least, insufficient. As the impacts of global warming are emerging, our societies experience an unprecedented pressure. How to live with climate change without giving up fighting it? How to share the burden of adaptation among countries, regions and communities? How to be fair to all human and non-human beings affected by such a planetary transition?</p>
          <div className="read-more">Read more</div>
          <div className="about-partners">
            <img  src="assets/sciences-po-medialab.svg"
                  alt="Medialab SciencesPo" />
            <img  className="epfl"
                  src="assets/epfl.svg"
                  alt="EPFL" />
            <img  src="assets/atelier-iceberg.svg"
                  alt="Atelier Iceberg" />
          </div>
        </div>
      </div>
    );
  }
});
