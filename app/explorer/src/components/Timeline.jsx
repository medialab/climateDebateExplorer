'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    BaobabBranchMixin = require('baobab-react/mixins').branch;

module.exports = React.createClass({
  displayName: 'climateDebateExplorer/explorer/timeline',
  mixins: [ BaobabBranchMixin ],
  cursors: {
    contextual: ['contextual'],
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
        values = (this.state.contextual.aggregatedLists.year.values || []).reduce(function(res, obj) {
          res[obj.id] = obj.value;
          return res;
        }, {}),
        data = [{year: 'YEAR', value: 50}].concat(this.state.list.map(function(value) {
          return {
            year: value,
            value: (values[value] || 0) * 100
          };
        }));

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
                    data-figure={ Math.round(bar.value * 100) / 100 }
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
