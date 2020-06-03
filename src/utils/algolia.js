const shopQuery = `{
  shops: allGoogleSheetListRow {
    edges {
      node {
        objectID: id
        title: name
        slug: slug
        date
        tags
        excerpt: about
      }
    }
  }
}`
const flatten = arr =>
  arr.map(({ node: { frontmatter, ...rest } }) => ({
    ...frontmatter,
    ...rest,
  }))
const settings = { attributesToSnippet: [`excerpt:120`] }
const queries = [
  {
    query: shopQuery,
    transformer: ({ data }) => flatten(data.shops.edges),
    indexName: `uncommonry`,
    settings,
  },
]
module.exports = queries
