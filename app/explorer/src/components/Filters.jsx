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

    filters[block] = !filters[block];
    this.setState({
      filters: filters
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
        <div className="block">
          <div  className="block-title"
                data-id="countries"
                onClick={ this.toggle }>Countries</div>
          <div  className={
                  this.state.filters.countries ?
                    'block-content expanded' : 'block-content'
                }>
            <div className="sub-block">
              <div className="sub-block-content">
                <div>Chien</div>
                <div>Chien</div>
                <div>Chien</div>
                <div>Chien</div>
                <div>Chien</div>
              </div>
            </div>
          </div>
        </div>
        <div className="block">
          <div  className="block-title"
                data-id="groupings"
                onClick={ this.toggle }>Groupings</div>
          <div  className={
                  this.state.filters.groupings ?
                    'block-content expanded' : 'block-content'
                }>
            <div className="sub-block">
              <div className="sub-block-content"></div>
            </div>
          </div>
        </div>
        <div className="block">
          <div  className="block-title"
                data-id="topics"
                onClick={ this.toggle }>Topics</div>
          <div  className={
                  this.state.filters.topics ?
                    'block-content expanded' : 'block-content'
                }>
            <div className="sub-block">
              <div className="sub-block-content"></div>
            </div>
          </div>
        </div>
        <div className="block">
          <div  className="block-title"
                data-id="events"
                onClick={ this.toggle }>Events</div>
          <div  className={
                  this.state.filters.events ?
                    'block-content expanded' : 'block-content'
                }>
            <div className="sub-block">
              <div className="sub-block-content"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
