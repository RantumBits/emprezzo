import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import { Header, PostList } from 'components';
import HomeCarouselItem from '../components/HomeCarouselItem';
import ProductCategoryItem from '../components/ProductCategoryItem';
import AlgoliaProductList from '../components/AlgoliaProductList';
import { Layout } from 'layouts';
import Search from 'components/search';
import _ from 'lodash';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import LazyLoad from 'react-lazyload';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import '../styles/prism';
import { useMediaQuery } from 'react-responsive';

const PostSectionHeading = styled.h3`
    margin-bottom: .5rem;
`;

const PostWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 4rem 4rem 1rem 4rem;
  @media (max-width: 1000px) {
    margin: 4rem 2rem 1rem 2rem;
  }
  @media (max-width: 700px) {
    margin: 4rem 1rem 1rem 1rem;
  }
`;



const SectionHeading = styled.h3`
  margin-left: 4rem;
`;

const ShopWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 4rem 4rem 1rem 4rem;
  @media (max-width: 1000px) {
    margin: 4rem 2rem 1rem 2rem;
  }
  @media (max-width: 600px) {
    margin: 0.5rem;
  }
`;

const CarouselWrapper = styled.div`
  margin: 1rem 4rem 1rem 3rem;
  @media (max-width: 1000px) {
    margin: 1rem;
  }
  @media (max-width: 700px) {
    margin: 1rem;
  }
`;

