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
        actors: ['France', 'USA', 'Spain'],
        topics: ['toilet paper', 'Forest']
      },
      {
        year: 2009,
        place: 'Copenhagen',
        event: 'COP 8',
        title: 'This is my very tiny title',
        actors: ['France', 'USA', 'Spain'],
        topics: ['toilet paper', 'Forest']
      },
      {
        year: 2009,
        place: 'Copenhagen',
        event: 'COP 8',
        title: 'This is my very tiny title',
        actors: ['France', 'USA', 'Spain'],
        topics: ['toilet paper', 'Forest']
      },
      {
        year: 2009,
        place: 'Copenhagen',
        event: 'COP 8',
        title: 'This is my very tiny title',
        actors: ['France', 'USA', 'Spain'],
        topics: ['toilet paper', 'Forest']
      },
      {
        year: 2009,
        place: 'Copenhagen',
        event: 'COP 8',
        title: 'This is my very tiny title',
        actors: ['France', 'USA', 'Spain'],
        topics: ['toilet paper', 'Forest']
      },
      {
        year: 2009,
        place: 'Copenhagen',
        event: 'COP 8',
        title: 'This is my very tiny title',
        actors: ['France', 'USA', 'Spain'],
        topics: ['toilet paper', 'Forest']
      },
      {
        year: 2009,
        place: 'Copenhagen',
        event: 'COP 8',
        title: 'This is my very tiny title',
        actors: ['France', 'USA', 'Spain'],
        topics: ['toilet paper', 'Forest']
      },
      {
        year: 2009,
        place: 'Copenhagen',
        event: 'COP 8',
        title: 'This is my very tiny title',
        actors: ['France', 'USA', 'Spain'],
        topics: ['toilet paper', 'Forest']
      },
      {
        year: 2009,
        place: 'Copenhagen',
        event: 'COP 8',
        title: 'This is my very tiny title',
        actors: ['France', 'USA', 'Spain'],
        topics: ['toilet paper', 'Forest']
      }
    ];

    return (
      <div className="verbatims">
        <div className="column-title">Verbatims</div>


        <div className="minutes">{
          data.map(function(minute, i) {
            return (
              <div  className="minute"
                    key={ i }>
                <div className="minute-context">{
                  minute.year + ' | ' + minute.place + ' | ' + minute.event
                }</div>
                <div className="minute-title">{
                  minute.title
                }</div>
                <div className="minute-tags">{
                  minute.actors.concat(minute.topics).join(' | ')
                }</div>
              </div>
            );
          }, this)
        }</div>
      </div>
    );
  }
});
