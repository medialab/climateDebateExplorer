'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    BaobabBranchMixin = require('baobab-react/mixins').branch;

module.exports = React.createClass({
  displayName: 'climateDebateExplorer/explorer/timeline',
  mixins: [ BaobabBranchMixin ],
  cursors: {
    contextual: ['contextual'],
    cachedList: ['cached', 'aggregatedLists', 'year'],
    list: ['cached', 'valuesLists', 'year']
  },

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
    if (!this.state.width)
      return <div className="timeline"></div>;

    var list = this.state.list || [],
        yearValues = this.state.contextual.aggregatedLists.year || [],
        values = yearValues.reduce(function(res, obj) {
          res[obj.id] = obj.value;
          return res;
        }, {}),
        max = 0,
        data =
          [{year: 'YEAR', label: '%', height: '50%'}]
            .concat(this.state.list.map(function(value) {
              var score =
                ((values[value] || 0) / this.state.cachedList[value]) * 100;

              max = Math.max(max, score);

              return {
                year: value,
                value: score
              };
            }, this));

    max = max || 1;

    return (
      <div className="timeline">{
        data.map(function(bar, i) {
          return (
            <div  className="bar-placeholder"
                  data-year={ bar.year }
                  key={ i }
                  style={{
                    width: this.state.width / ( data.length + 1 )
                  }}>
              <div  className="bar"
                    data-figure={ bar.label || Math.round(bar.value * 100) / 100 }
                    style={{
                      height: bar.height || ((bar.value / max * 100) + '%')
                    }}></div>
            </div>
          );
        }, this)
      }</div>
    );
  }
});
