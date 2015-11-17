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
    var target = e.currentTarget;

    this.context.tree.emit('actions:filter', {
      field: target.getAttribute('data-field'),
      value: target.getAttribute('data-value')
    });
  },

  render: function() {
    var self = this,
        fields = this.state.fields,
        filters = this.state.filters,
        events = fields.event_id.values;

    return (
      <div className="context">
        <div className="filters-list">{
          filters.reduce(function(res, filter, i) {
            var field = fields[filter.field];

            res.push(
              <div  key={ 'title-' + filter.field }
                    className="filter-field"
                    data-field={ filter.field }>{
                (field.label || filter.field) + ' :'
              }</div>
            );

            filter.values.map(function(v, j, a) {
              if (j && a.length > 1)
                res.push(
                  <div  key={ 'join-' + filter.field + '-' + j }
                        className="filter-join">{
                    (j === a.length - 1) ?
                      (field.operator || 'and').toUpperCase() :
                      ', '
                  }</div>
                );

              res.push(
                <div  key={ 'filter-' + filter.field + '-' + j }
                      className="filter-value"
                      data-value={ v }
                      data-field={ filter.field }
                      onClick={ self.delete }>
                  <div className="filter-label">{
                    // HACK:
                    // Fetch events proper label:
                    filter.field === 'event_id' ?
                      [ events[v].year,
                        events[v].city,
                        events[v].country ].join(', ') :
                      v
                  }</div>
                  <div className="filter-cross"></div>
                </div>
              );
            });

            return res;
          }, [])
        }</div>
      </div>
    );
  }
});
