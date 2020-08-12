import React from 'react';
import { graphql } from 'gatsby';
import styled from '@emotion/styled';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header } from 'components';
import PostList5Col from '../components/PostList5Col';
import ProductList from '../components/ProductList';
import { Layout } from 'layouts';
import _ from 'lodash';
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
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

const Products = ({ data, pageContext }) => {
  const rowProductsEdges = data.allMysqlProducts.edges;
  const maxItems = 9;
  const [limit, setLimit] = React.useState(maxItems);
  const [filter, setFilter] = React.useState([]);
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })
  
  const increaseLimit = (allEdges) => {
    setLimit(limit + maxItems);
  }

  const checkEdgesInProductView = (allEdges) => {
    let filteredProducts = [];
    allEdges.map((edge) => {
      const inputID = edge.node.UserName;
      const result = _.filter(rowProductsEdges, ({ node }) => node.UserName == inputID)      
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
  const filteredProducts = checkEdgesInProductView(featuredShopEdges)

  //Now limiting the items as per limit
  const visibleProducts = _.slice(filteredProducts, 0, limit);

  return (
    <Layout title={'Shopify Products | Disover great products from Shopify stores'} description="Discover the best Shopify products from hundreds of stores in one place. It's like a mini-Shopify marketplace.">
      <Header title="🧐 Disover great products from Shopify stores" />
          <div>
            <CategoryHeading>Shopify Products</CategoryHeading>
            <SearchWrapper>
              Search 
              <input 
                placeholder="filter products"  
                onChange={({ target: { value } }) => {
                  setFilter(value);
                }}
              />
            </SearchWrapper>
            {/* Show carousel for mobile version */}
            {isMobile &&
              <Carousel
                showThumbs={false}
                infiniteLoop
                showIndicators={false}
                selectedItem={1}
                showArrows={true}
                showStatus={false}
              >
                {visibleProducts.map(({ node }, index) => (
                  <ProductList
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
            }

            {/* Show normal version */}
            {!isMobile &&
              <CategoryWrapper>
                {visibleProducts.map(({ node }, index) => (
                  <ProductList
                    key={index}
                    cover={getProductImage(node)}
                    path={`/shops/${node.UserName}`}
                    vendorname={node.VendorName}
                    title={node.Title}
                    variant={getProductVariant(node)}
                    price={node.Price}
                  />
                ))}
              </CategoryWrapper>
            }
            {visibleProducts.length > 0 && visibleProducts.length < filteredProducts.length &&
              <div className="center">
                <button className="button" onClick={increaseLimit}>
                  Load More
                </button>
              </div>
            }
          </div>
    </Layout>
  );
};

export default Products;

export const query = graphql`
  query {
    allMysqlProducts {
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
