const path = require('path');
const _ = require("lodash");
const algoliasearch = require('algoliasearch');

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(`
    type MysqlDataView implements Node {
      mysqlImage: File
      mysqlImages: File
    }
  `)
  createTypes(`
    type MysqlMainView implements Node {
      TikTok: String
      TTFollowers: Float
      TTFollowing: Float
      TTLikes : Float
      AmazonPay: Int
      ApplePay: Int
      ShopifyPay: Int
      PaypalVenmoSupport: Int
      AfterPay: Int
      Klarna: Int
      Affirm: Int
    }
  `)
  createTypes(`
    type MysqlRankViewPayLater implements Node {
      ProfilePicURL: String
      FollowerRate: Float
      PostRate: Float
      activity: Float
    }
  `)
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const postTemplate = path.resolve('src/templates/post.jsx');
    const alltagsPage = path.resolve('src/templates/alltags.jsx');
    const categoryTemplate = path.resolve('src/templates/category.jsx');

    const postsByTag = {};

    //Start of creating pages from Google Sheet Data
    const shopTemplate = path.resolve('src/templates/singleitem.jsx');
    resolve(
      graphql(
        `
          query {
            allMysqlMainView {
              edges {
                node {
                  AlexaURL
                  GlobalRank
                  LocalRank
                  TOS
                  UserName
                  category
                  emprezzoID
                  tags
                  name
                  about
                  signup_promos
                  AmazonPay
                  ApplePay
                  ShopifyPay
                  PaypalVenmoSupport
                  AfterPay
                  Klarna
                  Affirm
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          return reject(result.errors);
        }

        const mainviewRows = result.data.allMysqlMainView.edges;

        //create pages
        mainviewRows.forEach(({ node }, index) => {
          const path = '/shops/' + node.emprezzoID + '/';
          const prev = index === 0 ? null : mainviewRows[index - 1].node;
          const next =
            index === mainviewRows.length - 1 ? null : mainviewRows[index + 1].node;
          createPage({
            path,
            component: shopTemplate,
            context: {
              pathSlug: node.AlexaURL,
              prev,
              next,
            },
          });
        });

        // extracting tags from pages
        mainviewRows.forEach(({ node }) => {
          if (node.tags) {
            const tagsList = node.tags.split(',')
            let rowPost = {
              frontmatter: {
                title: "",
                path: ""
              }
            }
            tagsList.forEach(tag => {
              rowPost.frontmatter.title = node.emprezzoID
              rowPost.frontmatter.path = '/shops/' + node.emprezzoID + '/'
              if (!postsByTag[tag]) {
                postsByTag[tag] = [];
              }
              postsByTag[tag].push(node);
            });
          }
        });
        const tags = Object.keys(postsByTag);

        //Create All Tags page
        createPage({
          path: '/alltags/',
          component: alltagsPage,
          context: {
            tags: tags.sort(),
          },
        });



        // extracting categories from the page and creating seperate category pages
        let uniqueCategories = []
        mainviewRows.forEach(({ node }) => {
          if (node.category) {
            const categoryList = node.category.split(',')
            categoryList.forEach(category => {
              if (uniqueCategories.indexOf(category) === -1) {
                uniqueCategories.push(category)
              }
            });
          }
        });

        // Make category pages
        uniqueCategories.forEach(cat => {
          categoryKebabCase = cat.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase();
          createPage({
            path: `/category/${categoryKebabCase}/`,
            component: categoryTemplate,
            context: {
              category: cat,
            },
          })
        })

      })
    );
    //End of creating pages from Google Sheet Data

    resolve(
      graphql(
        `
          query {
            allMarkdownRemark(
              sort: { order: ASC, fields: [frontmatter___date] }
            ) {
              edges {
                node {
                  frontmatter {
                    path
                    title
                    tags
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          return reject(result.errors);
        }

        const posts = result.data.allMarkdownRemark.edges;

        //create posts
        posts.forEach(({ node }, index) => {
          const path = node.frontmatter.path;
          const prev = index === 0 ? null : posts[index - 1].node;
          const next =
            index === posts.length - 1 ? null : posts[index + 1].node;
          createPage({
            path,
            component: postTemplate,
            context: {
              pathSlug: path,
              prev,
              next,
            },
          });
        });
      })
    );

    //getting the list of unavailable Products
    //Those will need to be set to match the objectID format and set to 'unavailable' in the Algolia index
/*    
    resolve(
      graphql(
        `
          query {
            allMysqlShopifyProductsAvailableView {
              edges {
                node {
                  Title
                  VendorURL
                  ProductID
                  UniqueID
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          return reject(result.errors);
        }
        const nonAvailableProducts = result.data.allMysqlShopifyProductsAvailableView.edges;
        const algoliaClient = algoliasearch(
          process.env.GATSBY_ALGOLIA_APP_ID,
          process.env.ALGOLIA_ADMIN_KEY
        );
        const searchIndexName = "empProducts"
        const algoliaIndex = algoliaClient.initIndex(searchIndexName)
        //dividing the data into chunk to avoid crosing update rate limit
        // reference: https://www.algolia.com/doc/faq/indexing/is-there-a-rate-limit/
        const sliceChunkSize = 5000;
        console.log("**** nonAvailableProducts Processing - Total records = ", nonAvailableProducts.length)
        console.log("**** nonAvailableProducts Processing - Chunk Size = ", sliceChunkSize)
        const sliceCount = nonAvailableProducts.length / sliceChunkSize
        console.log("**** nonAvailableProducts Processing - Number of Chunk(s) = ", Math.ceil(sliceCount))
        for (let i = 1; i <= Math.ceil(sliceCount); i++) {
          const startIndex = ((i - 1) * sliceChunkSize);
          const endIndex = i * sliceChunkSize
          const productSlice = _.slice(nonAvailableProducts, startIndex, endIndex)
          const updatePayload = [];
          const deletePayload = [];
          productSlice.forEach(({ node }) => {
            updatePayload.push({
              available: 0,
              objectID: node.UniqueID
            })
            deletePayload.push(node.UniqueID)
          });
          // algoliaIndex.partialUpdateObjects(updatePayload, { createIfNotExists: false }).then((response) => {
          //   console.log("**** nonAvailableProducts Processing - Algolia Response taskID = ", response.taskIDs)
          // });
          algoliaIndex.deleteObjects(deletePayload).then(({objectIDs}) => {
            console.log("**** nonAvailableProducts Processing - Algolia Object IDs sent for deletion = ", objectIDs)
          });
        }
      }) // end of 'available' field processing
    );
*/
  });
};

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /react-responsive-carousel|react-responsive/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}

/* Allows named imports */
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  });
};
