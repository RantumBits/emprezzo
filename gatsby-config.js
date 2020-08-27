const config = require('./config/site');
const queries = require("./src/utils/algolia");
require("dotenv").config();

module.exports = {
  siteMetadata: {
    title: "emprezzo",
    description: "🧐 Discover exceptional retailers & innovative brands 🛒 Shop direct to support independent businesses",
    ...config,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/sitemap.xml`,
        // Exclude specific pages or groups of pages using glob parameters
        // See: https://github.com/isaacs/minimatch
        // The example below will exclude the single `path/to/page` and all routes beginning with `category`
        exclude: [`/tags/*`],
      }
    },
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
      resolve: `gatsby-source-mysql`,
      options: {
        connectionDetails: {
          host: '157.245.173.140',
          user: 'instasql',
          password: 'insta@sqlr;',
          database: 'instagram',
          connectTimeout: 100000
        },
        queries: [
          {
            statement: 'Select CONCAT(UserName,FLOOR(RAND()*10000)) AS UniqueKey, UserID, UserName, FullName, Biography, ProfilePicURL, AlexaRankOrder, PostsCount, FollowersCount, FollowingCount, PostRate, FollowerRate, Activity, PhotoLink AS UniquePhotoLink, ShortCode, CONCAT("https://instagram.com/p/",ShortCode) AS ShortCodeURL, LikesCount, CommentsCount, PostDate, Caption, CaptionHashtags, AlexaURL, GlobalRank, Reach, LocalRank, AlexaCountry, TOS FROM DataView WHERE UserName IS NOT NULL ORDER BY activity DESC',
            idFieldName: 'UniqueKey',
            name: 'DataView'
            ,remoteImageFieldNames: ['UniquePhotoLink']
          },
          {
            statement: 'SELECT * FROM ShopifyView WHERE AlexaURL IS NOT NULL',
            idFieldName: 'ProductURL',
            name: 'ShopifyView'
          },
          {
              statement: 'SELECT * FROM SocialIDView WHERE URL IS NOT NULL',
              idFieldName: 'URL',
              name: 'SocialIDView'
          },
          {
            statement: 'SELECT * FROM ShopifyView WHERE ProductID IS NOT NULL',
            idFieldName: 'ProductURL',
            name: 'Products'
          },
          {
            statement: 'SELECT * FROM RankView WHERE AlexaURL IS NOT NULL',
            idFieldName: 'AlexaURL',
            name: 'RankView'
          },
          {
            statement: 'SELECT * FROM RankView_Paypal WHERE AlexaURL IS NOT NULL',
            idFieldName: 'AlexaURL',
            name: 'RankViewPaypal'
          },
          {
            statement: 'SELECT * FROM RankView_PayLater WHERE AlexaURL IS NOT NULL',
            idFieldName: 'AlexaURL',
            name: 'RankViewPayLater'
          },
          {
            statement: 'SELECT * FROM RankView_Pages WHERE AlexaURL IS NOT NULL',
            idFieldName: 'AlexaURL',
            name: 'RankViewPages'
          },
          {
            statement: 'SELECT * FROM Tags WHERE url IS NOT NULL',
            idFieldName: 'url',
            name: 'Tags'
          },
          {
            statement: "SELECT RankView_Pages.*, Tags.*, SocialIDView.* FROM RankView_Pages LEFT JOIN Tags ON TRIM(TRAILING '/' FROM RankView_Pages.AlexaURL) = TRIM(TRAILING '/' FROM Tags.url) LEFT JOIN SocialIDView ON TRIM(TRAILING '/' FROM RankView_Pages.AlexaURL) = TRIM(TRAILING '/' FROM SocialIDView.URL)",
            idFieldName: 'AlexaURL',
            name: 'MainView'
          }
        ]
      }
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
