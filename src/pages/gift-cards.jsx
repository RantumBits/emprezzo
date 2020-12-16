import React from 'react';
import styled from '@emotion/styled';
import { Header } from 'components';
import AlgoliaProductList from '../components/AlgoliaProductList';
import ShopifyCheckout from '../components/Cart/ShopifyCheckout'
import { Layout } from 'layouts';
import _ from 'lodash';

const CategoryHeading = styled.h1`
  margin-left: 4rem;
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

const GiftCard = () => {
  return (
    <Layout title={'Discover great products from independent brands'} description="Search thousands of products from independent stores and direct-to-consumer brands. Shop the emprezzo marketplace alternative to discover great products support independent businesses.">
      <Header title="emprezzo product marketplace" description="🧐 Discover great products from independent brands" />
      <CategoryHeading>Discover great gift cards</CategoryHeading>
      <SearchWrapper>        
        <ShopifyCheckout uniqueComponentID="6155771576495" buttonText="BUY GIFT CARD" />
        <AlgoliaProductList
          defaultSearchTerm={'gift card'}
          facetsToShow={'category,brands,prices'}
          showSearchBox={true}
          showClearFilter={true}
        />
      </SearchWrapper>
    </Layout>
  );
};

export default GiftCard;

