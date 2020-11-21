const config = require('./config/site');
const queries = require("./src/utils/algolia");
require("dotenv").config();

module.exports = {
  siteMetadata: {
    title: "emprezzo",
    description: "🧐 Discover the best direct-to-consumer brands 🛒 Shop direct & support independent businesses",
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
        exclude: [`/tags/*`, '/random/'],
      }
    },
    {
    resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-86276502-5",
      },
    },
    {
    resolve: 'gatsby-plugin-tidio-chat',
    options: {
      tidioKey: 'ojbejcxntjb7yiu3yvg4irvqevffemvu',
      enableDuringDevelop: true, // Optional. Disables Tidio chat widget when running Gatsby dev server. Defaults to true.
    },
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
          host: process.env.MYSQL_HOST,
          port: process.env.MYSQL_PORT,
          user:  process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWD,
          database: process.env.MYSQL_DB
        },
        queries: [
          {
            statement: 'SELECT * FROM ShopifyView WHERE AlexaURL IS NOT NULL',
            idFieldName: 'ProductURL',
            name: 'ShopifyView'
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
            statement: 'SELECT * FROM Tags WHERE url IS NOT NULL',
            idFieldName: 'url',
            name: 'Tags'
          },
          {
            statement: 'SELECT CONCAT(TOPIC,FLOOR(RAND()*10000)) AS UniqueKey,Pages.* FROM Pages',
            idFieldName: 'UniqueKey',
            name: 'Pages'
          },
          {
            statement: 'SELECT \n    FLOOR(RAND() * 10000) AS UniqueKey,\n    CONCAT(SUBSTRING(VendorURL,9,9), ShopifyProductsAll.ProductID) AS UniqueID,\n ShopifyProductsAll.*,\n    ShopifyDesc.Description as productDesc,\n    Tags.*,\n    PayNShip.*,\n  AlexaRankView.*,\n  InstagramHistory.*,\n   SocialSummary.* \n  FROM \n    ShopifyProductsAll\n        LEFT JOIN\n    ShopifyDesc ON ShopifyDesc.ProductID = ShopifyProductsAll.ProductID\n        LEFT JOIN\n    Tags ON TRIM(TRAILING \'/\' FROM ShopifyProductsAll.VendorURL) = TRIM(TRAILING \'/\' FROM Tags.url)\n    LEFT JOIN\n    PayNShip ON TRIM(TRAILING \'/\' FROM ShopifyProductsAll.VendorURL) = TRIM(TRAILING \'/\' FROM PayNShip.URL)\n    LEFT JOIN\n    SocialIDView ON TRIM(TRAILING \'/\' FROM ShopifyProductsAll.VendorURL) = TRIM(TRAILING \'/\' FROM SocialIDView.URL)\n LEFT JOIN\n    AlexaRankView ON TRIM(TRAILING \'/\' FROM ShopifyProductsAll.VendorURL) = TRIM(TRAILING \'/\' FROM AlexaRankView.URL)\n	 LEFT JOIN\n    SocialSummary ON TRIM(TRAILING \'/\' FROM SocialIDView.Instagram) = TRIM(TRAILING \'/\' FROM SocialSummary.Instagram) LEFT JOIN\n    InstagramHistory ON TRIM(TRAILING \'/\' FROM SocialIDView.Instagram) = TRIM(TRAILING \'/\' FROM InstagramHistory.UserName) GROUP BY UniqueID',
            idFieldName: 'UniqueKey',
            name: 'ShopifyProductsAll'
          },
          {
            statement: 'SELECT CONCAT(VendorURL,FLOOR(RAND()*10000)) AS UniqueKey,ShopifyProductSummary.* FROM ShopifyProductSummary',
            //statement: "SELECT 1 AS UniqueKey, '2' AS VendorURL, 3 AS PriceAvg, 4 AS PriceAvgTop10, 5 AS PriceMin, 6 AS PriceMax, 7 AS CountProducts, 8 AS PriceListActive, 9 AS DateListActive FROM DUAL",
            idFieldName: 'UniqueKey',
            name: 'ShopifyProductSummary'
          },
          {
            statement: 'SELECT CONCAT(URL,FLOOR(RAND()*10000)) AS UniqueKey,SocialHistory.* FROM SocialHistory',
            idFieldName: 'UniqueKey',
            name: 'SocialHistory'
          },
          {
            statement: "SELECT URL,Shipping,PaypalShopID,PaypalCurrency,IF(PaypalVenmoSupport=1,'true',null) as PaypalVenmoSupport,IF(AfterPay=1,'true',null) as AfterPay,IF(Klarna=1,'true',null) as Klarna,IF(Affirm=1,'true',null) as Affirm,FreeShipText,CreateDate,UpdateDate,Description,Returns,FreeShipMin,BaseShipRate,ReturnDays,ReturnShipFree,ReturnCondition,ReturnNotes FROM PayNShip",
            idFieldName: 'URL',
            name: 'PayNShip'
          },
          {
            statement: "SELECT \n     FLOOR(RAND() * 10000) AS UniqueKey,\n  AlexaRankView.UserName AS UniqueID,\n  AlexaRankView.URL AS AlexaURL,\n    AlexaRankView.*,\n    Tags.*,\n    SocialIDView.*,\n    RankHistory.*,\n    PayNShip.*,\n    ShopifyProductSummary.*,\n    SocialSummary.* ,\n  InstagramHistory.*\n FROM \n    AlexaRankView\n        LEFT JOIN\n    Tags ON TRIM(TRAILING \'/\' FROM AlexaRankView.URL) = TRIM(TRAILING \'/\' FROM Tags.url)\n        LEFT JOIN\n    SocialIDView ON TRIM(TRAILING \'/\' FROM AlexaRankView.URL) = TRIM(TRAILING \'/\' FROM SocialIDView.URL)\n        LEFT JOIN\n    RankHistory ON TRIM(TRAILING \'/\' FROM AlexaRankView.URL) = TRIM(TRAILING \'/\' FROM RankHistory.url)\n        LEFT JOIN\n    PayNShip ON TRIM(TRAILING \'/\' FROM AlexaRankView.URL) = TRIM(TRAILING \'/\' FROM PayNShip.URL)\n        LEFT JOIN\n    ShopifyProductSummary ON TRIM(TRAILING \'/\' FROM AlexaRankView.URL) = TRIM(TRAILING \'/\' FROM ShopifyProductSummary.VendorURL)\n      LEFT JOIN\n    SocialSummary ON TRIM(TRAILING \'/\' FROM SocialIDView.Instagram) = TRIM(TRAILING \'/\' FROM SocialSummary.Instagram)   LEFT JOIN\n    InstagramHistory ON TRIM(TRAILING \'/\' FROM SocialIDView.Instagram) = TRIM(TRAILING \'/\' FROM InstagramHistory.UserName) GROUP BY UniqueID",
            idFieldName: 'AlexaURL',
            name: 'MainView'
          },
          {
            statement: 'SELECT * FROM SocialIDView WHERE URL IS NOT NULL',
            idFieldName: 'URL',
            name: 'SocialIDView'
          },
          {
            statement: "Select CONCAT(UserName,FLOOR(RAND()*10000)) AS UniqueKey, DataView.*,CONCAT('https://instagram.com/p/',DataView.ShortCode) AS ShortCodeURL FROM DataView WHERE UserName IS NOT NULL ORDER BY activity DESC",
            idFieldName: 'UniqueKey',
            name: 'DataView'
            //,remoteImageFieldNames: ['ProfilePicURL']
          },
          {
            statement: "SELECT CrunchBase.*,InstagramHistory.* from CrunchBase LEFT JOIN InstagramHistory ON TRIM(TRAILING '/' FROM CrunchBase.URL) = TRIM(TRAILING '/' FROM InstagramHistory.ExternalURL)",
            idFieldName: 'URL',
            name: 'CrunchBaseView'
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
        chunkSize: 1000, // default: 1000
        enablePartialUpdates: true,
        matchFields: ['price', 'shopImage'],

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
