import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import { css, Global } from '@emotion/core';
import _ from 'lodash';
import { Link } from 'gatsby'
import { CartContext } from './Cart/CartContext'
import AlgoliaProductItem from './AlgoliaProductItem'
import AlgoliaUncommonryItem from './AlgoliaUncommonryItem'
import AlgoliaEmailsItem from './AlgoliaEmailsItem'
import BuyGiftCard from '../components/Cart/BuyGiftCard'
import AlgoliaRangeSlider from './AlgoliaRangeSlider'
import AlgoliaStateResults from './AlgoliaStateResults'
import algoliasearch from 'algoliasearch/lite';
import aa from "search-insights";
import {
  InstantSearch,
  Hits,
  InfiniteHits,
  SearchBox,
  Pagination,
  ClearRefinements,
  RefinementList,
  NumericMenu,
  Configure,
  connectHitInsights,
  connectSearchBox,
} from 'react-instantsearch-dom';
import 'instantsearch.css/themes/algolia.css';
import qs from 'qs'
import { navigate } from "@reach/router"

const SearchWrapper = styled.div`
  width: 100%;
  display: flex;
  @media (max-width: 600px) {
    font-size: 0.5rem;
  }
`;

const LeftPanel = styled.div`
  float: left;
  width: 20vw;
  @media (max-width: 600px) {
    display: none;

  }

  .ais-ClearRefinements-button {
    background-color: #C04CFD;
    @media (max-width: 600px) {
      font-size: 0.5rem;
    }
  }



  .ais-SortBy {
    padding: 0.8rem 0 0.8rem 0;
  }



  .ais-SortBy-select {
    font-size: 0.8rem;
    @media (max-width: 600px) {
      font-size: 0.5rem;
    }
  }



  .ais-RefinementList-item, .ais-NumericMenu-item {
    margin-bottom: 0px;
    @media (max-width: 600px) {
      margin: 0;
    }
  }

  .ais-RefinementList-label , .ais-NumericMenu-label, .ais-RefinementList-checkbox {
    font-size: 0.8rem;
    @media (max-width: 600px) {
      font-size: 0.5rem;
    }
  }

  .ais-RefinementList-labelText , .ais-NumericMenu-labelText {
    margin-left: 5px;
    font-size: 0.8rem;
    @media (max-width: 600px) {
      font-size: 0.5rem;
      line-height: 0.5rem;
    }
  }

  .ais-RefinementList-count {
    display: none;
    font-size: 0.6rem;
  }

  .ais-RangeSlider {
    margin: 0.8rem 1rem 2.4rem 1rem;
  }
  .rheostat-value {
    transform: translateX(-70%);
  }
`;

