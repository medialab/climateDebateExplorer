'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    BaobabBranchMixin = require('baobab-react/mixins').branch,
    EM = 14;

module.exports = React.createClass({
  displayName: 'climateDebateExplorer/explorer/stats',
  mixins: [ BaobabBranchMixin ],
  cursors: {
    contextual: ['contextual'],
    fields: ['cached', 'config', 'fields'],
    deployedList: ['appState', 'deployedList'],
    stats: ['cached', 'config', 'stats']
  },

  // Handlers
  componentDidMount: function(e) {
    window.addEventListener('resize', this._updateBlockSize, false);
    this._updateBlockSize();
  },
  expand: function(e) {
    this.cursors.deployedList.set(e.currentTarget.getAttribute('data-field'));
  },
  hide: function(e) {
    this.cursors.deployedList.set(null);
  },

  // Helpers
  _updateBlockSize: function() {
    var dom = ReactDOM.findDOMNode(this);

    this.setState({
      nbLines: Math.floor(((dom.offsetHeight - 2 * EM) / 3 - 4.5 * EM) / (2.5 * EM))
    });
  },

  render: function() {
    var total = this.state.contextual.total,
        filtersIndex = this.state.contextual.filtersIndex;

    return (
      <div className="stats">
        <div className="column-title">Statistics</div>
        <div  className={
                this.state.deployedList ?
                  'stats-back' :
                  'stats-back hidden'
              }
              onClick={ this.expand }>
          <span className="stats-back-text"
                data-text={
                  filtersIndex[this.state.deployedList] ?
                    'Back to related contents' :
                    'Back to all statistics'
                }
                data-short-text="Back"></span>
        </div>
        { (
            this.state.deployedList ?
              [this.state.deployedList] :
              this.state.stats
          ).map(function(field, i) {
            var displayed = 0,
                events = this.state.fields.event_id.values,
                filter = this.state.contextual.filtersIndex[field] || {};

            return (
              <div  key={ field }
                    className={
                      this.state.deployedList ?
                        'block expanded' :
                        'block'
                    }>
                <div  className="block-title"
                      data-before={
                        filtersIndex[field] ?
                          'Most related' :
                          'Most recurring'
                      }
                      data-field={ field }>
                  <span>{
                    this.state.fields[field].label || field
                  }</span>
                </div>
                <div className="block-content">{
                  (this.state.contextual.aggregatedLists[field] || []).map(function(line, i) {
                    var display = Math.round(line.value / total * 100) + '%';

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
                                data-field={ field }
                                style={{
                                  width: display
                                }}></div>
                        </div>
                        <div  className="chart-line-label"
                              title={
                                field === 'event_id' ?
                                  [ events[line.id].year,
                                    events[line.id].city,
                                    events[line.id].country ].join(', ') :
                                  line.id
                              }>{
                          // HACK:
                          // Fetch events proper label:
                          field === 'event_id' ?
                            [ events[line.id].year,
                              events[line.id].city,
                              events[line.id].country ].join(', ') :
                            line.id
                        }</div>
                      </div>
                    );
                  }, this)
                }</div>
                <div  className={
                        this.state.deployedList ?
                          'block-more hidden' :
                          'block-more'
                      }
                      data-field={ field }
                      onClick={ this.expand }>See more { (this.state.fields[field].label || field).toLowerCase() }</div>
              </div>
            );
          }, this) }
      </div>
    );
  }
});