const CategoryWrapper = styled.div`
  display: grid;
  margin: 0 auto;
  width: 90vw;
  grid-gap: 1rem;
  @media (min-width: 501px) {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
  @media only screen and (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Index = ({ data }) => {
  const { edges } = data.allMysqlMainView;
  const rowProductsEdges = data.allMysqlShopifyView.edges;
  const rowallMysqlShopifyProductsAllEdges = data.allMysqlShopifyProductsAll ? data.allMysqlShopifyProductsAll.edges : [];
  const rowallMysqlCrunchBaseViewEdges = data.allMysqlCrunchBaseView ? data.allMysqlCrunchBaseView.edges : [];
  const limit = 1000;
  const maxProducts = 7;
  const maxVisibleItems = 15;
  const [visibleItems, setVisibleItems] = React.useState(maxVisibleItems);
  const [showMore, setShowMore] = React.useState(true);

  const isMobile = useMediaQuery({ query: '(max-width: 600px)' });

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 7,
      slidesToSlide: 7 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 3 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      slidesToSlide: 3 // optional, default to 1.
    }
  };

  const increaseLimit = () => {
    setVisibleItems(visibleItems + maxVisibleItems);
  }

  const searchIndices = [
    { name: `uncommonry`, title: `Shops`, type: `shopHit` },
  ]



  const checkEdgesInProductView = (allEdges) => {
    let filteredProducts = [];
    allEdges.map((edge) => {
      const inputID = edge.node.AlexaURL;
      const result = _.filter(rowallMysqlShopifyProductsAllEdges, ({ node }) => node.VendorURL == inputID && node.Price > 25 && node.Title.toLowerCase().indexOf("gift") < 0 && node.Title.toLowerCase().indexOf("test") < 0 && node.Title.toLowerCase().indexOf("shipping") < 0)
      const sortedResult = _.sortBy(result, ({ node }) => -node.PublishedDate);
      const max2Results = _.slice(sortedResult, 0, 2);//max 2 products from a store
      //add shop details to products
      let combinedMax2Results = [];
      max2Results.map((maxedge) => {
        combinedMax2Results.push({
          node: {
            ...maxedge.node,
            ...edge.node
          }
        });
      })
      filteredProducts = _.union(filteredProducts, combinedMax2Results)

    });
    return filteredProducts;
  }

  const TabStyle = {
    marginBottom: '0px'

  };

  const TabPanelStyle = {
    padding: '2% 5%'

  };


  const ViewContainer = styled.section`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    gap: 10px;

  `;

  const ViewCard = styled.div`
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex: 1;
    @media (max-width: ${props => props.theme.breakpoints.s}) {
      flex: 2;
    }
  `;

  const ViewImage = styled.div`
    max-width: 100%;
    border-radius: 100%;
  `;
  const ViewInfo = styled.div`
    max-width: 100%;
  `;


  const getProductImage = (node) => {
    let productImage = node.VariantImageURL;
    if (!productImage) productImage = node.ImageURL;
    return productImage;
  }

  const combineEdgesForShops = (originalEdges) => {
    const combinedEdges = [];
    //Creating a new dataset with original nodes and required columns from DataView
    originalEdges.map((edge) => {
      const inputID = edge.node.AlexaURL;
      //filter shops from DataView
      var resultData = _.filter(rowDataViewEdges, ({ node }) => (node.AlexaURL == inputID))
      var firstDataRow = [];
      if (resultData.length > 0) {
        firstDataRow = resultData[0]
      }
      //filter for profileimage
      var crunchBaseData = _.filter(rowallMysqlCrunchBaseViewEdges, ({ node }) => node.URL == inputID)
      var crunchBaseRow = crunchBaseData.length > 0 ? crunchBaseData[0] : [];
      let newNode = {
        name: edge.node.name,
        slug: edge.node.UserName,
        about: edge.node.about,
        instagramname: edge.node.UserName,
        ...edge.node,
        ...firstDataRow.node,
        ...crunchBaseRow.node
      }
      combinedEdges.push(newNode);
    })
    return combinedEdges;
  }

  const rowDataViewEdges = data.allMysqlDataView.edges;
  const combinedEdges = combineEdgesForShops(edges);

  //Now sorting (desc) based on GlobalRankChange
  var globalRankChangeSortedEdges = _.sortBy(combinedEdges, obj => -obj.GlobalRank_Change)

  //Now limiting the items as per limit
  const globalRankChangeEdges = _.slice(globalRankChangeSortedEdges, 0, limit)

  //Now sorting (asc) based on GloblRank
  var globalRankSortedEdges = _.sortBy(combinedEdges, obj => obj.GlobalRank)

  //Now limiting the items as per limit
  const globalRankEdges = _.slice(globalRankSortedEdges, 0, maxProducts)

  //Now sorting (desc) based on TotalFollowers
  var totalFollowersSortedEdges = _.sortBy(combinedEdges, obj => -obj.TotalFollowers)

  //Now limiting the items as per limit
  const totalFollowersEdges = _.slice(totalFollowersSortedEdges, 0, limit)

  const electronicsShopEdges = _.filter(edges, ({ node }) => node.category && node.category.indexOf("Electronics") >= 0)
  const combinedElectronicsShopEdges = combineEdgesForShops(electronicsShopEdges);

  const homeShopEdges = _.filter(edges, ({ node }) => node.category && node.category.indexOf("Home and Office") >= 0)
  const combinedHomeShopEdges = combineEdgesForShops(homeShopEdges);

  const apparelShopEdges = _.filter(edges, ({ node }) => node.category && node.category.indexOf("Apparel") >= 0)
  const combinedApparelShopEdges = combineEdgesForShops(apparelShopEdges);

  const toysShopEdges = _.filter(edges, ({ node }) => node.category && node.category.indexOf("Toys") >= 0)
  const combinedToysShopEdges = combineEdgesForShops(toysShopEdges);

  const footwearShopEdges = _.filter(edges, ({ node }) => node.category && node.category.indexOf("Footwear") >= 0)
  const combinedFootwearShopEdges = combineEdgesForShops(footwearShopEdges);

  const mainViewEdges = data.allMysqlMainView.edges;
  let listShopifyProductsAllEdges = [];
  //Creating a new dataset with original product nodes and shop columns from MainView
  rowallMysqlShopifyProductsAllEdges.map((edge) => {
    let newNode = {
      ...edge.node
    }
    const inputID = edge.node.VendorURL;
    var filteredMainViewEdges = _.filter(mainViewEdges, ({ node }) => (node.AlexaURL == inputID))
    if (filteredMainViewEdges.length > 0) {
      newNode = {
        ...newNode,
        ...filteredMainViewEdges[0].node
      }
    }
    listShopifyProductsAllEdges.push({
      node: {
        ...newNode
      }
    });
  })

  //Extracting sale products
  const filteredShopifyBestProducts = _.sortBy(_.filter(listShopifyProductsAllEdges, ({ node }) => node.Position == 1 || node.Position == 2), ({ node }) => -(new Date(node.UpdateDate)));
  const listShopifyBestProducts = _.slice(filteredShopifyBestProducts, 0, limit);
  //Now limiting the items as per limit
  const visibleShopifyBestProducts = _.slice(listShopifyBestProducts, 0, visibleItems);
  //if (visibleShopifyBestProducts.length >= listShopifyBestProducts.length) setShowMore(false);

  //getting newly added products
  //const newlyAddedProducts = _.sortBy(_.filter(listShopifyProductsAllEdges, ({ node }) => node.category && node.category.indexOf("Apparel") >= 0 ), ({ node }) => -node.PublishedDate);
  const newlyAddedProducts = _.sortBy(_.filter(listShopifyProductsAllEdges, ({ node }) => node.Price > 50 && node.Price < 150), ({ node }) => -node.PublishedDate);
  //Now limiting the items as per limit node.category.indexOf("Apparel")
  const visibleNewlyAddedProducts = _.slice(newlyAddedProducts, 0, limit);

  const defaultImageOnError = (e) => { e.target.src = "/logo/logo.png" }

  const renderProduct = (node) => {
    return (
      <ViewCard key={node.ProductURL}>
        <a href={`/shops/${node.slug}/`}>
          <ViewImage>
            <div style={{ 'textAlign': 'center', }}>
              <img
                src={node.ProfileImage || node.ProfilePicURL || node.profile_image_url || "/logo/logo.png"}
                onError={defaultImageOnError}
                style={{
                  objectFit: 'cover',
                  height: '60%',
                  width: '60%',
                  margin: 'auto',
                  borderRadius: '100%',
                  padding: '5%',
                }}
                alt={node.name}
              />
            </div>
          </ViewImage>
        </a>
        <small>{node.category}</small>
        <ViewInfo className="info">
          <a href={`/shops/${node.slug}/`} >
            {node.name}
          </a>
          <p>
            <small>{node.tags && node.tags.substring(0, 90)}</small>
          </p>
        </ViewInfo>
      </ViewCard>
    );
  };

  const renderProductList = (edges) => {
    const limitedEdges = _.slice(edges, 0, maxProducts)
    return (
      <>
        {/* below renderer for desktop version */}
        { !isMobile && limitedEdges && limitedEdges.length > 0 && (
          <ViewContainer>
            {limitedEdges.map((node) => {
              return renderProduct(node)
            })}
          </ViewContainer>
        )}
        {/* below renderer for mobile version */}
        { isMobile && limitedEdges && limitedEdges.length > 0 && (
          <Carousel
            showThumbs={false}
            infiniteLoop
            showIndicators={false}
            selectedItem={1}
            showArrows={true}
            showStatus={false}
            responsive={responsive}
          >
            {limitedEdges.map((node) => {
              return renderProduct(node);
            })}
          </Carousel>
        )}
      </>
    );
  }
  return (
    <Layout title={'emprezzo | Discover great independent online stores'} description="Discover the best online storess & direct-to-consumer brands" >
      <Header title="Discover great independent online stores" subtitle="shop direct & support independent business"></Header>
      {/* <p className="center"><a href ="/randomshop" className="button button">Discover a  shop</a></p> */}
      <div className="center">


      </div>
      <div className="center">

        <a href="/randomshop/" className="button ">Discover a new shop</a>
      </div>


{/*
      <Tabs style={TabPanelStyle}>
        <h2>Browse popular online shops</h2>
        <TabList>
          <Tab style={TabStyle}>All</Tab>

          {combinedApparelShopEdges && <Tab style={TabStyle}>Apparel</Tab>}
          {combinedToysShopEdges && <Tab style={TabStyle}>Toys</Tab>}
          {combinedElectronicsShopEdges && <Tab style={TabStyle}>Electronics</Tab>}
          {combinedHomeShopEdges && <Tab style={TabStyle}>Home</Tab>}
          {combinedFootwearShopEdges && <Tab style={TabStyle}>Footwear</Tab>}


        </TabList>


        <TabPanel>
          {renderProductList(globalRankEdges)}
        </TabPanel>


        {combinedApparelShopEdges && (
          <TabPanel>
            <LazyLoad height={200} once offset={[-200, 0]}>
              {renderProductList(combinedApparelShopEdges)}
            </LazyLoad>
          </TabPanel>
        )}
        {combinedToysShopEdges && (
          <TabPanel>
            <LazyLoad height={200} once offset={[-200, 0]}>
              {renderProductList(combinedToysShopEdges)}
            </LazyLoad>
          </TabPanel>
        )}
        {combinedElectronicsShopEdges && (
          <TabPanel>
            <LazyLoad height={200} once offset={[-200, 0]}>
              {renderProductList(combinedElectronicsShopEdges)}
            </LazyLoad>
          </TabPanel>
        )}


        {combinedHomeShopEdges && (
          <TabPanel>
            <LazyLoad height={200} once offset={[-200, 0]}>
              {renderProductList(combinedHomeShopEdges)}
            </LazyLoad>
          </TabPanel>
        )}

        {combinedFootwearShopEdges && (
          <TabPanel>
            <LazyLoad height={200} once offset={[-200, 0]}>
              {renderProductList(combinedFootwearShopEdges)}
            </LazyLoad>
          </TabPanel>
        )}

      </Tabs>
 */}


      {/*
      <LazyLoad height={200} once offset={[-200, 0]}>
        <SectionHeading>Discover best selling products</SectionHeading>
        <CategoryWrapper>
          {visibleShopifyBestProducts.map(({ node }, index) => (
            <ProductCategoryItem
              key={`NewlyAddedProducts-${index}`}
              cover={getProductImage(node)}
              path={`/shops/${node.UserName}/`}
              vendorname={node.VendorName}
              title={isMobile ? `` : node.Title}
              price={isMobile ? `` : node.Price}
              node={node}
            />
          ))}
        </CategoryWrapper>
        {showMore && visibleShopifyBestProducts.length > 0 &&
          <div className="center">
            <button className="button" onClick={increaseLimit} style={{ cursor: "pointer" }}>
              Load More
            </button>
          </div>
        }
      </LazyLoad> */}

      <LazyLoad height={200} once offset={[-200, 0]}>

        <ShopWrapper>
        <AlgoliaProductList
            facetsToShow={'category,prices,storeoffers'}
            showSearchBox={true}
            showClearFilter={true}
            enableCart={true}
            enableShopProductSwitch={true}
          />
        </ShopWrapper>
      </LazyLoad>


      <ShopWrapper>
        <h3>Discover the best independent shopping sites</h3>
        <p>Shopping is heavily dominated by major retailers. As commerce increasingly shifts from physical to digital means, this balance has shifted more in favor of a small number of mega-retailers with one site making up nearly 50% of all online shopping. This isn't the way the internet was meant to be.</p>
        <p>Consumers have shifted behaviours from shopping in a relatively open physical world to an environment where results beyond the first page or two are rarely seen. Rather than yielding fewer opportunities, digital commerce should open opportunities for a multitude of focused brands to make exceptional products for a physically widespread audience. </p>
        <p>Major online retailers and marketplaces are convenient, but often don't feature the best brands and products. They charge high fees, sell knockoffs, and favor fast & cheap over innovative & enduring.</p>
        <p>There are hundreds of brands that sell directly to consumers on their own sites. Many offer free shipping, discounts to new customers, and other perks of shopping directly. We developed a database of 500+ shops and 20,000+ products that can be searched and filtered by keywords, free shipping offers, price, return policies, etc. The database is constantly growing and updated with new data.</p>
        <p>Help support independent business. Before making a purchase from a major retail site, search for an independent shopping alternative at emprezzo.</p>


      </ShopWrapper>
    </Layout >
  );
};

export default Index;


export const query = graphql`
  query {
    allMysqlDataView {
      edges {
        node {
          UserName
          PostDate
          AlexaCountry
          PhotoLink
          PostsCount
          FollowersCount
          FollowingCount
          GlobalRank
          LocalRank
          TOS
          ProfilePicURL
          mysqlImages {
            childImageSharp {
              fluid(srcSetBreakpoints: [200, 400]) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          TotalFollowers
          TotalFollowing
          Caption
          ShortCodeURL
          FollowerRate
          PostRate
          activity
          AlexaURL
        }
      }
    }

    allMysqlShopifyView {
      edges {
        node {
          UserName
          VendorName
          VendorURL
          Title
          VariantTitle
          ProductURL
          ImageURL
          VariantImageURL
          Price
        }
      }
    }

    allMysqlMainView {
      edges {
        node {
          AlexaURL
          Facebook
          GlobalRank
          GlobalRank_Change
          Instagram
          LocalRank
          Pinterest
          TOS
          ProfileImage
          TikTok
          Twitter
          UserName
          YouTube
          category
          tags
          name
          about
        }
      }
    }

    allMysqlShopifyProductsAll {
      edges {
        node {
          DiscountPct
          ImageURL
          MaxPrice
          Position
          Price
          UpdateDate
          ProductID
          ProductURL
          PublishedDate
          Title
          VariantID
          VariantImageURL
          VariantTitle
          VariantUpdateDate
          VendorName
          VendorURL
          Description
        }
      }
    }

    allMysqlCrunchBaseView {
      edges {
        node {
          URL
          profile_image_url
        }
      }
    }
  }
`;
