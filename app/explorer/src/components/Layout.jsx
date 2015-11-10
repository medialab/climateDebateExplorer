'use strict';

var React = require('react'),
    BaobabBranchMixin = require('baobab-react/mixins').branch,
    Header = require('./Header.jsx'),
    About = require('./About.jsx'),
    Disclaimer = require('./Disclaimer.jsx'),
    Menu = require('./Menu.jsx'),
    Context = require('./Context.jsx'),
    Filters = require('./Filters.jsx'),
    Stats = require('./Stats.jsx'),
    Verbatims = require('./Verbatims.jsx'),
    Timeline = require('./Timeline.jsx');

module.exports = React.createClass({
  displayName: 'climateDebateExplorer/explorer/layout',
  mixins: [ BaobabBranchMixin ],
  cursors: {},

  render: function() {
    return (
      <div className="app">
        <Header />
        <About />
        <Disclaimer />
        <Menu />
        <Context />
        <div className="content">
          <Filters />
          <Stats />
          <div className="right-content">
            <Verbatims />
            <Timeline />
          </div>
        </div>
      </div>
    );
  }
});