const RightPanel = styled.div`
  width: 90vw;
  @media (max-width: 600px) {
    width: 95vw;
    margin-left: 0px;
    display: block;
  }
  .searchline {

      display: flex;

    margin: 0 0 2em 0;
  }

  .searchContainer {
    width: 60%;
  }

  .ais-SearchBox-input{
    padding: 0.5rem 1.8remm;
    height: 50px;
  }
  .giftCard {
    text-align: center;
    margin-left: 1em;
    @media (max-width: 900px) {
      margin-left: 0.5em;
    }
  }

  button.Product__buy.button {
      @media (max-width: 800px) {
    padding: 2px;
  }
  }

  .GiftCard--BuyButton {

    @media (max-width: 800px) {
        display:none;
      diplay: block;
      font-size: 1.4em;
      padding: 0px;
    }
  }

  form.ais-SearchBox-form {
        margin-bottom: 1em;
  }

  .indexSelect {
    float:left;
    width: 18%;
    height: 50px;

    margin-right: 0.5rem;
    @media (max-width: 900px) {
      width: calc(15% - 1rem);

    }
    @media (max-width: 600px) {
      width: calc(35% - 1rem);
    }
  }
  .indexSelect select{
    padding: 0.5rem;
    width: 100%;
    position: relative;
    background-color: #fff;
    border: 1px solid #c4c8d8;
    border-radius: 5px;
    font-size: 1rem;
    color: #a5abc4;
    height: 50px;
    @media (max-width: 600px) {
      font-size: 0.8rem;
    padding: 0.25rem;
    }
  }

  .saleFacet {
    float:left;
    width: 100px;
    margin-right: 0.5rem;
  }
  .saleFacet .ais-RefinementList-count {
    display: none;
  }
  .saleFacet .ais-RefinementList-labelText , .ais-NumericMenu-labelText {
    margin-left: 5px;
    font-size: 0.8rem;
    @media (max-width: 600px) {
      font-size: 0.5rem;
      line-height: 0.5rem;
    }
  }

  li.ais-Hits-item a {
    color: #3a4570;
  }

  .ais-Hits-item, .ais-Results-item {
    padding: 0px;
    width: calc(25% - 1rem);
    margin: 0.5em;
    @media (max-width: 900px) {
      width: calc(33.33% - 1rem);
    }
    @media (max-width: 600px) {
      width: calc(50% - 1rem);
    }
  }

  .ais-SearchBox {
    @media (min-width: 900px) {
      width: calc(80% - 1rem);
    }
    width: 100%;

      margin: 0;
      display: inline-block;
  }

  .ais-Pagination-item--selected .ais-Pagination-link {
    color: #FFF;
    background-color: #C04CFD;
    border-color:#C04CFD
  }

  .ais-Pagination-item--disabled .ais-Pagination-link, .ais-Pagination-link, a.ais-Pagination-link {
    color: #a5abc4;
    padding: .3rem .5rem;
    font-size: .9rem;
  }

  .ais-Breadcrumb-link, .ais-HierarchicalMenu-link, .ais-Menu-link, .ais-Pagination-link, .ais-RatingMenu-link {
    color:#C04CFD
  }

  .suggestions {

    width: 70%;
    font-style: italic;
    display: inline-block;
    margin: 0 0 0 0.5em;
    @media (max-width: 900px) {
      width: 90%;
    }
    .ais-InfiniteHits-loadMore {
      display : none;
    }
    .ais-InfiniteHits-item {
      margin: 0px;
      width: auto;
      border: 0px;
      box-shadow: none;
      padding: 0 0.3em;
    }
  }
`;

const FilterHeading = styled.div`
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: bold;
  margin: 8px 0 5px 0;
  @media (max-width: 600px) {
    font-size: 0.5rem;
  }
`;
const VirtualSearchBox = connectSearchBox(() => null);

