const shopQuery = `{
  shops: allMysqlMainView {
    edges {
      node {
        objectID: UniqueKey
        title: name
        slug: UserName
        tags: tags
        about: about
      }
    }
  }
}`

const productQuery = `{
  products: allMysqlShopifyProductsAll(limit: 1000) {
    edges {
      node {
        id: ProductID
        VariantIDs: VariantID
        VendorName: VendorName
        Title: Title
        Description: Description
        MaxPrice: MaxPrice
        Price: Price
        ImageURL: ImageURL
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
  {
    query: productQuery,
    transformer: ({ data }) => flatten(data.products.edges),
    indexName: `empProducts`,
    settings,
  },
]

module.exports = queries
