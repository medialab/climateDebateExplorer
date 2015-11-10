'use strict';

var React = require('react'),
    BaobabBranchMixin = require('baobab-react/mixins').branch;

module.exports = React.createClass({
  displayName: 'climateDebateExplorer/explorer/filters',
  mixins: [ BaobabBranchMixin ],
  cursors: {},

  getInitialState: function() {
    return {
      filters: {
        countries: false,
        groupings: false,
        topics: false,
        events: false
      }
    };
  },

  // Handlers:
  search: function(e) {
    console.log('TODO: search handler');
  },
  toggle: function(e) {
    var block = e.currentTarget.getAttribute('data-id'),
        filters = this.state.filters;

    if (Array.isArray(filters[block]))
      filters[block] = false;
    else
      filters[block] = [];

    this.setState({
      filters: filters
    });
  },
  subToggle: function(e) {
    var block = e.currentTarget.getAttribute('data-block'),
        subBlock = e.currentTarget.getAttribute('data-sub-block'),
        filters = this.state.filters;

    if (filters[block].indexOf(subBlock) < 0)
      filters[block].push(subBlock);
    else
      filters[block] = filters[block].filter(function(f) {
        return f !== subBlock;
      });

    this.setState({
      filters: filters
    });
  },

  render: function() {
    var data = {
      countries: [
        {name: 'Europe', values: ['France', 'Spain']},
        {name: 'Africa', values: ['France', 'Spain']},
      ],
      groupings: [
        {name: 'Europe', values: ['France', 'Spain']},
        {name: 'Africa', values: ['France', 'Spain']},
      ],
      topics: [
        {name: 'Europe', values: ['France', 'Spain']},
        {name: 'Africa', values: ['France', 'Spain']},
      ],
      events: [
        {name: 'Europe', values: ['France', 'Spain']},
        {name: 'Africa', values: ['France', 'Spain']},
      ]
    };

    return (
      <div className="filters">
        <div className="column-title">Filters</div>


        <div  className="search"
              onChange={ this.search }>
          <input type="text" />
        </div>


        <div className="block">
          <div  className="block-title"
                data-id="countries"
                onClick={ this.toggle }>Countries</div>
          <div  className={
                  Array.isArray(this.state.filters.countries) ?
                    'block-content expanded' : 'block-content'
                }>{
            data.countries.map(function(area, i) {
              return (
                <div  className="sub-block"
                      key={ i }>
                  <div  className="sub-block-title"
                        data-block="countries"
                        data-sub-block={ area.name }
                        onClick={ this.subToggle }>{
                    area.name
                  }</div>
                  <div className="sub-block-content">{
                    (
                      ( Array.isArray(this.state.filters.countries) &&
                        this.state.filters.countries.indexOf(area.name) < 0 ) ?
                        [] : area.values
                    ).map(function(country, j) {
                      return (
                        <div  className="filter"
                              key={ j }>
                          <div className="filter-label">{
                            country
                          }</div>
                          <input type="checkbox" />
                        </div>
                      );
                    }, this)
                  }</div>
                </div>
              );
            }, this)
          }</div>
        </div>
      </div>
    );
  }
});
