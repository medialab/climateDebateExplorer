'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    BaobabBranchMixin = require('baobab-react/mixins').branch;

module.exports = React.createClass({
  displayName: 'climateDebateExplorer/explorer/timeline',
  mixins: [ BaobabBranchMixin ],
  cursors: {},

  // Handlers:
  componentDidMount: function(e) {
    window.addEventListener('resize', this._updateTimelineSize, false);
    this._updateTimelineSize();
  },

  // Helpers
  _updateTimelineSize: function() {
    this.setState({
      width: ReactDOM.findDOMNode(this).offsetWidth
    });
  },

  render: function() {
    var data = [
      {year: 94, value: 40},
      {year: 94, value: 40},
      {year: 94, value: 40},
      {year: 94, value: 40},
      {year: 94, value: 40},
      {year: 94, value: 40},
      {year: 94, value: 40},
      {year: 94, value: 40},
      {year: 94, value: 40},
      {year: 94, value: 40},
      {year: 94, value: 40},
      {year: 94, value: 40},
      {year: 94, value: 40},
      {year: 94, value: 40},
      {year: 94, value: 40},
      {year: 94, value: 40},
      {year: 94, value: 40},
      {year: 94, value: 40},
      {year: 94, value: 40},
      {year: 94, value: 10},
      {year: 94, value: 90}
    ];

    if (!this.state.width)
      return <div className="timeline"></div>;

    return (
      <div className="timeline">{
        [{year: 'YEAR', value: 50}].concat(data).map(function(bar, i) {
          return (
            <div  className="bar-placeholder"
                  data-year={ bar.year }
                  key={ i }
                  style={{
                    width: this.state.width / ( data.length + 1 )
                  }}>
              <div  className="bar"
                    data-figure={ bar.value }
                    style={{
                      height: bar.value + '%'
                    }}></div>
            </div>
          );
        }, this)
      }</div>
    );
  }
});
