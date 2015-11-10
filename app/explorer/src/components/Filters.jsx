'use strict';

var _ = require('lodash'),
    React = require('react'),
    BaobabBranchMixin = require('baobab-react/mixins').branch;

module.exports = React.createClass({
  displayName: 'climateDebateExplorer/explorer/filters',
  mixins: [ BaobabBranchMixin ],
  cursors: {
    valuesLists: ['cached', 'valuesLists'],
    filtersIndex: ['views', 'filtersIndex'],

    fields: ['cached', 'config', 'fields'],
    filterBlocks: ['cached', 'config', 'filters']
  },

  getInitialState: function() {
    return {
      deployed: {}
    };
  },

  // Handlers:
  search: function(e) {
    console.log('TODO: search handler');
  },
  toggleBlock: function(e) {
    var field = e.currentTarget.getAttribute('data-field');

    this.setState({
      deployed: _.set(this.state.deployed, field, !this.state.deployed[field])
    });
  },
  onClickInput: function(e) {
    var target = e.currentTarget,
        field = target.getAttribute('data-field'),
        value = target.getAttribute('data-value');

    this.context.tree.emit('actions:filter', {
      field: field,
      value: value
    });
  },

  render: function() {
    return (
      <div className="filters">
        <div className="column-title">Filters</div>

        <div  className="search"
              onChange={ this.search }>
          <input type="text" />
        </div>

        { (this.state.filterBlocks || []).map(function(filterBlock, i) {
            var field = filterBlock.field,
                deployed = !!this.state.deployed[field],
                filteredValues = this.state.filtersIndex[field] || {};

            return (
              <div  key={ field }
                    data-id={ field }
                    className="block"
                    data-deployed={ deployed || undefined }>
                <div  data-field={ field }
                      className="block-title"
                      onClick={ this.toggleBlock }>{
                  this.state.fields[field].label || field
                }</div>

                <div className="block-content">
                  <ul className="filters-list">{
                    deployed ?
                      this.state.valuesLists[field].map(function(value, j) {
                        var id = 'filter-' + field + '-' + value;

                        return (
                          <li key={ j }
                              className="filter">
                            <input  id={ id }
                                    name={ id }
                                    type="checkbox"
                                    data-field={ field }
                                    data-value={ value }
                                    onChange={ this.onClickInput }
                                    checked={ !!filteredValues[value] } />
                            <label  htmlFor={ id }
                                    className="filter-label">{ value }</label>
                          </li>
                        );
                      }, this) :
                      undefined
                  }</ul>
                </div>
              </div>
            );
          }, this) }
      </div>
    );
  }
});
