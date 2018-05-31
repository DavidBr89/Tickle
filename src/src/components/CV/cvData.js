import * as d3 from 'd3-jetpack/build/d3v4+jetpack';

const timeFormat = d3.timeFormat('%d/%m/%Y');

export default [
  {
    type: 'education',
    date: '01/09/1999',
    endDate: '01/07/2005',
    title: 'High School',
    description: 'Heeemsen',
    width: 95
  },
  {
    type: 'education',
    date: '01/09/2005',
    endDate: '01/07/2008',
    title: 'Mediocre Abitur',
    description: 'Fachgymnasium Economy',
    width: 130
  },
  {
    type: 'education',
    date: '01/09/2008',
    endDate: '01/04/2010',
    title: 'Social Sciences',
    description: 'Uni Trier',
    width: 130
  },
  {
    type: 'education',
    date: '01/04/2010',
    endDate: '01/04/2012',
    title: 'Computer Science',
    description: 'Uni Trier',
    width: 145
  },
  {
    type: 'personal',
    date: '01/09/2013',
    endDate: '01/06/2014',
    title: 'English',
    description: 'switched to English as main language',
    width: 110
  },
  {
    type: 'personal',
    date: '01/09/2008',
    endDate: '30/09/2009',
    title: 'Technics 1210 MK2',
    description: 'bought my first pair of turntables',
    width: 142
  },
  {
    type: 'personal',
    date: '01/09/2002',
    endDate: '01/09/2008',
    title: 'Adolescence',
    description: 'discovered PUNK',
    width: 125
  },
  {
    type: 'education',
    date: '10/10/2010',
    endDate: '01/06/2013',
    title: 'Bachelor Computer Science',
    description: 'Uni Trier',
    width: 143
  },
  {
    type: 'work',
    date: '01/06/2011',
    endDate: '01/09/2011',
    title: 'Construction Helper',
    description: 'Helmet Factory Nienburg',
    width: 111
  },
  {
    type: 'work',
    date: '01/11/2013',
    endDate: '01/02/2014',
    title: 'Mister Jekyll',
    description: 'Internship Web development',
    width: 111
  },
  {
    type: 'work',
    date: '01/03/2014',
    endDate: '01/09/2014',
    title: 'International Crisis Group',
    description: 'Internship Business Intelligence',
    width: 140
  },
  {
    type: 'work',
    date: '01/08/2016',
    endDate: '01/10/2016',
    title: 'Nokia Bell Labs Internship',
    description: 'Data Visualization',
    width: 140
  },
  {
    type: 'work',
    date: '01/11/2016',
    endDate: '01/10/2020',
    title: 'PhD VUB',
    description: 'Data Visualization for informal learning',
    width: 151
  },
  {
    type: 'education',
    date: '01/09/2014',
    endDate: '01/11/2016',
    title: 'Master VUB',
    description: 'Web & Information Systems',
    width: 140
  },
  {
    type: 'geography',
    date: '26/04/1996',
    endDate: '01/10/2008',
    title: 'Drakenburg',
    description: 'lived in village in Lower Saxony',
    width: 140
  },
  {
    type: 'geography',
    date: '01/10/2008',
    endDate: '01/09/2013',
    title: 'Trier',
    description: 'yeah, Mosel Madness',
    width: 140
  },
  {
    type: 'personal',
    date: '01/10/2010',
    endDate: '01/09/2013',
    title: 'Plattenladen',
    description: 'Record show on the Campus Radio, Uni Trier',
    width: 200
  },
  {
    type: 'geography',
    date: '01/09/2013',
    endDate: '01/06/2014',
    title: 'Sweden',
    description: 'Erasmus - Linnaeus University',
    width: 140
  },
  {
    type: 'geography',
    date: '01/06/2014',
    endDate: timeFormat(new Date()),
    title: 'Belgium',
    description: 'made my way to Beer, Fries and Science',
    width: 140
  },
  {
    type: 'personal',
    date: '01/06/2014',
    endDate: timeFormat(new Date()),
    title: 'French!',
    description: 'learning a new language like an immigrant!',
    width: 140
  },
  {
    type: 'personal',
    date: '01/06/2017',
    endDate: timeFormat(new Date()),
    title: 'Dutch',
    description: 'my first time in a language school and I like it',
    width: 140
  }
];
