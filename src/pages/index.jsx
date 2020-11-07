import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import { Header, PostList } from 'components';
import HomeCarouselItem from '../components/HomeCarouselItem';
import ProductCategoryItem from '../components/ProductCategoryItem';
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

const PostSectionHeading = styled.h1`
  margin-left: 4rem;
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



const ShopSectionHeading = styled.h1`
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
  @media (max-width: 700px) {
    margin: 4rem 1rem 1rem 1rem;
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

const Index = ({ data }) => {
  const { edges } = data.allMysqlMainView;
  const rowProductsEdges = data.allMysqlShopifyView.edges;
  const rowallMysqlShopifyProductsAllEdges = data.allMysqlShopifyProductsAll ? data.allMysqlShopifyProductsAll.edges : [];
  const maxItems = 25;
  const [limit, setLimit] = React.useState(maxItems);
  const [showMore, setShowMore] = React.useState(true);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 7,
      slidesToSlide: 7 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
      slidesToSlide: 4 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      slidesToSlide: 3 // optional, default to 1.
    }
  };

  const increaseLimit = () => {
    setLimit(limit + maxItems);
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

  const rowDataViewEdges = data.allMysqlDataView.edges;
  const combinedEdges = [];

  //Creating a new dataset with original nodes and required columns from DataView
  edges.map((edge) => {
    const inputID = edge.node.AlexaURL;
    //filter to show only shops with DataView . AlexaCountry = United States
    var resultData = _.filter(rowDataViewEdges, ({ node }) => (node.AlexaURL == inputID))
    var firstDataRow = [];
    if (resultData.length > 0) {
      firstDataRow = resultData[0]
    }
    let newNode = {
      name: edge.node.name,
      slug: edge.node.UserName,
      about: edge.node.about,
      instagramname: edge.node.UserName,
      ...edge.node,
      ...firstDataRow.node
    }
    combinedEdges.push(newNode);

  })

  //Now sorting (desc) based on GlobalRankChange
  var globalRankChangeSortedEdges = _.sortBy(combinedEdges, obj => -obj.GlobalRank_Change)

  //Now limiting the items as per limit
  const globalRankChangeEdges = _.slice(globalRankChangeSortedEdges, 0, limit)

  //Now sorting (asc) based on GloblRank
  var globalRankSortedEdges = _.sortBy(combinedEdges, obj => obj.GlobalRank)

  //Now limiting the items as per limit
  const globalRankEdges = _.slice(globalRankSortedEdges, 0, 7)

  //Now sorting (desc) based on TotalFollowers
  var totalFollowersSortedEdges = _.sortBy(combinedEdges, obj => -obj.TotalFollowers)

  //Now limiting the items as per limit
  const totalFollowersEdges = _.slice(totalFollowersSortedEdges, 0, limit)

  const electronicsShopEdges = _.filter(edges, ({ node }) => node.category && node.category.indexOf("Electronics") >= 0)
  const combinedElectronicsShopEdges = [];
  //Creating a new dataset with original nodes and required columns from DataView
  electronicsShopEdges.map((edge) => {
    const inputID = edge.node.AlexaURL;
    //filter to show only shops with DataView . AlexaCountry = United States
    var resultData = _.filter(rowDataViewEdges, ({ node }) => (node.AlexaURL == inputID))
    var firstDataRow = [];
    if (resultData.length > 0) {
      firstDataRow = resultData[0]
    }
    let newNode = {
      slug: edge.node.UserName,
      instagramname: edge.node.UserName,
      ...edge.node,
      ...firstDataRow.node
    }
    combinedElectronicsShopEdges.push(newNode);
  })

  const homeShopEdges = _.filter(edges, ({ node }) => node.category && node.category.indexOf("Home and Office") >= 0)
  const combinedHomeShopEdges = [];
  //Creating a new dataset with original nodes and required columns from DataView
  homeShopEdges.map((edge) => {
    const inputID = edge.node.AlexaURL;
    //filter to show only shops with DataView . AlexaCountry = United States
    var resultData = _.filter(rowDataViewEdges, ({ node }) => (node.AlexaURL == inputID))
    var firstDataRow = [];
    if (resultData.length > 0) {
      firstDataRow = resultData[0]
    }
    let newNode = {
      slug: edge.node.UserName,
      instagramname: edge.node.UserName,
      ...edge.node,
      ...firstDataRow.node
    }
    combinedHomeShopEdges.push(newNode);
  })

  const apparelShopEdges = _.filter(edges, ({ node }) => node.category && node.category.indexOf("Apparel") >= 0)


  const combinedApparelShopEdges = [];
  //Creating a new dataset with original nodes and required columns from DataView
  apparelShopEdges.map((edge) => {
    const inputID = edge.node.AlexaURL;
    //filter to show only shops with DataView . AlexaCountry = United States
    var resultData = _.filter(rowDataViewEdges, ({ node }) => (node.AlexaURL == inputID))
    var firstDataRow = [];
    if (resultData.length > 0) {
      firstDataRow = resultData[0]
    }
    let newNode = {
      slug: edge.node.UserName,
      instagramname: edge.node.UserName,
      ...edge.node,
      ...firstDataRow.node
    }
    combinedApparelShopEdges.push(newNode);
  })


  const toysShopEdges = _.filter(edges, ({ node }) => node.category && node.category.indexOf("Toys") >= 0)
  const combinedToysShopEdges = [];
  //Creating a new dataset with original nodes and required columns from DataView
  toysShopEdges.map((edge) => {
    const inputID = edge.node.AlexaURL;
    //filter to show only shops with DataView . AlexaCountry = United States
    var resultData = _.filter(rowDataViewEdges, ({ node }) => (node.AlexaURL == inputID))
    var firstDataRow = [];
    if (resultData.length > 0) {
      firstDataRow = resultData[0]
    }
    let newNode = {
      slug: edge.node.UserName,
      instagramname: edge.node.UserName,
      ...edge.node,
      ...firstDataRow.node
    }
    combinedToysShopEdges.push(newNode);
  })

  const footwearShopEdges = _.filter(edges, ({ node }) => node.category && node.category.indexOf("Footwear") >= 0)
  const combinedFootwearShopEdges = [];
  //Creating a new dataset with original nodes and required columns from DataView
  footwearShopEdges.map((edge) => {
    const inputID = edge.node.AlexaURL;
    //filter to show only shops with DataView . AlexaCountry = United States
    var resultData = _.filter(rowDataViewEdges, ({ node }) => (node.AlexaURL == inputID))
    var firstDataRow = [];
    if (resultData.length > 0) {
      firstDataRow = resultData[0]
    }
    let newNode = {
      slug: edge.node.UserName,
      instagramname: edge.node.UserName,
      ...edge.node,
      ...firstDataRow.node
    }
    combinedFootwearShopEdges.push(newNode);
  })
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
  const filteredShopifyBestProducts = _.sortBy(_.filter(listShopifyProductsAllEdges, ({ node }) => node.Position == 1 || node.Position == 2 ), ({ node }) => -node.UpdateDate);
  const listShopifyBestProducts = _.slice(filteredShopifyBestProducts, 0, limit);

  //getting newly added products
  //const newlyAddedProducts = _.sortBy(_.filter(listShopifyProductsAllEdges, ({ node }) => node.category && node.category.indexOf("Apparel") >= 0 ), ({ node }) => -node.PublishedDate);
  const newlyAddedProducts = _.sortBy(_.filter(listShopifyProductsAllEdges, ({ node }) => node.Price > 50 && node.Price < 150 ), ({ node }) => -node.PublishedDate);
  //Now limiting the items as per limit node.category.indexOf("Apparel")
  const visibleNewlyAddedProducts = _.slice(newlyAddedProducts, 0, limit);




  return (
    <Layout title={'emprezzo | Discover great independent shops & direct-to-consumer brands'} description="Discover the best online storess & direct-to-consumer brands" >
      <Header title="Discover great brands & online shops" subtitle="shop directly & support independent business"></Header>
      {/* <p className="center"><a href ="/randomshop" className="button button">Discover a  shop</a></p> */}
      <div className="center">


      </div>
      <div className="center">

        <a href="/randomshop/" className="button ">Discover a new shop</a>
      </div>




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
    <ViewContainer>
      {globalRankEdges.map((node, index) => (
      <ViewCard key={index}>
        <a href={`/shops/${node.slug}/`} target="_blank">
          <ViewImage>
            <div style={{ 'text-align' : 'center', }}>
              <img
                src={node.mysqlImages && node.mysqlImages.length > 0 ? node.mysqlImages[0].childImageSharp.fluid : node.ProfilePicURL}
                onError=''
                style={{
                  objectFit: 'cover',
                  height: '60%',
                  width: '60%',
                  margin: 'auto',
                  'border-radius': '100%',
                  padding: '5%',
                }}
                alt={node.name}
              />
            </div>
          </ViewImage>
        </a>
        <small>{node.category}</small>
        <ViewInfo className="info">
          <a href={`/shops/${node.slug}/`} target="_blank">
            {node.name}
          </a>
          <p>
          <small>{node.tags && node.tags.substring(0, 90)}</small>
          </p>
        </ViewInfo>
      </ViewCard>
    ))}
    </ViewContainer>
      </TabPanel>


    {combinedApparelShopEdges && (
      <TabPanel>
      <LazyLoad height={200} once offset={[-200, 0]}>
        <Carousel
          swipeable={false}
          draggable={false}
          showDots={false}
          ssr={true}
          responsive={responsive}
          keyBoardControl={true}
        >
          {combinedApparelShopEdges.map((node, index) => (
            <HomeCarouselItem
              id={`post-${index}`}
              key={index}
              path={`/shops/${node.UserName}/`}
              title={node.name}
              cover={node.mysqlImages && node.mysqlImages.length > 0 ? node.mysqlImages[0].childImageSharp.fluid : node.ProfilePicURL}
              excerpt={node.category && node.category.substring(0, 80) + `: ${node.tags}` }
            />
          ))}
        </Carousel>
  </LazyLoad>
      </TabPanel>
    )}
    {combinedToysShopEdges && (
      <TabPanel>
      <LazyLoad height={200} once offset={[-200, 0]}>
        <Carousel
          swipeable={false}
          draggable={false}
          showDots={false}
          ssr={true}
          responsive={responsive}
          keyBoardControl={true}
        >
          {combinedToysShopEdges.map((node, index) => (
            <HomeCarouselItem
              id={`post-${index}`}
              key={index}
              path={`/shops/${node.UserName}/`}
              title={node.name}
              cover={node.mysqlImages && node.mysqlImages.length > 0 ? node.mysqlImages[0].childImageSharp.fluid : node.ProfilePicURL}
              excerpt={node.category && node.category.substring(0, 80) + `: ${node.tags}` }
            />
          ))}
        </Carousel>
    </LazyLoad>
      </TabPanel>
    )}
    {combinedElectronicsShopEdges && (
      <TabPanel>
      <LazyLoad height={200} once offset={[-200, 0]}>
        <Carousel
          swipeable={false}
          draggable={false}
          showDots={false}
          ssr={true}
          responsive={responsive}
          keyBoardControl={true}
        >
          {combinedElectronicsShopEdges.map((node, index) => (
            <HomeCarouselItem
              id={`post-${index}`}
              key={index}
              path={`/shops/${node.UserName}/`}
              title={node.name}
              cover={node.mysqlImages && node.mysqlImages.length > 0 ? node.mysqlImages[0].childImageSharp.fluid : node.ProfilePicURL}
              excerpt={node.category && node.category.substring(0, 80) + `: ${node.tags}` }
            />
          ))}
        </Carousel>
    </LazyLoad>
      </TabPanel>
    )}


    {combinedHomeShopEdges && (
      <TabPanel>
      <LazyLoad height={200} once offset={[-200, 0]}>
        <Carousel
          swipeable={false}
          draggable={false}
          showDots={false}
          ssr={true}
          responsive={responsive}
          keyBoardControl={true}
        >
          {combinedHomeShopEdges.map((node, index) => (
            <HomeCarouselItem
              id={`post-${index}`}
              key={index}
              path={`/shops/${node.UserName}/`}
              title={node.name}
              cover={node.mysqlImages && node.mysqlImages.length > 0 ? node.mysqlImages[0].childImageSharp.fluid : node.ProfilePicURL}
              excerpt={node.category && node.category.substring(0, 80) + `: ${node.tags}` }
            />
          ))}
        </Carousel>
    </LazyLoad>
      </TabPanel>
    )}

    {combinedFootwearShopEdges && (
      <TabPanel>
      <LazyLoad height={200} once offset={[-200, 0]}>
        <Carousel
          swipeable={false}
          draggable={false}
          showDots={false}
          ssr={true}
          responsive={responsive}
          keyBoardControl={true}
        >
          {combinedFootwearShopEdges.map((node, index) => (
            <HomeCarouselItem
              id={`post-${index}`}
              key={index}
              path={`/shops/${node.UserName}/`}
              title={node.name}
              cover={node.mysqlImages && node.mysqlImages.length > 0 ? node.mysqlImages[0].childImageSharp.fluid : node.ProfilePicURL}
              excerpt={node.category && node.category.substring(0, 80) + `: ${node.tags}` }
            />
          ))}
        </Carousel>
    </LazyLoad>
      </TabPanel>
    )}

  </Tabs>




  <LazyLoad height={200} once offset={[-200, 0]}>
    <CarouselWrapper>
  <h3>Discover best selling products</h3>
      <Carousel
        swipeable={false}
        draggable={false}
        showDots={false}
        ssr={true}
        responsive={responsive}
        keyBoardControl={true}
      >
        {listShopifyBestProducts.map(({ node }, index) => (
          <ProductCategoryItem
            key={`NewlyAddedProducts-${index}`}
            cover={getProductImage(node)}
            path={`/shops/${node.UserName}/`}
            vendorname={node.VendorName}
            title={node.Title}
            price={node.Price}
            node={node}
          />
        ))}
      </Carousel>
    </CarouselWrapper>
  </LazyLoad>


      <LazyLoad height={200} once offset={[-200, 0]}>
        <CarouselWrapper>
          <h3>New Products</h3>
          <Carousel
            swipeable={false}
            draggable={false}
            showDots={false}
            ssr={true}
            responsive={responsive}
            keyBoardControl={true}
          >
            {visibleNewlyAddedProducts.map(({ node }, index) => (
              <ProductCategoryItem
                key={`NewlyAddedProducts-${index}`}
                cover={getProductImage(node)}
                path={`/shops/${node.UserName}/`}
                vendorname={node.VendorName}
                title={node.Title}
                price={node.Price}
                node={node}
              />
            ))}
          </Carousel>
        </CarouselWrapper>
      </LazyLoad>

      <ShopWrapper>
        <h3>Discover the best online shopping sites at Emprezzo</h3>
        <p>There are endless options when shopping online, yet nothing seems like the right fit. Discover the best direct to consumer brands at Emprezzo.</p>

        <h3>What's the benefit of shopping direct-to-consumer brands?</h3>
        <p>Direct to consumers stores connect diretly with their customer, which helps reduce costs paid to large reatilers and makertplaces. Marketplaces typically charge sellers for marketing, fulfillment, commission, and additional fees making it hard for stores to turn a profit without increasing costs.</p>
        <h3>What are the best online shopping sites?</h3>
        <p>Our lists are compiled based on thousands of data points from social media platforms, trafic data, API tools, and our own research. We present our findings and listed based upon the data retreived. </p>
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
  }
`;
