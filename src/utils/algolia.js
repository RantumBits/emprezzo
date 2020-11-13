const shopQuery = `{
  shops: allMysqlMainView(limit:10) {
    edges {
      node {
        id: UserName
        title: name
        url: url
        tags: tags
        about: about
        category: category
        freeShipMin: FreeShipMin
        baseShipRate: BaseShipRate
        returnDays: ReturnDays
        returnShipFree: ReturnShipFree
        priceMin: PriceMin
        image: ProfilePicURL
      }
    }
  }
}`

const productQuery = `{
  products: allMysqlShopifyProductsAll(limit: 10) {
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
        VendorUrl: VendorURL
        UpdateDate: UpdateDate
        PublishedDate: PublishedDate
        Position: Position
        ProductURL: ProductURL

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
