'use strict';

var _ = require('lodash'),
    React = require('react'),
    BaobabBranchMixin = require('baobab-react/mixins').branch,
    filtersFacet = require('../utils/filtersFacet');


var SIZE = 50;

module.exports = React.createClass({
  displayName: 'climateDebateExplorer/explorer/verbatims',
  mixins: [ BaobabBranchMixin ],
  cursors: {
    filters: ['appState', 'filters'],
    fields: ['cached', 'config', 'fields'],
    deployed: ['appState', 'deployedVerbatim'],
    deployedContent: ['views', 'deployedVerbatimContent']
  },



  componentDidMount: function() {
    this.cursors.filters.on('update', this._loadListAsync.bind(this, false));
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
    var id = e.currentTarget.getAttribute('data-id');

    if (this.state.deployed !== id)
      this.cursors.deployed.set(id);
  },
  collapse: function(e) {
    this.cursors.deployed.set(undefined);
  },
  openPermalink: function(e) {
    var permalink = e.currentTarget.getAttribute('data-permalink');
    window.open(permalink, '_blank');
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

    var queryResult = this.context.tree.datastore.query({
      query: faceted,
      from: morePosts ?
        (this.state.results || []).length :
        0,
      size: SIZE
    });

    var verbatims = morePosts ?
      (this.state.verbatims || []).concat(queryResult.hits) :
      queryResult.hits;

    if (this.state.verbatims && this.state.verbatims.length)
      this.collapse();

    this.setState({
      verbatims: verbatims,
      total: queryResult.total,
      fullList: queryResult.total === verbatims.length
    });

    // Scroll to top, if full list reloaded:
    if (!morePosts && list)
      setTimeout(function() {
        list.scrollTop = 0;
      }, 0);
  },
  _getList: function() {
    var events = this.state.fields.event_id.values;

    return (
      <ul ref="verbatims"
          className="minutes"
          onScroll={ this.handleScroll }>{
        (this.state.verbatims || []).map(function(obj, i) {
          return (
            <li key={ i }
                data-id={ obj.id }
                className="minute">
              <div className="minute-content">
                <div className="minute-actions">
                  <div className="minute-number">{ i + 1 }</div>
                  <div  className="minute-see"
                        data-id={ obj.id }
                        onClick={ this.deploy } />
                  <div  className="minute-share"
                        data-permalink={ obj.url }
                        onClick={ this.openPermalink } />
                </div>
                <div className="minute-context">{
                  [ obj.year,
                    (events[obj.event_id] || {}).country,
                    (events[obj.event_id] || {}).city ].join(' | ')
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
    var events = this.state.fields.event_id.values,
        obj = this.state.deployedContent;

    if (!obj)
      return <div className="minute-deployed" />;

    return (
      <div className="minute-deployed">
        <div className="minute">
          <div className="minute-actions">
            <div  className="minute-see"
                  data-id={ obj.id }
                  onClick={ this.collapse } />
            <div  className="minute-share"
                  data-permalink={ obj.url }
                  onClick={ this.openPermalink } />
          </div>
          <div className="minute-context">{
            [ obj.year,
              events[obj.event_id].country,
              events[obj.event_id].city ].join(' | ')
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
        <div className="minute-verbatim">
          <iframe width="100%" height="100%" frameBorder="0">
            Woops, something went wrong here...
          </iframe>
        </div>
      </div>
    );
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
