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
    cached: ['cached'],
    contextual: ['contextual'],

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

    if (this.state.deployed !== id) {
      this.cursors.deployed.set(id);
      this.setState({
        lastScroll: this.refs.verbatims.scrollTop
      });
    }
  },
  collapse: function(e) {
    this.cursors.deployed.set(undefined);

    if (typeof this.state.lastScroll)
      setTimeout((function() {
        this.refs.verbatims.scrollTop = this.state.lastScroll;
      }).bind(this), 0);
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
        (this.state.verbatims || []).length :
        0,
      size: SIZE
    });

    var verbatims = morePosts ?
      (this.state.verbatims || []).concat(queryResult.hits) :
      queryResult.hits;

    if (
      this.state.deployed &&
      this.state.verbatims &&
      this.state.verbatims.length
    )
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
      (this.state.verbatims || []).length ?
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
                    obj.year + ' | ' +
                    events[obj.event_id].country + ', ' +
                    events[obj.event_id].city
                  }</div>
                  <div  className="minute-description"
                        data-id={ obj.id }
                        onClick={ this.deploy }>
                    <span className="minute-title">{
                      obj.title
                    }</span>
                    <span className="minute-abstract">{
                      obj.abstract
                    }</span>
                  </div>
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
        }</ul> :
        <div className="no-result">
          <div className="wrapper">
            <div className="message">
              No result
            </div>
          </div>
        </div>
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
                  data-deployed="true"
                  onClick={ this.collapse } />
            <div  className="minute-share"
                  data-permalink={ obj.url }
                  onClick={ this.openPermalink } />
          </div>
          <div className="minute-context">{
            obj.year + ' | ' +
            events[obj.event_id].country + ', ' +
            events[obj.event_id].city
          }</div>
          <div  className="minute-description"
                data-id={ obj.id }
                onClick={ this.collapse }>
            <span className="minute-title">{
              obj.title
            }</span>
          </div>
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
          <iframe width="100%"
                  height="100%"
                  frameBorder="0"
                  src={ './bulletin/' + obj.id.replace(/_.*$/, '') + '.html#' + obj.id }>
            Woops, something went wrong here...
          </iframe>
        </div>
      </div>
    );
  },

  render: function() {
    var curTotal = this.state.contextual.total,
        total = this.state.cached.total;

    return (
      <div className="verbatims">
        <div className="column-title">
          Verbatims
          <small>{
            total === curTotal ?
              [ ' (',
                total,
                ' documents)' ].join('') :
              [ ' (',
                curTotal,
                ' results / ',
                total,
                ' documents)' ].join('')
          }</small>
        </div>

        { this.state.deployed ?
            this._getDeployed() :
            this._getList() }
      </div>
    );
  }
});