const AlgoliaProductList = ({ location, history, defaultFilter, defaultSearchTerm, itemsPerPage, hideLeftPanel, hideCTAButton, showClearFilter, facetsToShow, showSearchBox, showSearchSuggestions, searchIndexName, enableShopProductSwitch, enableCart, noResultMessage }) => {

  const [currentIndexName, setCurrentIndexName] = React.useState(searchIndexName || `empProducts`)
  const changeCurrentIndexName = (e) => { setCurrentIndexName(e.target.value); setCurrentSuggestionIndexName(getSuggestionIndex(e.target.value)); setSuggestionQuery(''); }

  const getSuggestionIndex = (mainIndexName) => {
    if (mainIndexName == 'empProducts') return ('empProducts_query_suggestions');
    if (mainIndexName == 'uncommonry') return ('uncommonry_query_suggestions')
  }
  const [currentSuggestionIndexName, setCurrentSuggestionIndexName] = React.useState(getSuggestionIndex(currentIndexName))
  const [suggestionQuery, setSuggestionQuery] = React.useState();

  const algoliaClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_KEY
  );
  const searchClient = {
    search(requests) {
      if (requests.length > 0 && defaultSearchTerm) requests[0].params.query = defaultSearchTerm
      return algoliaClient.search(requests);
    },
  };
  noResultMessage = noResultMessage || `No result found`;
  enableCart = enableCart || false;
  itemsPerPage = itemsPerPage || 12;
  const { itemCount } = useContext(CartContext);

  aa('init', {
    appId: process.env.GATSBY_ALGOLIA_APP_ID,
    apiKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY
  });

  const [currentHitComponent, setCurrentHitComponent] = React.useState();
  React.useEffect(() => {
    if (currentIndexName == 'empProducts') setCurrentHitComponent(() => connectHitInsights(aa)(AlgoliaProductItem));
    if (currentIndexName == 'uncommonry') setCurrentHitComponent(() => connectHitInsights(aa)(AlgoliaUncommonryItem));
    if (currentIndexName == 'emails') setCurrentHitComponent(() => connectHitInsights(aa)(AlgoliaEmailsItem));
  }, [currentIndexName]);

  const AlgoliaSuggestions = ({ hit }) => {
    return (
      <a href="javascript:" onClick={() => setSuggestionQuery(hit.query)}>{hit.query}</a>
    );
  }

  //Routing URL Changes
  const createURL = state => `?${qs.stringify(state)}`;

  const searchStateToUrl = (location , searchState) =>
    location && searchState ? `${location.pathname}${createURL(searchState)}` : '';

  const urlToSearchState = (location) => qs.parse(location && location.search.slice(1));

  const DEBOUNCE_TIME = 700;
  const [searchState, setSearchState] = useState(urlToSearchState(location));
  const [debouncedSetState, setDebouncedSetState] = useState(null);
  const onSearchStateChange = updatedSearchState => {
    clearTimeout(debouncedSetState);
    setDebouncedSetState(
      setTimeout(() => {
        navigate(searchStateToUrl(location, updatedSearchState), { state: updatedSearchState })
      }, DEBOUNCE_TIME)
    );
    setSearchState(updatedSearchState);
  };

  return (
    <SearchWrapper>
      {!enableCart &&
        <Global
          styles={css`
            .cart-section {
              display: none;
            }
        `}
        />
      }
      <InstantSearch
        indexName={currentIndexName}
        searchClient={searchClient}
        searchState={searchState}
        onSearchStateChange={onSearchStateChange}
        createURL={createURL}
      >
        <VirtualSearchBox defaultRefinement={suggestionQuery} />
        {!hideLeftPanel &&
          <LeftPanel>

            {showClearFilter &&
              <ClearRefinements />
            }
            {facetsToShow && facetsToShow.indexOf("category") >= 0 &&
              <>
                <FilterHeading>Category</FilterHeading>
                <RefinementList attribute="shopCategory" showMore='true' limit='5' />
              </>
            }
            {facetsToShow && facetsToShow.indexOf("brands") >= 0 && currentIndexName != 'uncommonry' &&
              <>
                <FilterHeading>Brands</FilterHeading>
                <RefinementList attribute="shopName" showMore='true' limit='5' />
              </>
            }
            {facetsToShow && facetsToShow.indexOf("payments") >= 0 && currentIndexName == 'uncommonry' &&
              <>
                <FilterHeading>Payments</FilterHeading>
                <RefinementList
                  attribute="shopifyPay"
                  transformItems={items =>
                    items.filter(item => (item.label == '1')).map(item => ({
                      ...item,
                      label: "Shop Pay",
                    }))
                  }
                />
                <RefinementList
                  attribute="paypal"
                  transformItems={items =>
                    items.filter(item => (item.label == '1')).map(item => ({
                      ...item,
                      label: "Paypal",
                    }))
                  }
                />
                <RefinementList
                  attribute="applePay"
                  transformItems={items =>
                    items.filter(item => (item.label == '1')).map(item => ({
                      ...item,
                      label: "Apple Pay",
                    }))
                  }
                />
                <RefinementList
                  attribute="amazonPay"
                  transformItems={items =>
                    items.filter(item => (item.label == '1')).map(item => ({
                      ...item,
                      label: "Amazon Pay",
                    }))
                  }
                />
              </>
            }
            {facetsToShow && facetsToShow.indexOf("pricerangeslider") >= 0 && currentIndexName == 'uncommonry' &&
              <>
                <FilterHeading>Average Price</FilterHeading>
                <AlgoliaRangeSlider attribute="price" />
              </>
            }
            {facetsToShow && facetsToShow.indexOf("prices") >= 0 && currentIndexName == 'empProducts' &&
              <>
                <FilterHeading>Prices</FilterHeading>
                <NumericMenu
                  attribute="price"
                  items={[
                    { label: 'All' },
                    { label: 'Under $50', end: 50 },
                    { label: '$50 - $100', start: 50, end: 100 },
                    { label: '$100 - $200', start: 100, end: 200 },
                    { label: '$200+', start: 200 },
                  ]}
                />
              </>
            }
            {/*
            {facetsToShow && facetsToShow.indexOf("giftcard") >= 0 && currentIndexName == 'empProducts' &&
              <>
                <FilterHeading>Gift Card</FilterHeading>
                <RefinementList
                  attribute="name"
                  transformItems={items =>
                    items.filter(item => (item.label.toLowerCase().indexOf('gift') >= 0))
                  }
                />
              </>
            }
            {facetsToShow && facetsToShow.indexOf("gifimage") >= 0 && currentIndexName == 'empProducts' &&
              <>
                <FilterHeading>GIF</FilterHeading>
                <RefinementList
                  attribute="imageURL"
                  transformItems={items =>
                    items.filter(item => (item.label.indexOf('.gif') >= 0)).map(item => ({
                      ...item,
                      label: "GIF",
                    }))
                  }
                />
              </>
            }
            */}

            {facetsToShow && facetsToShow.indexOf("storeoffers") >= 0 &&
              <>
                <FilterHeading>Store Offers</FilterHeading>
                <RefinementList
                  attribute="freeShipMin"
                  transformItems={items =>
                    items.filter(item => (item.label == 0)).map(item => ({
                      ...item,
                      label: "Free Shipping",
                    }))
                  }
                />
                <RefinementList
                  attribute="returnShipFree"
                  transformItems={items =>
                    items.filter(item => (item.label == 'Yes')).map(item => ({
                      ...item,
                      label: "Free Returns",
                    }))
                  }
                />
              </>
            }
          </LeftPanel>
        }
        <RightPanel>
          <Configure clickAnalytics={true} hitsPerPage={itemsPerPage} filters={defaultFilter} />
          <div class="searchline">
            <div class="indexSelect">
              {enableShopProductSwitch &&
                <div style={{ paddingBottom: '0.75rem' }}>
                  <select value={currentIndexName} onChange={changeCurrentIndexName}>
                    <option value="uncommonry">Shops</option>
                    <option value="empProducts">Products</option>
                  </select>
                </div>
              }
            </div>
            {facetsToShow && facetsToShow.indexOf("onsale") >= 0 &&
              <div class="saleFacet">
                <RefinementList
                  attribute="onSale"
                  transformItems={items =>
                    items.filter(item => (item.label == '1')).map(item => ({
                      ...item,
                      label: "On Sale",
                    }))
                  }
                />
              </div>
            }
            <div class="searchContainer">
              {showSearchBox &&
                <>
                  <SearchBox defaultRefinement={suggestionQuery} />
                </>
              }<br style={{ clear: 'both' }} />
              <span style={{ 'font-weight': 'bold', 'padding': '0 1em 1em 0' }}>Trending </span>
              {showSearchSuggestions && currentSuggestionIndexName &&
                <div className="suggestions">

                  <InstantSearch
                    searchClient={searchClient}
                    indexName={currentSuggestionIndexName}
                  >
                    <Configure hitsPerPage={5} />
                    <InfiniteHits hitComponent={AlgoliaSuggestions} />
                  </InstantSearch>
                </div>
              }
            </div>
            {!hideCTAButton &&
              <div class="giftCard">
                <BuyGiftCard />
              </div>
            }
          </div>

          <AlgoliaStateResults noResultMessage={noResultMessage} />
          <Hits hitComponent={currentHitComponent} />
          <Pagination />
        </RightPanel>
      </InstantSearch>
    </SearchWrapper>
  );
}

export default AlgoliaProductList;
