import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Header, BlogList } from 'components';
import { Layout } from 'layouts';
import ProductList from '../components/ProductList';
import _ from 'lodash';

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

const FilterArea = styled.div`
  float: right;
  margin-right: 4rem;
  @media (max-width: 1000px) {
    margin-right: 2rem;
  }
  @media (max-width: 700px) {
    margin-right: 1rem;
  }
`;

const Products = ({ data }) => {
  const { edges } = data.allMysqlProducts;
  const rowSheetDataEdges = data.allGoogleSheetListRow.edges;
  let listEdges = [];
  const maxItems = 12;
  const [limit, setLimit] = React.useState(maxItems);
  const [showMore, setShowMore] = React.useState(true);
  const [filterText, setFilterText] = React.useState("");

  const increaseLimit = () => {
    setLimit(limit + maxItems);
  }

  //filtering items as per limit
  edges.map((edge) => {
    if (listEdges.length < limit) {
      listEdges.push(edge);
    }
  })

  //check if there is any filter text entered by user
  if (filterText && filterText.length > 2) {
    var result = _.filter(listEdges, ({ node }) => (node.Title.toLowerCase().indexOf(filterText.toLowerCase()) >= 0 || node.VendorName.toLowerCase().indexOf(filterText.toLowerCase()) >= 0))
    if (result.length > 0) listEdges = result;
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
    //console.log("********** inputInstaID = " + inputInstaID)
    var result = _.filter(rowSheetDataEdges, ({ node }) => node.instagramname == inputInstaID)
    //console.log("********** Shop found = " + result.length)
    if (result.length > 0) path = "/shops/" + result[0].node.slug;
    return path;
  }

  return (
    <Layout>
      <Helmet title={'Top Shopify Products'} description="Discover the best Shopify products from hundreds of stores in one place" />
      <Header title="Top Shopify Products" />
      <FilterArea>
        Filter Products:{` `}
      <input
          type="text"
          placeholder="Filter Text"
          aria-label="Filter Text"
          onChange={e => setFilterText(e.target.value)}
        />
      </FilterArea>
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
    allGoogleSheetListRow {
      edges {
        node {
          slug
          instagramname
        }
      }
    }
  }
`;
