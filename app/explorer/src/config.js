module.exports = {
  index: [
    'actors',
    'countries',
    'topics',
    'event_id'
  ],
  fields: {
    countries: {
      label: 'Countries',
      cacheValues: true,
      separator: '|'
    },
    actors: {
      label: 'Groupings',
      cacheValues: true,
      separator: '|'
    },
    topics: {
      label: 'Topics',
      cacheValues: true,
      separator: '|'
    },
    event_id: {
      label: 'Events',
      cacheValues: true,
      operator: 'or'
    },
    year: {
      label: 'Year',
      cacheValues: true,
      operator: 'or'
    }
  },

  filters: [
    { field: 'countries' },
    { field: 'actors' },
    { field: 'event_id' },
    { field: 'topics' }
  ],
  aggregations: [
    'topics',
    'event_id',
    'actors',
    'year'
  ]
};
