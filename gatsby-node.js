const path = require('path');
const _ = require("lodash");
const fetch = require("node-fetch");
const FeedParser = require("feedparser");

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(`
    type googleSheetListRow implements Node {
      localImageUrl: File @link(from: "localImageUrl___NODE")
      localProfileImage: File @link(from: "localProfileImage___NODE")
      fields: fields
      instagramname: String
      alexarank: String
      alexatimeonsite: String
    }

    type fields {
      atomfeed: [atomfeed]
    }

    type atomfeed {
      title: String
      guid: String
      link: String
    }
  `)
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const postTemplate = path.resolve('src/templates/post.jsx');
    const alltagsPage = path.resolve('src/templates/alltags.jsx');
    const tagPosts = path.resolve('src/templates/tag.jsx');
    const categoryTemplate = path.resolve('src/templates/category.jsx');

    const postsByTag = {};

    //Start of creating pages from Google Sheet Data
    const shopTemplate = path.resolve('src/templates/singleitem.jsx');
    resolve(
      graphql(
        `
          query {
            allGoogleSheetListRow {
              edges {
                node {
                  name
                  slug
                  url
                  category
                  tags
                  about
                  country
                  state
                  city
                  imageurl
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          return reject(result.errors);
        }

        const sheetRows = result.data.allGoogleSheetListRow.edges;

        // extracting tags from pages
        sheetRows.forEach(({ node }) => {
          if (node.tags) {
            const tagsList = node.tags.split(',')
            let rowPost = {
              frontmatter: {
                title: "",
                path: ""
              }
            }
            tagsList.forEach(tag => {
              rowPost.frontmatter.title = node.name
              rowPost.frontmatter.path = '/shops/' + node.slug
              if (!postsByTag[tag]) {
                postsByTag[tag] = [];
              }
              postsByTag[tag].push(node);
            });
          }
        });

        // extracting categories from the page and creating seperate category pages
        let uniqueCategories = []
        sheetRows.forEach(({ node }) => {
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

        //create pages
        sheetRows.forEach(({ node }, index) => {
          const path = '/shops/' + node.slug;
          const prev = index === 0 ? null : sheetRows[index - 1].node;
          const next =
            index === sheetRows.length - 1 ? null : sheetRows[index + 1].node;
          createPage({
            path,
            component: shopTemplate,
            context: {
              pathSlug: node.slug,
              prev,
              next,
            },
          });
        });
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

        // create tags page
        posts.forEach(({ node }) => {
          if (node.frontmatter.tags) {
            node.frontmatter.tags.forEach(tag => {
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
          path: '/tags',
          component: alltagsPage,
          context: {
            tags: tags.sort(),
          },
        });

        //create tags
        tags.forEach(tagName => {
          const posts = postsByTag[tagName];

          createPage({
            path: `/tags/${tagName}`,
            component: tagPosts,
            context: {
              posts,
              tagName,
            },
          });
        });

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

  });
};

/* Allows named imports */
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  });
};


exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions
  let entries = [];
  const processedArticleFields = _.union(
    [
      "title",
      "link",
      "origlink",
      "permalink",
      "date",
      "pubdate",
      "author",
      "guid",
      "image"
    ]
  );
  if (node.internal
      && node.internal.owner === 'gatsby-source-google-sheets'
      && node.url
      && node.url.startsWith("http")
  ) {
    const feedurl = node.url+"/collections/all.atom";
    console.log("******* Feed URL = "+feedurl);
    var req = fetch(feedurl)
    var feedparser = new FeedParser();
    req.then(function (res) {
      if (res.status !== 200) {
        console.log("** Bad status code '"+feedurl+"' : "+res.status)
      }
      else {
        res.body.pipe(feedparser);
      }
    }, function (err) {
      console.error("** Error while reading feed for '"+feedurl+"' : "+err)
    });

    feedparser.on('error', function (error) {
      console.error("**** Feed Read Error = "+error);
    });

    feedparser.on('readable', function () {
      var stream = this; // `this` is `feedparser`, which is a stream
      var item;
      while (item = stream.read()) {
        entries.push(_.pick(item, processedArticleFields));
      }
    });
    feedparser.on("end", () => {
      createNodeField({
        name: 'atomfeed', // field name
        node, // the node on which we want to add a custom field
        value: entries // field value
      });
    });
  }
};
