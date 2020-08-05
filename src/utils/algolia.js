const shopQuery = `{
  shops: allMysqlMainView {
    edges {
      node {
        objectID: UserName
        title: FullName
        slug: UserName
        tags
        about: Biography
      }
    }
  }
}`
const flatten = arr =>
  arr.map(({ node: { frontmatter, ...rest } }) => ({
    ...frontmatter,
    ...rest,
  }))
const settings = { attributesToSnippet: [`excerpt:20`] }
const queries = [
  {
    query: shopQuery,
    transformer: ({ data }) => flatten(data.shops.edges),
    indexName: `uncommonry`,
    settings,
  },
]
module.exports = queries
