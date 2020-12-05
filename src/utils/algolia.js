const shopQuery = `{
  shops: allMysqlMainView(limit:600) {
    edges {
      node {
        id: UniqueID
        randomShopKey: UniqueKey
        emprezzoID: emprezzoID
        shopName: name
        url: url
        tags: tags
        about: about
        shopTags: tags
        shopCategory: category
        freeShipMin: FreeShipMin
        baseShipRate: BaseShipRate
        returnDays: ReturnDays
        returnShipFree: ReturnShipFree
        priceMin: PriceMin
        priceMax: PriceMax
        priceAvg: PriceAvg
        productCount: CountProducts
        updateDate: CreateDate
        shopDescription: Description
        proudctList: TitleList
        shopImage: ProfileImage
        shopImage2: ProfilePicURL
        trafficRank: GlobalRankOrder
        socialRankScore: SocialRankScore
        amazonPay: AmazonPay
        applePay: ApplePay
        venmo: PaypalVenmoSupport
        paypal: PaypalShopID
        shopifyPay: ShopifyPay
        shopifyID: ShopifyID
        afterpay: AfterPay
        klarna: Klarna
        affirm: Affirm
      }
    }
  }
}`

const productQuery = `{
  products: allMysqlShopifyProductsAll(limit: 50000 ) {
    edges {
      node {
        objectID: UniqueID
        random: UniqueKey
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
        emprezzoID: emprezzoID
        shopTags: tags
        shopCategory: category
        shopDescription: Description
        freeShipMin: FreeShipMin
        baseShipRate: BaseShipRate
        returnDays: ReturnDays
        returnShipFree: ReturnShipFree
        trafficRank: GlobalRankOrder
        socialRankScore: SocialRankScore
        onSale: OnSale
        discountPct: DiscountPct
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
