const path = require('path');
const _ = require("lodash");

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
            allMysqlMainView {
              edges {
                node {
                  AlexaURL
                  Facebook
                  FollowerRate
                  GlobalRank
                  Instagram
                  LocalRank
                  Pinterest
                  PostRate
                  ProfilePicURL
                  TOS
                  TikTok
                  Twitter
                  UserID
                  UserName
                  YouTube
                  activity
                  category
                  tags
                  FullName
                  Biography
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
          const path = '/shops/' + node.UserName;
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
              rowPost.frontmatter.title = node.UserName
              rowPost.frontmatter.path = '/shops/' + node.UserName
              if (!postsByTag[tag]) {
                postsByTag[tag] = [];
              }
              postsByTag[tag].push(node);
            });
          }
        });
        const tags = Object.keys(postsByTag);

        //create tags
        tags.forEach(tagName => {
          const posts = postsByTag[tagName];

          createPage({
            path: `/tags/${tagName.trim()}`,
            component: tagPosts,
            context: {
              posts,
              tagName,
            },
          });
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
