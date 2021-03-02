import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import { Header, PostList } from 'components';
import AlgoliaProductList from '../components/AlgoliaProductList';
import BuyGiftCard from '../components/Cart/BuyGiftCard'
import { Layout } from 'layouts';
import _ from 'lodash';
import 'react-multi-carousel/lib/styles.css';
import LazyLoad from 'react-lazyload';
import '../styles/prism';

const ShopWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 3rem 4rem 1rem 3rem;
  @media (max-width: 1000px) {
    margin: 4rem 2rem 1rem 2rem;
  }
  @media (max-width: 600px) {
    margin: 0.5rem;
  }
`;

const Index = ({ data, location }) => {

  return (
    <Layout title={'emprezzo | Discover great independent online stores'} description="Discover the best online storess & direct-to-consumer brands" >
      <Header title="Discover great online stores" subtitle="shop direct & support independent business"></Header>
      {/* <p className="center"><a href ="/randomshop" className="button button">Discover a  shop</a></p> */}
      {/*  <div className="center">
        <a href="/randomshop/" className="button ">Discover a new shop</a>
      </div>

      <CheckoutWrapper>
      <center style={{width: "-webkit-fill-available"}}><BuyGiftCard /></center>
      </CheckoutWrapper>
*/}

      <LazyLoad height={200} once offset={[-200, 0]}>

        <ShopWrapper>
          <AlgoliaProductList
            facetsToShow={'category,prices,storeoffers,brands,payments,gifimage'}
            showSearchBox={true}
            hideCTAButton={true}
            showSearchSuggestions={true}
            showClearFilter={true}
            enableCart={true}
            enableShopProductSwitch={true}
            searchIndexName={'uncommonry'}
            location={location}
          />
        </ShopWrapper>
      </LazyLoad>


      <ShopWrapper>
        <h3>Discover the best independent shopping sites</h3>
        <p>Shopping is heavily dominated by major retailers. As commerce increasingly shifts from physical to digital means, this balance has shifted more in favor of a small number of mega-retailers with one site making up nearly 50% of all online shopping. This isn't the way the internet was meant to be.</p>
        <p>Consumers have shifted behaviours from shopping in a relatively open physical world to an environment where results beyond the first page or two are rarely seen. Rather than yielding fewer opportunities, digital commerce should open opportunities for a multitude of focused brands to make exceptional products for a physically widespread audience. </p>
        <p>Major online retailers and marketplaces are convenient, but often don't feature the best brands and products. They charge high fees, sell knockoffs, and favor fast & cheap over innovative & enduring.</p>
        <p>There are hundreds of brands that sell directly to consumers on their own sites. Many offer free shipping, discounts to new customers, and other perks of shopping directly. We developed a database of 500+ shops and 20,000+ products that can be searched and filtered by keywords, free shipping offers, price, return policies, etc. The database is constantly growing and updated with new data.</p>
        <p>Help support independent business. Before making a purchase from a major retail site, search for an independent shopping alternative at emprezzo.</p>


      </ShopWrapper>
    </Layout >
  );
};

export default Index;
