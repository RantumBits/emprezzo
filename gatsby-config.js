const config = require('./config/site');
const queries = require("./src/utils/algolia");
require("dotenv").config();

module.exports = {
  siteMetadata: {
    title: "uncommonry",
    description: "🧐 Discover exceptional retailers & innovative brands<br/>🛒 Shop direct to support independent businesses",
    ...config,
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-catch-links',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/content/posts`,
      },
    },
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 750,
              quality: 90,
              linkImagesToOriginal: true,
            },
          },
          'gatsby-remark-prismjs',
        ],
      },
    },
    {
    resolve: 'gatsby-source-google-sheets',
    options: {
        spreadsheetId: '12a1r2I6v3cJgmCZjJ9Yu86lw_aD69fhlM6HYqGn13jM',
        worksheetTitle: 'list',
        credentials: require(`${__dirname}/client_secret.json`,)
    }
    },
    {
      resolve: `gatsby-plugin-remote-images`,
      options: {
        nodeType: 'googleSheetListRow',
        imagePath: 'imageurl',
        name: 'localImageUrl',
      },
    },
    {
      resolve: 'gatsby-plugin-emotion',
      options: {
        autoLabel: process.env.NODE_ENV !== 'production',
        // eslint-disable-next-line
        labelFormat: `[filename]--[local]`,
      },
    },
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'config/typography.js',
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-plugin-sitemap',
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        queries,
        chunkSize: 10000, // default: 1000
      },
    },
    `gatsby-plugin-styled-components`,
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: config.title,
        short_name: config.shortName,
        description: config.description,
        start_url: config.pathPrefix,
        background_color: config.backgroundColor,
        theme_color: config.themeColor,
        display: 'standalone',
        icon: config.favicon,
      },
    },
    'gatsby-plugin-offline',
  ],
};
