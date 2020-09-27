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
  const categoryGroup = data.allMysqlMainView.group;
  //console.log(categoryGroup)  

  const rowProductsEdges = data.allMysqlShopifyView.edges;
  
  const checkEdgesInProductView = (allEdges) => {
    const filteredProducts = [];
    allEdges.map((edge)=>{
      const inputID = edge.node.UserName;      
      let result = _.filter(rowProductsEdges, ({ node }) => node.UserName == inputID)
      //console.log(result)
      if(result.length>0) filteredProducts.push(result[0]);
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

  const getPath = (node) => {
    let path = node.VendorURL; // if there is no shop with instagram id then path will be vendor URL
    //checking if the shop exists corresponding to this instagram id
    const inputInstaID = node.UserName;
    var result = _.filter(rowProductsEdges, ({ node }) => node.UserName == inputInstaID)
    if (result.length > 0) path = "/shops/" + result[0].node.slug;
    return path;
  }

  return (
    <Layout title={'Top Shopify Products'} description="A mini shopify marketplace. Discover the best Shopify products from hundreds of stores in one place.">
      <Header title="Top Shopify Products" />      
        {categoryGroup.map((category, index) => {
          const allEdges = category.edges;
          //console.log(allEdges)
          //console.log("****** filtered")          
          const filteredProducts = checkEdgesInProductView(allEdges)
          //console.log(filteredProducts)
          //console.log("******* top 5")
          const listEdges = _.slice(filteredProducts,0,5)
          //console.log(listEdges)
          return (
            <div key={index}>
              {listEdges.length>0 && category.fieldValue && 
                <CategoryHeading>{category.fieldValue}</CategoryHeading> 
              }
              <CategoryWrapper>
                {category.fieldValue && listEdges.map(({ node }) => (
                  <ProductList
                    key={getProductImage(node)}
                    cover={getProductImage(node)}
                    path={getPath(node)}
                    vendorname={node.VendorName}
                    title={node.Title}
                    variant={getProductVariant(node)}
                    price={node.Price}
                  />
                ))}
              </CategoryWrapper>
            </div>
        )})}
      
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
      group(field: category) {
        fieldValue
        edges {
          node {
            AlexaURL
            UserName
          }
        }
      }
    }
  }
`;
