import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Header, BlogList } from 'components';
import { Layout } from 'layouts';
import ProductList from '../components/ProductList';

const ShopsWrapper = styled.div`
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

const Products = ({ data }) => {
  const { edges } = data.allMysqlProducts;
  const listEdges = [];
  const maxItems = 12;
  const [limit, setLimit] = React.useState(maxItems);
  const [showMore, setShowMore] = React.useState(true);

  const increaseLimit = () => {
    setLimit(limit + maxItems);
  }

  //filtering items as per limit
  edges.map((edge) => {
    if (listEdges.length < limit) {
      listEdges.push(edge);
    }
  })

  const getProductVariant = (node) => {
    let productVariant = null;
    //if(node.VariantTitle && node.VariantTitle!=="Default Title") productVariant = node.VariantTitle;
    return productVariant;
  }

  const getProductImage = (node) => {
    let productImage = node.VariantImageURL;
    if(!productImage) productImage = node.ImageURL;
    return productImage;
  }

  const getPath = (node) => {
    let path = node.VendorURL;
    if(node.UserName) path = `/shop/${node.UserName}`;
    return path;
  }

  return (
    <Layout>
      <Helmet title={'all Products'} />
      <Header title="Products"></Header>
      <ShopsWrapper>
        {listEdges.map(({ node }) => (
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
      </ShopsWrapper>
      {showMore && listEdges.length > 0 && listEdges.length < edges.length &&
        <div className="center">
          <a className="button" onClick={increaseLimit} style={{ cursor: "pointer" }}>
            Load More
            </a>
        </div>
      }
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
  }
`;
