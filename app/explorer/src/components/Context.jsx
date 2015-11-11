'use strict';

var React = require('react'),
    BaobabBranchMixin = require('baobab-react/mixins').branch;

module.exports = React.createClass({
  displayName: 'climateDebateExplorer/explorer/context',
  mixins: [ BaobabBranchMixin ],
  cursors: {
    fields: ['cached', 'config', 'fields'],
    filters: ['appState', 'filters']
  },

  // Handlers
  delete: function(e) {

  },

  render: function() {
    return (
      <div className="context">
        <div className="filters-list">{
          this.state.filters.map(function(filter, i) {
            return (
              <div  className="filter"
                    key={ i }>
                <div  className="filter-field"
                      data-field={ filter.field }>{
                  (this.state.fields[filter.field].label || filter.field) + ' :'
                }</div>
                <div className="filter-values">{
                  filter.values.map(function(v, j) {
                    return (
                      <div key={ j }>
                        <div className="filter-value"
                              onClick={ this.delete }>
                          <div className="filter-value-label">{ v }</div>
                          <div className="filter-value-cross"></div>
                        </div>
                        {
                          j === filter.values.length - 1 ?
                            '' :
                            <div className="filter-join">AND</div>
                        }
                      </div>
                    );
                  }, this)
                }</div>
              </div>
            );
          }, this)
        }</div>
      </div>
    );
  }
});
