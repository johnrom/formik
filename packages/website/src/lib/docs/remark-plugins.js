const path = require('path');

module.exports = [
  require('remark-slug'),
  require('./remark-paragraph-alerts'),
  [
    require('remark-autolink-headings'),
    {
      behavior: 'append',
      linkProperties: {
        class: ['anchor'],
        title: 'Direct link to heading',
      },
    },
  ],
  [
    require('remark-toc'),
    {
      skip: 'Reference',
      maxDepth: 6,
    },
  ],
  require('remark-emoji'),
  require('remark-footnotes'),
  require('remark-images'),
  [
    require('@johnrom/remark-code-import'),
    {
      async: false,
      // resolves to root of monorepo
      basePath: path.resolve(process.cwd(), '../../' )
    }
  ],
  require('@nmbl/remark-code-snippets'),
];
