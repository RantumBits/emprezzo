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

const Products = ({ data, pageContext }) => {
  const { category } = pageContext;
  const categoryHeading = category + " Shops";

  const rowProductsEdges = data.allMysqlProducts.edges;

  const checkEdgesInProductView = (allEdges) => {
    let filteredProducts = [];
    allEdges.map((edge) => {
      const inputID = edge.node.UserName;
      let result = _.filter(rowProductsEdges, ({ node }) => node.UserName == inputID)
      filteredProducts = _.union(filteredProducts, result)
    });
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

  return (
    <Layout title={'Shopify Products | Disover great products from Shopify stores'} description="Discover the best Shopify products from hundreds of stores in one place. It's like a mini-Shopify marketplace.">
      <Header title="🧐 Disover great products from Shopify stores" />
          <div>
            <CategoryHeading>Shopify Products</CategoryHeading>
            <CategoryWrapper>
              {filteredProducts.map(({ node }, index) => (
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
