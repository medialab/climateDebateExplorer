'use strict';

var _ = require('lodash'),
    React = require('react'),
    BaobabBranchMixin = require('baobab-react/mixins').branch;

module.exports = React.createClass({
  displayName: 'climateDebateExplorer/explorer/filters',
  mixins: [ BaobabBranchMixin ],
  cursors: {
    contextual: ['contextual'],
    valuesLists: ['cached', 'valuesLists'],

    fields: ['cached', 'config', 'fields'],
    filterBlocks: ['cached', 'config', 'filters']
  },

  getInitialState: function() {
    return {
      deployedBlocks: {},
      deployedGroups: {},
      search: {}
    };
  },

  // Handlers:
  onSearchChange: function(e) {
    var fields = this.state.fields,
        events = fields.event_id.values,
        query = (e.currentTarget.value || '').toLowerCase(),
        results;

    if (query.length >= 1) {
      results = [];
      (this.state.filterBlocks || []).forEach(function(block, i) {
        var field = block.field;
        this.state.valuesLists[field].forEach(function(value) {
          var score,
              label = field === 'event_id' ?
                [ events[value].city,
                  events[value].country ].join(', ') :
                value,
              index = label.toLowerCase().indexOf(query);

          // Perfect match:
          if (index === 0 && label.length === query.length) {
            score = 3;
            label = [{ text: label, highlight: true }];
          }

          // Starts with...
          else if (index === 0){
            score = 2;
            label = [
              { text: label.substring(0, query.length), highlight: true },
              { text: label.substring(query.length, label.length) }
            ];
          }

          // Contains...
          else if (index >= 0){
            score = 1;
            label = [
              { text: label.substring(0, index) },
              { text: label.substring(index, index + query.length), highlight: true },
              { text: label.substring(index + query.length, label.length) }
            ];
          }

          if (score)
            results.push({
              score: score,
              field: field,
              label: label,
              value: value
            });
        });
      }, this);
      results = _.sortBy(results, 'score').reverse();
    }

    this.setState({
      searchQuery: query,
      searchResults: results
    });
  },
  onSearchBlur: function() {
    // HACK:
    setTimeout((function() {
      this.setState({
        resultsDisplayed: false
      });
    }).bind(this), 100);
  },
  onSearchFocus: function() {
    this.setState({
      resultsDisplayed: true
    });
  },
  toggleBlock: function(e) {
    var field = e.currentTarget.getAttribute('data-field');

    this.setState({
      deployedBlocks: _.set(
        this.state.deployedBlocks,
        field,
        !this.state.deployedBlocks[field]
      )
    });
  },
  toggleGroup: function(e) {
    var target = e.currentTarget,
        field = target.getAttribute('data-field'),
        group = target.getAttribute('data-group'),
        deployedGroups = this.state.deployedGroups;

    deployedGroups[field] = deployedGroups[field] || {};
    deployedGroups[field][group] = !deployedGroups[field][group];

    this.setState({
      deployedGroups: deployedGroups
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

  _getFilter: function(obj) {
    var id = 'filter-' + obj.field + '-' + obj.value;

    return (
      <li key={ obj.key }
          className="filter">
        <input  id={ id }
                name={ id }
                type="checkbox"
                data-field={ obj.field }
                data-value={ obj.value }
                onChange={ this.onClickInput }
                checked={ obj.checked } />
        <label  htmlFor={ id }
                className="filter-label">
          <span className="label-wrapper"
                title={ obj.label }>{
            obj.label
          }</span>
          {
            obj.field === 'event_id' ?
              <span className="event-label-wrapper"
                    title={ obj.longLabel }>
                <br/>
                { obj.longLabel }
              </span> :
              ''
          }
        </label>
      </li>
    );
  },

  render: function() {
    var fields = this.state.fields,
        events = fields.event_id.values;

    return (
      <div  className="filters"
            data-active-search={
              (this.state.searchResults && this.state.resultsDisplayed) || undefined
            }>
        <div className="column-title">Filters</div>

        <div  className="search">
          <input  type="text"
                  placeholder="Search"
                  onBlur={ this.onSearchBlur }
                  onFocus={ this.onSearchFocus }
                  onChange={ this.onSearchChange }
                  value={ this.state.searchQuery } />
          <div className="custom-border"></div>

          { (this.state.searchResults && this.state.resultsDisplayed) ?
              <ul className="results-list">{
                this.state.searchResults.length ?
                  (this.state.searchResults || []).map(function(res, i) {
                    return (
                      <li key={ i }
                          className="result"
                          data-field={ res.field }
                          data-value={ res.value }
                          data-score={ res.score }
                          onClick={ this.onClickInput }>{
                        res.label.map(function(obj, j) {
                          return (
                            <span key={ j }
                                  className={
                                    obj.highlight ? 'highlighted' : ''
                                  }>{
                              obj.text
                            }</span>
                          );
                        })
                      }</li>
                    );
                  }, this) :
                  <li className="no-result">{
                    'No result'
                  }</li>
              }</ul> :
              undefined }
        </div>

        <div className="filter-blocks">
          { (this.state.filterBlocks || []).map(function(filterBlock, i) {
              var field = filterBlock.field,
                  deployedBlocks = !!this.state.deployedBlocks[field],
                  deployedGroups = this.state.deployedGroups[field] || {},
                  filteredValues =
                    this.state.contextual.filtersIndex[field] || {};

              return (
                <div  key={ field }
                      data-id={ field }
                      className="block"
                      data-deployed={ deployedBlocks || undefined }>
                  <div  data-field={ field }
                        className="block-title"
                        data-before="Filtered by"
                        onClick={ this.toggleBlock }>
                    <span>{
                      fields[field].label || field
                    }</span>
                    <div  className="arrow"
                          data-deployed={ deployedBlocks || undefined }></div>
                  </div>

                  <div className="block-content">
                    <ul className="filters-list">{
                      !deployedBlocks ?
                        undefined :
                      fields[field].groupBy ?
                        _.sortBy(
                          _.pairs(
                            _.groupBy(
                              this.state.valuesLists[field].map(function(str) {
                                return fields[field].values[str];
                              }),
                              fields[field].groupBy
                            )
                          ),
                          function(arr) {
                            return arr[0];
                          }
                        )
                        .map(function(arr, j) {
                          var group = arr[0],
                              values = arr[1],
                              deployed = deployedGroups[group];

                          return (
                            <li key={ j }
                                className="group"
                                data-deployed={ !!deployed }>
                              <h3 className="group-title"
                                  data-deployed={ !!deployed }
                                  data-field={ field }
                                  data-group={ group }
                                  onClick={ this.toggleGroup }>{
                                group
                              }</h3>
                              <ul className="filters-list">{
                                deployed ?
                                  values.map(function(obj, k) {
                                    return this._getFilter({
                                      key: k,
                                      field: field,
                                      value: obj.id,
                                      checked: !!filteredValues[obj.id],
                                      // HACK:
                                      // Fetch events proper label:
                                      label: field === 'event_id' ?
                                        [ obj.city,
                                          obj.country ].join(', ') :
                                        obj.id,
                                      longLabel: obj['long_title']
                                    });
                                  }, this) :
                                  undefined
                              }</ul>
                            </li>
                          );
                        }, this) :
                        this.state.valuesLists[field].map(function(value, j) {
                          return this._getFilter({
                            key: j,
                            value: value,
                            field: field,
                            checked: !!filteredValues[value],
                            // HACK:
                            // Fetch events proper label:
                            label: field === 'event_id' ?
                              [ events[value].city,
                                events[value].country ].join(', ') :
                              value
                          });
                        }, this)
                    }</ul>
                  </div>
                </div>
              );
            }, this) }
        </div>
      </div>
    );
  }
});
