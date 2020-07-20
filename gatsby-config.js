const config = require('./config/site');
const queries = require("./src/utils/algolia");
require("dotenv").config();

module.exports = {
  siteMetadata: {
    title: "emprezzo",
    description: "🧐 Discover exceptional retailers & innovative brands<br/>🛒 Shop direct to support independent businesses",
    ...config,
  },
  plugins: [
    'gatsby-plugin-sitemap',
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
        spreadsheetId: '1zQ3Uu8lS6HaEGBdG_V1FiEyyjTTemR0G_ri2330BVsU',
        worksheetTitle: 'list',
        credentials: require(`${__dirname}/client_secret.json`,)
    }
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
            statement: 'Select CONCAT(UserName,FLOOR(RAND()*10000)) AS UniqueKey, UserID, UserName, FullName, Biography, ProfilePicURL, PostsCount, FollowersCount, FollowingCount, PostRate, FollowerRate, Activity, PhotoLink AS UniquePhotoLink, ShortCode, CONCAT("https://instagram.com/p/",ShortCode) AS ShortCodeURL, LikesCount, CommentsCount, PostDate, Caption, CaptionHashtags, AlexaURL, GlobalRank, Reach, LocalRank, AlexaCountry, TOS FROM DataView WHERE UserName IS NOT NULL ORDER BY activity DESC',
            idFieldName: 'UniqueKey',
            name: 'DataView'
            //,remoteImageFieldNames: ['UniquePhotoLink']
          },
          {
            statement: 'SELECT * FROM ShopifyView WHERE UserName IS NOT NULL',
            idFieldName: 'ProductURL',
            name: 'ShopifyView'
          },
          {
              statement: 'SELECT * FROM SocialIDs WHERE Instagram IS NOT NULL',
              idFieldName: 'Instagram',
              name: 'SocialIDs'
          },
          {
            statement: 'SELECT * FROM ShopifyView WHERE ProductID IS NOT NULL',
            idFieldName: 'ProductURL',
            name: 'Products'
          },
          {
            statement: 'SELECT * FROM RankView WHERE UserName IS NOT NULL',
            idFieldName: 'UserName',
            name: 'RankView'
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
