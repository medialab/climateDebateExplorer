'use strict';

var Baobab = require('baobab');

module.exports = new Baobab({
  appState: {
    filters: [],
    deployedList: undefined,
    deployedVerbatim: undefined
  }
});
