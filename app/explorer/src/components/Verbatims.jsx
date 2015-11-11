'use strict';

var React = require('react'),
    BaobabBranchMixin = require('baobab-react/mixins').branch;

module.exports = React.createClass({
  displayName: 'climateDebateExplorer/explorer/verbatims',
  mixins: [ BaobabBranchMixin ],
  cursors: {},

  render: function() {
    var data = [
      {
        year: 2009,
        place: 'Copenhagen',
        event: 'COP 8',
        title: 'This is my very tiny title',
        groupings: ['Group1', 'Group2'],
        topics: ['toilet paper', 'Forest']
      },
      {
        year: 2009,
        place: 'Copenhagen',
        event: 'COP 8',
        title: 'This is my very tiny title',
        groupings: ['Group1', 'Group2'],
        topics: ['toilet paper', 'Forest']
      },
      {
        year: 2009,
        place: 'Copenhagen',
        event: 'COP 8',
        title: 'This is my very tiny title',
        groupings: ['Group1', 'Group2'],
        topics: ['toilet paper', 'Forest']
      },
      {
        year: 2009,
        place: 'Copenhagen',
        event: 'COP 8',
        title: 'This is my very tiny title',
        groupings: ['Group1', 'Group2'],
        topics: ['toilet paper', 'Forest']
      },
      {
        year: 2009,
        place: 'Copenhagen',
        event: 'COP 8',
        title: 'This is my very tiny title',
        groupings: ['Group1', 'Group2'],
        topics: ['toilet paper', 'Forest']
      },
      {
        year: 2009,
        place: 'Copenhagen',
        event: 'COP 8',
        title: 'This is my very tiny title',
        groupings: ['Group1', 'Group2'],
        topics: ['toilet paper', 'Forest']
      },
      {
        year: 2009,
        place: 'Copenhagen',
        event: 'COP 8',
        title: 'This is my very tiny title',
        groupings: ['Group1', 'Group2'],
        topics: ['toilet paper', 'Forest']
      },
      {
        year: 2009,
        place: 'Copenhagen',
        event: 'COP 8',
        title: 'This is my very tiny title',
        groupings: ['Group1', 'Group2'],
        topics: ['toilet paper', 'Forest']
      },
      {
        year: 2009,
        place: 'Copenhagen',
        event: 'COP 8',
        title: 'This is my very tiny title',
        groupings: ['Group1', 'Group2'],
        topics: ['toilet paper', 'Forest']
      }
    ];

    return (
      <div className="verbatims">
        <div className="column-title">Verbatims</div>


        <ul className="minutes">{
          data.map(function(minute, i) {
            return (
              <li  className="minute"
                    key={ i }>
                <div className="minute-actions">
                  <div className="minute-number">{ i }</div>
                  <div className="minute-see"></div>
                  <div className="minute-share"></div>
                </div>
                <div className="minute-context">{
                  minute.year + ' | ' + minute.place + ' | ' + minute.event
                }</div>
                <div className="minute-title">{
                  minute.title
                }</div>
                <div className="minute-tags">{
                  minute.groupings.map(function(g) {
                    return {
                      class: 'groupings',
                      value: g
                    };
                  }).concat(
                    minute.topics.map(function(t) {
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
              </li>
            );
          }, this)
        }</ul>
      </div>
    );
  }
});
