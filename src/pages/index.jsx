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
      items: 5,
      slidesToSlide: 5 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
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
      const result = _.filter(rowallMysqlShopifyProductsAllEdges, ({ node }) => node.VendorURL == inputID && node.Price > 20 && node.Title.toLowerCase().indexOf("gift") < 0 && node.Title.toLowerCase().indexOf("test") < 0 && node.Title.toLowerCase().indexOf("shipping") < 0)
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
  const globalRankEdges = _.slice(globalRankSortedEdges, 0, limit)

  //Now sorting (desc) based on TotalFollowers
  var totalFollowersSortedEdges = _.sortBy(combinedEdges, obj => -obj.TotalFollowers)

  //Now limiting the items as per limit
  const totalFollowersEdges = _.slice(totalFollowersSortedEdges, 0, limit)

  const featuredShopEdges = _.filter(edges, ({ node }) => node.tags && node.tags.indexOf("featured") >= 0)
  const combinedFeatureShopEdges = [];
  //Creating a new dataset with original nodes and required columns from DataView
  featuredShopEdges.map((edge) => {
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
    combinedFeatureShopEdges.push(newNode);
  })
  //console.log(combinedFeatureShopEdges)

  //getting newly added products
  const newlyAddedProducts = checkEdgesInProductView(edges);
  //Now limiting the items as per limit
  const visibleNewlyAddedProducts = _.slice(newlyAddedProducts, 0, limit);

  return (
    <Layout title={'emprezzo | Discover the best independent online stores & direct-to-consumer brands'} description="Discover the best online shopping sites & direct to consumer brands." >
      <Header title="Discover the best independent online stores"></Header>
      {/* <p className="center"><a href ="/randomshop" className="button button">Discover a  shop</a></p> */}
      <div className="center">
        🧐 Discover the best independent online shopping sites<br />🛒 Shop direct-to-consumer brands<br />

      </div>
      <div className="center">

        <a href="/randomshop/" className="button ">Discover a shop</a>
      </div>
      <div className="search_main">
        <Search collapse homepage indices={searchIndices} />
      </div>

      <LazyLoad height={200} once offset={[-200, 0]}>
        <CarouselWrapper>
          <h2>Fast Growing Stores</h2>
        See some of the fastest growing shops by global site traffic rank over the last 28 days
        <Carousel
            swipeable={false}
            draggable={false}
            showDots={false}
            ssr={true}
            responsive={responsive}
            keyBoardControl={true}
          >
            {globalRankChangeEdges.map((node, index) => (
              <HomeCarouselItem
                id={`post-${index}`}
                key={index}
                path={`/shops/${node.slug}/`}
                title={node.name}
                cover={node.mysqlImages && node.mysqlImages.length > 0 ? node.mysqlImages[0].childImageSharp.fluid : node.ProfilePicURL}
                excerpt={node.about && node.about.substring(0, 40) + "..."}
              />
            ))}
          </Carousel>
        </CarouselWrapper>
      </LazyLoad>

      <LazyLoad height={200} once offset={[-200, 0]}>
        <CarouselWrapper>
          <h2>Popular Shops by Traffic</h2>
        See some of the most popular shops by global site traffic ranking
        <Carousel
            swipeable={false}
            draggable={false}
            showDots={false}
            ssr={true}
            responsive={responsive}
            keyBoardControl={true}
          >
            {globalRankEdges.map((node, index) => (
              <HomeCarouselItem
                id={`post-${index}`}
                key={index}
                path={`/shops/${node.slug}/`}
                title={node.name}
                cover={node.mysqlImages && node.mysqlImages.length > 0 ? node.mysqlImages[0].childImageSharp.fluid : node.ProfilePicURL}
                excerpt={node.about && node.about.substring(0, 40) + "..."}
              />
            ))}
          </Carousel>
        </CarouselWrapper>
      </LazyLoad>

      <LazyLoad height={200} once offset={[-200, 0]}>
        <CarouselWrapper>
          <h3>Popular on Social Media</h3>
      Discover some of the <a href="/top-shopify-stores">top Shopify stores</a> by total social media follower counts across Instagram, Facebook, Twitter, Tiktok, Pinterest & Youtube
        <Carousel
            swipeable={false}
            draggable={false}
            showDots={false}
            ssr={true}
            responsive={responsive}
            keyBoardControl={true}
          >
            {totalFollowersEdges.map((node, index) => (
              <HomeCarouselItem
                id={`post-${index}`}
                key={index}
                path={`/shops/${node.slug}/`}
                title={node.name}
                cover={node.mysqlImages && node.mysqlImages.length > 0 ? node.mysqlImages[0].childImageSharp.fluid : node.ProfilePicURL}
                excerpt={node.about && node.about.substring(0, 40) + "..."}
              />
            ))}
          </Carousel>
        </CarouselWrapper>
      </LazyLoad>

      <LazyLoad height={200} once offset={[-200, 0]}>
        <CarouselWrapper>
          <h3>Featured Online Shops</h3>
          <Carousel
            swipeable={false}
            draggable={false}
            showDots={false}
            ssr={true}
            responsive={responsive}
            keyBoardControl={true}
          >
            {combinedFeatureShopEdges.map((node, index) => (
              <HomeCarouselItem
                id={`post-${index}`}
                key={index}
                path={`/shops/${node.UserName}/`}
                title={node.name}
                cover={node.mysqlImages && node.mysqlImages.length > 0 ? node.mysqlImages[0].childImageSharp.fluid : node.ProfilePicURL}
                excerpt={node.about && node.about.substring(0, 40) + "..."}
              />
            ))}
          </Carousel>
        </CarouselWrapper>
      </LazyLoad>

      <LazyLoad height={200} once offset={[-200, 0]}>
        <CarouselWrapper>
          <h3>New Shopify Products</h3>
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
                key={index}
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
          ImageURL
          MaxPrice
          Position
          Price
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
        }
      }
    }
  }
`;
