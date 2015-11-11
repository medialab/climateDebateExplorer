'use strict';

module.exports = {
  // Fields to index through reverse dictionaries in data store:
  index: [],

  // Fields that can be used to filter the dataset:
  filters: [
    { field: 'countries' },
    { field: 'actors' },
    { field: 'event_id' },
    { field: 'topics' }
  ],
  // Fields that must be aggregated when filtering the dataset:
  aggregations: [
    'topics',
    'event_id',
    'actors',
    'year'
  ],

  // Fields metadata:
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
    year: {
      label: 'Year',
      cacheValues: true,
      operator: 'or'
    },
    event_id: {
      label: 'Events',
      cacheValues: true,
      operator: 'or',
      values: {
        '098': {
          city: 'Durban',
          long_title: 'Durban Climate Change Conference - COP17/CMP7',
          year: '2011',
          country: 'South Africa'
        },
        '099': {
          city: 'Bonn',
          long_title: 'Bonn Climate Change Conference - May 2012',
          year: '2012',
          country: 'Germany'
        },
        '090': {
          city: 'Busan',
          long_title: 'Thirty-second Session of the Intergovernmental Panel on Climate Change (IPCC)',
          year: '2010',
          country: 'Republic of Korea'
        },
        '091': {
          city: 'Canc\u00fan',
          long_title: 'Canc\u00fan Climate Change Conference',
          year: '2010',
          country: 'Mexico'
        },
        '092': {
          city: 'Bangkok',
          long_title: 'UN Climate Change Conference Bangkok - April 2011',
          year: '2011',
          country: 'Thailand'
        },
        '093': {
          city: 'Abu Dhabi',
          long_title: 'Thirty-third Session of the Intergovernmental Panel on Climate Change (IPCC)',
          year: '2011',
          country: 'United Arab Emirates'
        },
        '094': {
          city: 'Bonn',
          long_title: 'UN Framework Convention on Climate Change (UNFCCC) Workshop on Technology Needs Assessments',
          year: '2011',
          country: 'Germany'
        },
        '095': {
          city: 'Bonn',
          long_title: 'UN Climate Change Conference June 2011',
          year: '2011',
          country: 'Germany'
        },
        '096': {
          city: 'Panama City',
          long_title: 'UN Climate Change Conference October 2011',
          year: '2011',
          country: 'Panama'
        },
        '097': {
          city: 'Kampala',
          long_title: 'Thirty-fourth Session of the Intergovernmental Panel on Climate Change (IPCC)',
          year: '2011',
          country: 'Uganda'
        },
        '010': {
          city: 'Geneva',
          long_title: 'Fifth Session of the Ad Hoc Group on the Berlin Mandate Fourth Subsidiary Body for Scientific and Technological Advice (SBSTA) and the Subsidiary Body for Implementation (SBI)',
          year: '1996',
          country: 'Switzerland'
        },
        '011': {
          city: 'Bonn',
          long_title: 'Fifth Subsidiary Body for Scientific and Technological Advice (SBSTA) and the Subsidiary Body for Implementation (SBI)',
          year: '1997',
          country: 'Germany'
        },
        '012': {
          city: 'Bonn',
          long_title: 'Sixth Session of the Ad Hoc Group on the Berlin Mandate',
          year: '1997',
          country: 'Germany'
        },
        '013': {
          city: 'Bonn',
          long_title: 'Sixth Subsidiary Body for Scientific and Technological Advice (SBSTA) and the Subsidiary Body for Implementation (SBI)',
          year: '1997',
          country: 'Germany'
        },
        '014': {
          city: 'Bonn',
          long_title: 'Seventh Session of the Ad Hoc Group on the Berlin Mandate',
          year: '1997',
          country: 'Germany'
        },
        '015': {
          city: 'Bonn',
          long_title: 'Seventh Subsidiary Body for Scientific and Technological Advice (SBSTA) and the Subsidiary Body for Implementation (SBI) Eighth Session of the Ad Hoc Group on the Berlin Mandate',
          year: '1997',
          country: 'Germany'
        },
        '016': {
          city: 'Kyoto',
          long_title: 'Third Conference of the Parties to the Framework Convention on Climate Change',
          year: '1997',
          country: 'Japan'
        },
        '017': {
          city: 'Bonn',
          long_title: 'Eighth Subsidiary Body for Scientific and Technological Advice (SBSTA) and the Subsidiary Body for Implementation (SBI)',
          year: '1998',
          country: 'Germany'
        },
        '018': {
          city: 'Buenos Aires',
          long_title: 'Fourth Conference of the Parties to the Framework Convention on Climate Change',
          year: '1998',
          country: 'Argentina'
        },
        '019': {
          city: 'Bonn / Bad Godesberg',
          long_title: 'Technical Workshop on Mechanisms under the Kyoto Protocol',
          year: '1999',
          country: 'Germany'
        },
        '025': {
          city: 'Copenhagen',
          long_title: 'UNFCCC WORKSHOP ON BEST PRACTICES IN POLICIES AND MEASURES',
          year: '2000',
          country: 'Denmark'
        },
        '024': {
          city: 'Bonn',
          long_title: 'UNFCCC WORKSHOPS ON CONVENTION ARTICLE 4.8 AND 4.9 (ADVERSE EFFECTS)',
          year: '2000',
          country: 'Germany'
        },
        '027': {
          city: 'Pozna\u00f1',
          long_title: 'Workshop on Land-Use, Land-Use Change and Forestry',
          year: '2000',
          country: 'Poland'
        },
        '026': {
          city: 'Bonn',
          long_title: 'TWELFTH SESSION OF THE SUBSIDIARY BODIES OF THE UNFCCC',
          year: '2000',
          country: 'Germany'
        },
        '021': {
          city: 'Vienna',
          long_title: 'Informal Exchange of Views and Information on Compliance Under the Kyoto Protocol',
          year: '1999',
          country: 'Austria'
        },
        '020': {
          city: 'Bonn',
          long_title: 'Tenth Subsidiary Body for Scientific and Technological Advice (SBSTA) and the Subsidiary Body for Implementation (SBI)',
          year: '1999',
          country: 'Germany'
        },
        '023': {
          city: 'Bonn',
          long_title: 'UNFCCC WORKSHOP ON COMPLIANCE UNDER THE KYOTO PROTOCOL',
          year: '2000',
          country: 'Germany'
        },
        '022': {
          city: 'Bonn',
          long_title: 'Fifth Conference of the Parties to the UN Framework Convention on Climate Change',
          year: '1999',
          country: 'Germany'
        },
        '029': {
          city: 'The Hague',
          long_title: 'Sixth Conference of the Parties to the UN Framework Convention on Climate Change',
          year: '2000',
          country: 'The Netherlands'
        },
        '028': {
          city: 'Lyon',
          long_title: 'Thirteenth Session of the Subsidiary Bodies of the UNFCCC',
          year: '2000',
          country: 'France'
        },
        '115': {
          city: 'Geneva',
          long_title: 'Geneva Climate Change Conference - February 2015',
          year: '2015',
          country: 'Switzerland'
        },
        '114': {
          city: 'Lima',
          long_title: 'Lima Climate Change Conference - December 2014',
          year: '2014',
          country: 'Peru'
        },
        '038': {
          city: 'New Delhi',
          long_title: 'Eighth Conference of the Parties to the UN Framework Convention on Climate Change',
          year: '2002',
          country: 'India'
        },
        '039': {
          city: 'Ghent',
          long_title: 'UNFCCC Workshop on enabling environments for technology transfer',
          year: '2003',
          country: 'Belgium'
        },
        '111': {
          city: 'Bonn',
          long_title: 'Bonn Climate Change Conference - June 2014',
          year: '2014',
          country: 'Germany'
        },
        '110': {
          city: 'Berlin',
          long_title: 'Twelfth Session of the Intergovernmental Panel on Climate Change (IPCC) Working Group III (WGIII-12) and Thirty-ninth Session of the Intergovernmental Panel on Climate Change (IPCC-39)',
          year: '2014',
          country: 'Germany'
        },
        '113': {
          city: 'Copenhagen',
          long_title: 'Fortieth session of the Intergovernmental Panel on Climate Change (IPCC-40)',
          year: '2014',
          country: 'Denmark'
        },
        '112': {
          city: 'Bonn',
          long_title: 'Bonn Climate Change Conference - October 2014',
          year: '2014',
          country: 'Germany'
        },
        '032': {
          city: 'Bonn',
          long_title: 'SIXTH CONFERENCE OF THE PARTIES TO THE UN FRAMEWORK CONVENTION ON CLIMATE CHANGE RESUMED SESSION',
          year: '2001',
          country: 'Germany'
        },
        '033': {
          city: 'London',
          long_title: 'IPCC-18',
          year: '2001',
          country: 'UK'
        },
        '030': {
          city: 'Panama City',
          long_title: 'INTER-REGIONAL WORKSHOP OF THE CONSULTATIVE GROUP OF EXPERTS ON INITIAL NATIONAL COMMUNICATIONS FROM PARTIES NOT INCLUDED IN ANNEX I TO THE CONVENTION',
          year: '2001',
          country: 'Panama'
        },
        '031': {
          city: 'Nairobi',
          long_title: 'Seventeenth session of the Intergovernmental Panel on Climate Change (IPCC)',
          year: '2001',
          country: 'Kenya'
        },
        '036': {
          city: 'Seoul',
          long_title: 'Expert meeting on methodologies for technology needs assessments',
          year: '2002',
          country: 'Republic of Korea'
        },
        '037': {
          city: 'Bonn',
          long_title: 'Sixteenth Sessions of the Subsidiary Bodies',
          year: '2002',
          country: 'Germany'
        },
        '034': {
          city: 'Marrakech',
          long_title: 'Seventh Conference of the Parties to the UN Framework Convention on Climate Change',
          year: '2001',
          country: 'Morocco'
        },
        '035': {
          city: 'Bonn',
          long_title: 'The Consultative Group of Experts (CGE) on National Communications from Non-Annex I Parties',
          year: '2002',
          country: 'Germany'
        },
        '108': {
          city: 'Bonn',
          long_title: 'Bonn Climate Change Conference - March 2014',
          year: '2014',
          country: 'Germany'
        },
        '109': {
          city: 'Yokohama',
          long_title: 'Tenth Session of the Intergovernmental Panel on Climate Change (IPCC) Working Group II (WGII-10) and Thirty-eighth Session of the IPCC (IPCC-38)',
          year: '2014',
          country: 'Japan'
        },
        '049': {
          city: 'Bonn',
          long_title: 'Seminar of Governmental Experts',
          year: '2005',
          country: 'Germany'
        },
        '048': {
          city: 'Buenos Aires',
          long_title: 'Tenth Conference of the Parties to the UN Framework Convention on Climate Change',
          year: '2004',
          country: 'Argentina'
        },
        '047': {
          city: 'New Delhi',
          long_title: 'IPCC-22',
          year: '2004',
          country: 'India'
        },
        '046': {
          city: 'Montreal',
          long_title: 'UNFCCC Workshop on innovative options for financing the development and transfer of technologies',
          year: '2004',
          country: 'Canada'
        },
        '045': {
          city: 'Bonn',
          long_title: 'United Nations Framework Convention on Climate Change (UNFCCC) workshop on emissions projections from Parties included in Annex I of the UNFCCC',
          year: '2004',
          country: 'Germany'
        },
        '044': {
          city: 'Bonn',
          long_title: 'Twentieth Session of the Subsidiary Bodies to the UN Framework Convention on Climate Change',
          year: '2004',
          country: 'Germany'
        },
        '043': {
          city: 'Manila',
          long_title: 'United Nations Framework Convention on Climate Change (UNFCCC) workshop on the preparation of national communications from non-Annex I Parties',
          year: '2004',
          country: 'the Philippines'
        },
        '042': {
          city: 'Milan',
          long_title: 'Ninth Conference of the Parties to the UN Framework Convention on Climate Change',
          year: '2003',
          country: 'Italy'
        },
        '041': {
          city: 'Espoo',
          long_title: 'Workshop on synergies and cooperation with other conventions',
          year: '2003',
          country: 'Finland'
        },
        '040': {
          city: 'Bonn',
          long_title: '18th Session of the Subsidiary Bodies',
          year: '2003',
          country: 'Germany'
        },
        '102': {
          city: 'Doha',
          long_title: 'Doha Climate Change Conference - November 2012',
          year: '2012',
          country: 'Qatar'
        },
        '058': {
          city: 'Paris',
          long_title: 'Tenth Session of the IPCC Working Group I (WGI)',
          year: '2007',
          country: 'France'
        },
        '059': {
          city: 'Brussels',
          long_title: 'Eighth session of the IPCC Working Group II',
          year: '2007',
          country: 'Belgium'
        },
        '103': {
          city: 'Bonn',
          long_title: 'Bonn Climate Change Conference - April 2013',
          year: '2013',
          country: 'Germany'
        },
        '054': {
          city: 'Montr\u00e9al',
          long_title: 'Eleventh session of the Conference of the Parties to the Climate Change Convention and first meeting of the Parties to the Kyoto Protocol',
          year: '2005',
          country: 'Canada'
        },
        '055': {
          city: 'Port Louis',
          long_title: 'IPCC-25',
          year: '2006',
          country: 'Mauritius'
        },
        '056': {
          city: 'Bonn',
          long_title: 'Twenty-Fourth sessions of the Subsidiary Body for Scientific and Technological Advice (SBSTA) and the Subsidiary Body for Implementation (SBI) of the UNFCCC and First session of the Ad Hoc Working Group on Further Commitments for Annex I Parties under the Kyoto Protocol (AWG) and related meetings',
          year: '2006',
          country: 'Germany'
        },
        '057': {
          city: 'Nairobi',
          long_title: 'UN Climate Change Conference \u2013 Nairobi 2006',
          year: '2006',
          country: 'Kenya'
        },
        '050': {
          city: 'Bonn',
          long_title: 'United Nations Framework Convention on Climate Change: Twenty-Second Session of the Subsidiary Bodies',
          year: '2005',
          country: 'Germany'
        },
        '051': {
          city: 'Tobago',
          long_title: 'UNFCCC seminar on the development and transfer of environmentally sound technologies for adaptation to climate change',
          year: '2005',
          country: 'Trinidad and Tobago'
        },
        '052': {
          city: 'Montreal',
          long_title: '8th Session of WG-III and IPCC-24',
          year: '2005',
          country: 'Canada'
        },
        '053': {
          city: 'Bonn',
          long_title: 'UNFCCC Workshop on the Development of the Five-Year Programme of Work on Impacts, Vulnerability and Adaptation to Climate Change',
          year: '2005',
          country: 'Germany'
        },
        '101': {
          city: 'Bangkok',
          long_title: 'Bangkok Climate Change Conference - August 2012',
          year: '2012',
          country: 'Thailand'
        },
        '106': {
          city: 'Batumi',
          long_title: 'Thirty-seventh session of the Intergovernmental Panel on Climate Change (IPCC-37)',
          year: '2013',
          country: 'Georgia'
        },
        '107': {
          city: 'Warsaw',
          long_title: 'Warsaw Climate Change Conference - November 2013',
          year: '2013',
          country: 'Poland'
        },
        '104': {
          city: 'Bonn',
          long_title: 'Bonn Climate Change Conference - June 2013',
          year: '2013',
          country: 'Germany'
        },
        '105': {
          city: 'Stockholm',
          long_title: 'Twelfth Session of Working Group I (WGI) of the Intergovernmental Panel on Climate Change (IPCC) and Thirty-sixth Session of the IPCC',
          year: '2013',
          country: 'Sweden'
        },
        '061': {
          city: 'Bonn',
          long_title: 'Twenty-sixth sessions of the Subsidiary Bodies (SB 26) of the United Nations Framework Convention on Climate Change (UNFCCC)',
          year: '2007',
          country: 'Germany'
        },
        '060': {
          city: 'Bangkok',
          long_title: 'Ninth session of the IPCC Working Group III (WGIII)',
          year: '2007',
          country: 'Thailand'
        },
        '063': {
          city: 'Rome',
          long_title: 'UN Framework Convention on Climate Change (UNFCCC) Workshop on Adaptation Planning and Practices under the Nairobi Work Programme on Impacts, Vulnerability and Adaptation to Climate Change (NWP)',
          year: '2007',
          country: 'Italy'
        },
        '062': {
          city: 'Vienna',
          long_title: 'Vienna Climate Change Talks 2007 - AWG 4 and the Dialogue 4',
          year: '2007',
          country: 'Austria'
        },
        '065': {
          city: 'Bali',
          long_title: 'United Nations Climate Change Conference - Bali',
          year: '2008',
          country: 'Indonesia'
        },
        '064': {
          city: 'Valencia',
          long_title: 'IPCC-27',
          year: '2007',
          country: 'Spain'
        },
        '067': {
          city: 'Port of Spain',
          long_title: 'UNFCCC Expert Group Meeting on socioeconomic information under the Nairobi Work Programme on Impacts, Vulnerability and Adaptation to Climate Change (NWP)',
          year: '2008',
          country: 'Trinidad and Tobago'
        },
        '066': {
          city: 'Mexico City',
          long_title: 'UNFCCC Expert Group Meeting on Methods and Tools and on Data and Observations under the Nairobi Work Programme on Impacts, Vulnerability and Adaptation to Climate Change (NWP)',
          year: '2008',
          country: 'Mexico'
        },
        '069': {
          city: 'Budapest',
          long_title: 'IPCC-28',
          year: '2008',
          country: 'Hungary'
        },
        '068': {
          city: 'Bangkok',
          long_title: 'First session of the Ad Hoc Working Group on Long-term Cooperative Action under the Convention (AWGLCA 1) and Fifth session of the Ad Hoc Working Group on Further Commitments for Annex I Parties under the Kyoto Protocol to the UNFCCC (AWG 5)',
          year: '2008',
          country: 'Thailand'
        },
        '117': {
          city: 'Bonn',
          long_title: 'Bonn Climate Change Conference - June 2015',
          year: '2015',
          country: 'Germany'
        },
        '116': {
          city: 'Nairobi',
          long_title: 'Forty-first Session of the Intergovernmental Panel on Climate Change (IPCC-41)',
          year: '2015',
          country: 'Kenya'
        },
        '076': {
          city: 'Bonn',
          long_title: 'Fifth session of the Ad Hoc Working Group on Long-term Cooperative Action under the UN Framework Convention on Climate Change (AWG-LCA 5) and Seventh session of the Ad Hoc Working Group on Further Commitments for Annex I Parties under the Kyoto Protocol (AWG-KP 7)',
          year: '2009',
          country: 'Germany'
        },
        '077': {
          city: 'Antalya',
          long_title: 'Thirtieth Session of the IPCC',
          year: '2009',
          country: 'Turkey'
        },
        '074': {
          city: 'Pozna\u0144',
          long_title: 'UN Climate Change Conference - Pozna\u0144',
          year: '2008',
          country: 'Poland'
        },
        '075': {
          city: 'Havana',
          long_title: 'Workshop on Integrating Practices, Tools and Systems for Climate Risk Assessment and Management and Disaster Risk Reduction Strategies into National Policies and Programmes',
          year: '2009',
          country: 'Cuba'
        },
        '072': {
          city: 'Accra',
          long_title: 'Third session of the Ad Hoc Working Group on Long-term Cooperative Action and first part of the sixth session of the Ad Hoc Working Group on Further Commitments for Annex 1 Parties under the Kyoto Protocol to the UNFCCC',
          year: '2008',
          country: 'Ghana'
        },
        '073': {
          city: 'Geneva',
          long_title: 'IPCC-29 and Twentieth Anniversary of the IPCC',
          year: '2008',
          country: 'Switzerland'
        },
        '070': {
          city: 'Bonn',
          long_title: 'Twenty-eighth Sessions of the UNFCCC Subsidiary Bodies, Second Session of the Ad Hoc Working Group Under the Convention, and fifth Session of the Ad Hoc Working Group Under the Kyoto Protocol',
          year: '2008',
          country: 'Germany'
        },
        '071': {
          city: 'Tokyo',
          long_title: 'UNFCCC Workshop on Methodological Issues Relating to Reducing Emissions from Deforestation and Forest Degradation in Developing Countries',
          year: '2008',
          country: 'Japan'
        },
        '078': {
          city: 'Cairo',
          long_title: 'UN Framework Convention on Climate Change Technical Workshop on Increasing Economic Resilience to Climate Change and Reducing Reliance on Vulnerable Economic Sectors through Economic Diversification',
          year: '2009',
          country: 'Egypt'
        },
        '079': {
          city: 'Bonn',
          long_title: 'Bonn Climate Change Talks - June 2009',
          year: '2009',
          country: 'Germany'
        },
        '100': {
          city: 'Geneva',
          long_title: 'Thirty-fifth Session of the Intergovernmental Panel on Climate Change (IPCC)',
          year: '2012',
          country: 'Switzerland'
        },
        '119': {
          city: 'Dubrovnik',
          long_title: '42nd Session of the Intergovernmental Panel on Climate Change (IPCC-42)',
          year: '2015',
          country: 'Croatia'
        },
        '118': {
          city: 'Bonn',
          long_title: 'Bonn Climate Change Conference - August 2015',
          year: '2015',
          country: 'Germany'
        },
        '089': {
          city: 'Tianjin',
          long_title: 'Tianjin Climate Change Talks - October 2010',
          year: '2010',
          country: 'China'
        },
        '088': {
          city: 'Bonn',
          long_title: 'Bonn Climate Change Talks - August 2010',
          year: '2010',
          country: 'Germany'
        },
        '083': {
          city: 'Bali',
          long_title: 'Thirty-First Session of the IPCC',
          year: '2009',
          country: 'Indonesia'
        },
        '082': {
          city: 'Bangkok',
          long_title: 'UNFCCC Technical Workshop on Advancing the Integration of Approaches to Adaptation Planning',
          year: '2009',
          country: 'Thailand'
        },
        '081': {
          city: 'Bangkok',
          long_title: 'Bangkok Climate Change Talks - 2009',
          year: '2009',
          country: 'Thailand'
        },
        '080': {
          city: 'Bonn',
          long_title: 'Bonn Climate Change Talks - August 2009',
          year: '2009',
          country: 'Germany'
        },
        '087': {
          city: 'Bonn',
          long_title: 'Bonn Climate Change Talks - May/June 2010',
          year: '2010',
          country: 'Germany'
        },
        '086': {
          city: 'Bonn',
          long_title: 'Bonn Climate Change Talks - April 2010',
          year: '2010',
          country: 'Germany'
        },
        '085': {
          city: 'Copenhagen',
          long_title: 'Copenhagen Climate Change Conference',
          year: '2009',
          country: 'Denmark'
        },
        '084': {
          city: 'Barcelona',
          long_title: 'Barcelona Climate Change Talks 2009',
          year: '2009',
          country: 'Spain'
        },
        '003': {
          city: 'Geneva',
          long_title: 'First Session of the Ad Hoc Group on the Berlin Mandate',
          year: '1995',
          country: 'Switzerland'
        },
        '002': {
          city: 'Berlin',
          long_title: 'First Conference of the Parties to the Framework Convention on Climate Change',
          year: '1995',
          country: 'Germany'
        },
        '001': {
          city: 'New York',
          long_title: 'Eleventh Session of The INC for the Framework Convention on Climate Change (UNFCCC)',
          year: '1995',
          country: 'USA'
        },
        '007': {
          city: 'Geneva',
          long_title: 'Second Session Subsidiary Body for Scientific and Technological Advice (SBSTA) and the Subsidiary Body for Implementation (SBI)',
          year: '1996',
          country: 'Switzerland'
        },
        '006': {
          city: 'New York',
          long_title: 'Year-End Update on the Framework Convention on Climate Change 1995',
          year: '1995',
          country: 'USA'
        },
        '005': {
          city: 'Geneva',
          long_title: 'Second Session of the Ad Hoc Group on the Berlin Mandate',
          year: '1995',
          country: 'Switzerland'
        },
        '004': {
          city: 'Geneva',
          long_title: 'First Session Subsidiary Body for Scientific and Technological Advice (SBSTA) and the Subsidiary Body for Implementation (SBI)',
          year: '1995',
          country: 'Switzerland'
        },
        '009': {
          city: 'Geneva',
          long_title: 'Second Conference of the Parties to the Framework Convention on Climate Change',
          year: '1996',
          country: 'Switzerland'
        },
        '008': {
          city: 'Geneva',
          long_title: 'Third Session of the Ad Hoc Group on the Berlin Mandate',
          year: '1996',
          country: 'Switzerland'
        }
      }
    }
  }
};
