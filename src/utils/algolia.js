const shopQuery = `{
  shops: allMysqlMainView(limit:1000) {
    edges {
      node {
        id: UserName
        shopName: name
        emprezzoID: UserName
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
        updateDate: CreateDate
      }
    }
  }
}`

const productQuery = `{
  products: allMysqlShopifyProductsAll(limit: 6500) {
    edges {
      node {
        objectID: UniqueID
        productID: ProductID
        name: Title
        description: productDesc
        maxPrice: MaxPrice
        price: Price
        imageURL: ImageURL
        updateDate: UpdateDate
        publishedDate: PublishedDate
        sellingRank: Position
        productURL: ProductURL
        shopName: name
        emprezzoID: UserName
        shopTags: tags
        shopCategory: category
        shopDescription: Description
        freeShipMin: FreeShipMin
        baseShipRate: BaseShipRate
        returnDays: ReturnDays
        returnShipFree: ReturnShipFree
        shopImage: ProfilePicURL

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
