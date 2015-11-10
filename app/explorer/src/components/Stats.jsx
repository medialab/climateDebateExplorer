'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    BaobabBranchMixin = require('baobab-react/mixins').branch,
    EM = 16;

module.exports = React.createClass({
  displayName: 'climateDebateExplorer/explorer/stats',
  mixins: [ BaobabBranchMixin ],
  cursors: {},

  getInitialState: function() {
    return {
      expanded: null
    };
  },

  // Handlers
  componentDidMount: function(e) {
    window.addEventListener('resize', this._updateBlockSize, false);
    this._updateBlockSize();
  },
  more: function(e) {
    if (this.state.expanded)
      this.setState({
        expanded: null
      });
    else
      this.setState({
        expanded: e.currentTarget.getAttribute('data-id')
      });
  },

  // Helpers
  _updateBlockSize: function() {
    var dom = ReactDOM.findDOMNode(this);

    this.setState({
      nbLines: Math.floor(((dom.offsetHeight - EM) / 3 - 4 * EM) / (2.5 * EM))
    });
  },

  render: function() {
    var data = [
          {name: 'Cheval', figure: 90 },
          {name: 'Cheval', figure: 85 },
          {name: 'Cheval', figure: 70 },
          {name: 'Cheval', figure: 60 },
          {name: 'Cheval', figure: 55 },
          {name: 'Cheval', figure: 50 },
          {name: 'Cheval', figure: 40 },
          {name: 'Cheval', figure: 30 },
          {name: 'Cheval', figure: 20 },
          {name: 'Cheval', figure: 15 },
          {name: 'Cheval', figure: 15 },
          {name: 'Cheval', figure: 15 },
          {name: 'Cheval', figure: 15 },
          {name: 'Cheval', figure: 15 },
          {name: 'Cheval', figure: 15 },
          {name: 'Cheval', figure: 15 },
          {name: 'Cheval', figure: 15 },
          {name: 'Cheval', figure: 15 },
          {name: 'Cheval', figure: 15 },
          {name: 'Cheval', figure: 15 },
          {name: 'Cheval', figure: 15 },
          {name: 'Cheval', figure: 15 },
          {name: 'Cheval', figure: 15 },
          {name: 'Cheval', figure: 15 },
          {name: 'Cheval', figure: 15 },
          {name: 'Cheval', figure: 15 },
          {name: 'Cheval', figure: 15 },
          {name: 'Cheval', figure: 15 },
          {name: 'Cheval', figure: 15 },
          {name: 'Cheval', figure: 15 }
        ],
        bars = this.state.expanded ?
          data :
          data.slice(0, this.state.nbLines);

    return (
      <div className="stats">
        <div className="column-title">Statistics</div>
        <div  className={
                this.state.expanded === null ?
                  'block' :
                  this.state.expanded === 'topics' ?
                    'block expanded' :
                    'block hidden'
              }>
          <div className="block-title">Topics</div>
          <div className="block-content">{
            bars.map(function(line, i) {
              return (
                <div  className="chart-line topic"
                      key={ i }>
                  <div  className="chart-line-bar"
                        data-figure={ line.figure + '%' }>
                    <div  className="chart-line-fill"
                          style={{
                            width: line.figure + '%'
                          }}></div>
                  </div>
                  <div className="chart-line-label">{ line.name }</div>
                </div>
              );
            })
          }</div>
          <div  className="block-more"
                data-id="topics"
                onClick={ this.more }>See more results</div>
        </div>
        <div  className={
                this.state.expanded === null ?
                  'block' :
                  this.state.expanded === 'groupings' ?
                    'block expanded' :
                    'block hidden'
              }>
          <div className="block-title">Groupings</div>
          <div className="block-content">{
            bars.map(function(line, i) {
              return (
                <div  className="chart-line grouping"
                      key={ i }>
                  <div  className="chart-line-bar"
                        data-figure={ line.figure + '%' }>
                    <div  className="chart-line-fill"
                          style={{
                            width: line.figure + '%'
                          }}></div>
                  </div>
                  <div className="chart-line-label">{ line.name }</div>
                </div>
              );
            })
          }</div>
          <div  className="block-more"
                data-id="groupings"
                onClick={ this.more }>See more results</div>
        </div>
        <div  className={
                this.state.expanded === null ?
                  'block' :
                  this.state.expanded === 'events' ?
                    'block expanded' :
                    'block hidden'
              }>
          <div className="block-title">Events</div>
          <div className="block-content">{
            bars.map(function(line, i) {
              return (
                <div  className="chart-line event"
                      key={ i }>
                  <div  className="chart-line-bar"
                        data-figure={ line.figure + '%' }>
                    <div  className="chart-line-fill"
                          style={{
                            width: line.figure + '%'
                          }}></div>
                  </div>
                  <div className="chart-line-label">{ line.name }</div>
                </div>
              );
            })
          }</div>
          <div  className="block-more"
                data-id="events"
                onClick={ this.more }>See more results</div>
        </div>
      </div>
    );
  }
});
