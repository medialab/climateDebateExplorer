'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    BaobabBranchMixin = require('baobab-react/mixins').branch,
    EM = 16;

module.exports = React.createClass({
  displayName: 'climateDebateExplorer/explorer/stats',
  mixins: [ BaobabBranchMixin ],
  cursors: {
    fields: ['cached', 'config', 'fields'],
    filtersIndex: ['views', 'filtersIndex'],
    deployedList: ['appState', 'deployedList'],
    aggregations: ['cached', 'config', 'aggregations'],
    aggregatedLists: ['contextual', 'aggregatedLists']
  },

  // Handlers
  componentDidMount: function(e) {
    window.addEventListener('resize', this._updateBlockSize, false);
    this._updateBlockSize();
  },
  toggle: function(e) {
    if (this.state.deployedList)
      this.cursors.deployedList.set(null);
    else
      this.cursors.deployedList.set(e.currentTarget.getAttribute('data-id'));
  },

  // Helpers
  _updateBlockSize: function() {
    var dom = ReactDOM.findDOMNode(this);

    this.setState({
      nbLines: Math.floor(((dom.offsetHeight - EM) / 3 - 4 * EM) / (2.5 * EM))
    });
  },

  render: function() {
    return (
      <div className="stats">
        <div className="column-title">Statistics</div>
        { (
            this.state.deployedList ?
              [this.state.deployedList] :
              this.state.aggregations
          ).map(function(field, i) {
            var displayed = 0,
                filter = this.state.filtersIndex[field] || {};

            return (
              <div  key={ field }
                    className={
                      this.state.deployedList ?
                        'block expanded' :
                        'block'
                    }>
                <div className="block-title">{
                  this.state.fields[field].label || field
                }</div>
                <div className="block-content">{
                  (this.state.aggregatedLists[field] || []).map(function(line, i) {
                    var display = Math.round(line.value * 100) + '%';

                    // Hide filtered values:
                    if (filter[line.id])
                      return undefined;

                    // Truncate values count to display:
                    if (!this.state.deployedList && displayed >= this.state.nbLines)
                      return undefined;

                    // If you're still here, then the line will be displayed:
                    displayed++;

                    return (
                      <div  className="chart-line"
                            data-field={ field }
                            key={ i }>
                        <div  className="chart-line-bar"
                              data-figure={ display }>
                          <div  className="chart-line-fill"
                                style={{
                                  width: display
                                }}></div>
                        </div>
                        <div className="chart-line-label">{ line.id }</div>
                      </div>
                    );
                  }, this)
                }</div>
                <div  className="block-more"
                      data-id="topics"
                      onClick={ this.toggle }>See more results</div>
              </div>
            );
          }, this) }
      </div>
    );
  }
});
