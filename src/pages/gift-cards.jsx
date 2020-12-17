import React from 'react';
import styled from '@emotion/styled';
import { Header } from 'components';
import AlgoliaProductList from '../components/AlgoliaProductList';
import ShopifyCheckout from '../components/Cart/ShopifyCheckout'
import BuyGiftCard from '../components/Cart/BuyGiftCard'
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
  .indexSelect {
      display: none;
  }


`;

const GiftCard = () => {
  return (
    <Layout title={'Shop gift cards from hundreds of direct to consumer brands and indepdent retailers'} description="Discover and shop for digital gift cards and gift certificates from hundreds of amazing online stores. ">
      <Header title="Shop gift cards" subtitle="Shop gift cards from hundreds of great shops" />

      <SearchWrapper>
        {/* <ShopifyCheckout uniqueComponentID="6155771576495" buttonText="BUY GIFT CARD" /> */}

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
