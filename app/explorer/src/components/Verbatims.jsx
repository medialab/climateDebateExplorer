'use strict';

var React = require('react'),
    BaobabBranchMixin = require('baobab-react/mixins').branch,
    filtersFacet = require('../utils/filtersFacet');


var SIZE = 50;

module.exports = React.createClass({
  displayName: 'climateDebateExplorer/explorer/verbatims',
  mixins: [ BaobabBranchMixin ],
  cursors: {
    filters: ['appState', 'filters'],
    fields: ['cached', 'config', 'fields']
  },



  componentDidMount: function() {
    this.cursors.filters.on('update', this._loadListAsync.bind(this, false));
    this._loadList(false);
  },
  componentWillUnmount: function() {
    // WTF ?!? It comes from some other code of mine, and it cannot work.
    // Though, I'll leave it here, to preserve the "logic" of the thing...
    this.cursors.filters.off('update', this._loadListAsync.bind(this, false));
  },
  handleScroll: function() {
    if (this.state.fullList)
      return;

    var bottom = this.refs.bottom,
        verbatims = this.refs.verbatims;

    if (verbatims.scrollTop + verbatims.offsetHeight > bottom.offsetTop)
      this._loadList(true);
  },
  deploy: function(e) {
    // This feature is disabled at the moment, please come back later...
    return;

    var id = e.currentTarget.getAttribute('data-id');

    if (this.state.deployed !== id)
      this.setState({ deployed: id });
  },
  collapse: function(e) {
    this.setState({ deployed: undefined });
  },



  _loadListAsync: function(morePosts) {
    setTimeout(this._loadList.bind(this, false), 0);
  },
  _loadList: function(morePosts) {
    var k,
        list = this.refs.verbatims,
        faceted = filtersFacet(
          this.state.filters,
          this.state.fields
        );

    this.context.tree.datastore.query(
      { query: faceted,
        sort: ['event_id', 'id'],
        from: morePosts ?
          (this.state.results || []).length :
          0,
        size: SIZE },
      (function(queryResult) {
        var verbatims = morePosts ?
          (this.state.verbatims || []).concat(queryResult.hits) :
          queryResult.hits;

        this.setState({
          deployed: undefined,
          verbatims: verbatims,
          total: queryResult.total,
          fullList: queryResult.total === verbatims.length
        });

        // Scroll to top, if full list reloaded:
        if (!morePosts && list)
          setTimeout(function() {
            list.scrollTop = 0;
          }, 0);
      }).bind(this)
    );
  },
  _getVerbatim: function(obj, index) {
    return (
      <div className="minute-content">
        <div className="minute-actions">
          <div className="minute-number">{ index }</div>
          <div className="minute-see"></div>
          <div className="minute-share"></div>
        </div>
        <div className="minute-context">{
          [ obj.year,
            this.state.fields.event_id.values[obj.event_id].country,
            this.state.fields.event_id.values[obj.event_id].city ].join(' | ')
        }</div>
        <div className="minute-title">{
          obj.title
        }</div>
        <div className="minute-tags">{
          obj.actors.map(function(g) {
            return {
              class: 'groupings',
              value: g
            };
          }).concat(
            obj.topics.map(function(t) {
              return {
                class: 'topics',
                value: t
              };
            })
          ).map(function(tag, j) {
            return (
              <span className={ tag.class }
                    key={ j }>{
                tag.value
              }</span>
            );
          })
        }</div>
      </div>
    );
  },
  _getList: function() {
    return (
      <ul ref="verbatims"
          className="minutes"
          onScroll={ this.handleScroll }>{
        (this.state.verbatims || []).map(function(obj, i) {
          return (
            <li key={ i }
                data-id={ obj.id }
                className="minute"
                onClick={ this.deploy }>
              { this._getVerbatim(obj, i + 1) }
            </li>
          );
        }, this).concat(
          this.state.fullList ?
            undefined :
            <li key="bottom"
                ref="bottom"
                className="bottom" />
        )
      }</ul>
    );
  },
  _getDeployed: function() {
    // TODO
    return (<div />);
  },

  render: function() {
    return (
      <div className="verbatims">
        <div className="column-title">Verbatims</div>

        { this.state.deployed ?
            this._getDeployed() :
            this._getList() }
      </div>
    );
  }
});
