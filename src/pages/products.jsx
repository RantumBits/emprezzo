import React from 'react';
import { graphql } from 'gatsby';
import styled from '@emotion/styled';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header } from 'components';
import ProductCategoryItem from '../components/ProductCategoryItem';
import { Layout } from 'layouts';
import _ from 'lodash';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { useMediaQuery } from 'react-responsive'

const CategoryHeading = styled.h1`
  margin-left: 4rem;
`;

const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: normal;
  margin: 1rem 4rem 1rem 4rem;
  @media (max-width: 1000px) {
    margin: 1rem 2rem 1rem 2rem;
  }
  @media (max-width: 700px) {
    margin: 1rem 1rem 1rem 1rem;
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin: 1rem 4rem 1rem 4rem;
  @media (max-width: 1000px) {
    margin: 1rem 2rem 1rem 2rem;
  }
  @media (max-width: 700px) {
    margin: 1rem 1rem 1rem 1rem;
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

const Products = ({ data, pageContext }) => {
  const rowProductsEdges = data.allMysqlShopifyView.edges;
  const maxFeaturedItems = 25;
  const [limit, setLimit] = React.useState(maxFeaturedItems);
  const [filter, setFilter] = React.useState([]);
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })
  const maxItems = 25;

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

  const increaseLimit = (allEdges) => {
    setLimit(limit + maxFeaturedItems);
  }

  const checkEdgesInProductView = (allEdges) => {
    let filteredProducts = [];
    allEdges.map((edge) => {
      const inputID = edge.node.UserName;
      const result = _.filter(rowProductsEdges, ({ node }) => node.UserName == inputID && node.Price > 20 && node.Title.toLowerCase().indexOf("gift") < 0 && node.Title.toLowerCase().indexOf("test") < 0 && node.Title.toLowerCase().indexOf("shipping") < 0)
      const max2Results = _.slice(result,0,2);//max 2 products from a store
      filteredProducts = _.union(filteredProducts, max2Results)
    });
    //apply filtertext if its greater than 3 characters
    if(filter && filter.length>3){
      filteredProducts = _.filter(filteredProducts, ({ node }) => node.VendorName.toLowerCase().indexOf(filter.toLowerCase())>=0 || node.Title.toLowerCase().indexOf(filter.toLowerCase())>=0)
    }
    return filteredProducts;
  }

  const getProductVariant = (node) => {
    let productVariant = null;
    //if(node.VariantTitle && node.VariantTitle!=="Default Title") productVariant = node.VariantTitle;
    return productVariant;
  }

  const getProductImage = (node) => {
    let productImage = node.VariantImageURL;
    if (!productImage) productImage = node.ImageURL;
    return productImage;
  }

  const mainViewEdges = data.allMysqlMainView.edges;
  //get featured shops
  const featuredShopEdges = _.filter(mainViewEdges, ({ node }) => node.tags && node.tags.indexOf("featured")>=0)

  //if filter is present then filter and show from all products, else just show products from featured shops
  const filteredFeaturedProducts = (filter && filter.length>3)?checkEdgesInProductView(mainViewEdges):checkEdgesInProductView(featuredShopEdges);

  //Now limiting the featured items as per limit
  const visibleFeaturedProducts = _.slice(filteredFeaturedProducts, 0, limit);

  const filteredProducts = checkEdgesInProductView(mainViewEdges);

  //Now limiting the featured items as per limit
  const visibleProducts = _.slice(filteredProducts, 0, limit);

  return (
    <Layout title={'Shopify Products | Disover great products from Shopify stores'} description="Discover the best Shopify products from hundreds of stores in one place. It's like a mini-Shopify marketplace.">
      <Header title="🧐 Disover great products from Shopify stores" />
          <div>
            <CategoryHeading>Featured Shopify Products</CategoryHeading>
            <SearchWrapper>
              Search
              <input
                placeholder="filter products"
                onChange={({ target: { value } }) => {
                  setFilter(value);
                }}
              />
            </SearchWrapper>
            <CarouselWrapper>
              <Carousel
                swipeable={false}
                draggable={false}
                showDots={false}
                responsive={responsive}
                keyBoardControl={true}
                >
                {visibleFeaturedProducts.map(({ node }, index) => (
                  <ProductCategoryItem
                    key={index}
                    cover={getProductImage(node)}
                    path={`/shops/${node.UserName}`}
                    vendorname={node.VendorName}
                    title={node.Title}
                    variant={getProductVariant(node)}
                    price={node.Price}
                  />
                ))}
              </Carousel>
            </CarouselWrapper>

            <CategoryHeading>New Shopify Products</CategoryHeading>
            <CarouselWrapper>
              <Carousel
                swipeable={false}
                draggable={false}
                showDots={false}
                responsive={responsive}
                keyBoardControl={true}
                >
                {visibleProducts.map(({ node }, index) => (
                  <ProductCategoryItem
                    key={index}
                    cover={getProductImage(node)}
                    path={`/shops/${node.UserName}`}
                    vendorname={node.VendorName}
                    title={node.Title}
                    variant={getProductVariant(node)}
                    price={node.Price}
                  />
                ))}
              </Carousel>
            </CarouselWrapper>
          </div>
    </Layout>
  );
};

export default Products;

export const query = graphql`
  query {
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
          UserName
          tags
        }
      }
    }
  }
`;
