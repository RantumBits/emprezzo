import React from 'react';
import styled from '@emotion/styled';
import _ from 'lodash';
import AlgoliaProductItem from './AlgoliaProductItem'
import AlgoliaUncommonryItem from './AlgoliaUncommonryItem'
import AlgoliaRangeSlider from './AlgoliaRangeSlider'
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  ClearRefinements,
  RefinementList,
  SortBy,
  Configure,
} from 'react-instantsearch-dom';
import 'instantsearch.css/themes/algolia.css';

const SearchWrapper = styled.div`
  width: 100%;
  display: flex;
  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  float: left;
  width: 20vw;
  @media (max-width: 700px) {
    width: 80vw;
  }

  .ais-ClearRefinements-button {
    background-color: #C04CFD;
  }

  .ais-SortBy {
    padding: 0.8rem 0 0.8rem 0;
  }

  .ais-SortBy-select {
    font-size: 0.8rem;
  }

  .ais-RefinementList-item {
    margin-bottom: 0px;
  }

  .ais-RefinementList-labelText {
    margin-left: 5px;
    font-size: 0.8rem;
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
  width: 80vw;
  @media (max-width: 700px) {
    margin-left: 0px;
    display: block;
  }

  .ais-Hits-item, .ais-Results-item {
    padding: 0px;
    width: calc(20% - 1rem);
    @media (max-width: 700px) {
      width: calc(50% - 1rem);
    }
  }

  .ais-Pagination-item--selected .ais-Pagination-link {
    color: #FFF;
    background-color: #C04CFD;
    border-color:#C04CFD
  }

  .ais-Pagination-item--disabled .ais-Pagination-link {
    color: #a5abc4;
  }

  .ais-Breadcrumb-link, .ais-HierarchicalMenu-link, .ais-Menu-link, .ais-Pagination-link, .ais-RatingMenu-link {
    color:#C04CFD
  }
`;

const FilterHeading = styled.div`
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: bold;
  margin: 8px 0 5px 0
`;

const AlgoliaProductList = ({ defaultFilter, defaultSearchTerm, showClearFilter, facetsToShow, showSearchBox, searchIndexName }) => {
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
  searchIndexName = searchIndexName || `empProducts`;

  return (
    <SearchWrapper>
      <InstantSearch indexName={searchIndexName} searchClient={searchClient}>
        <LeftPanel>
          {showClearFilter &&
            <ClearRefinements />
          }
          <SortBy
            defaultRefinement="empProducts"
            items={[
              { value: 'empProducts_UpdatedDate_Desc', label: 'UpdatedDate desc.' },
              { value: 'empProducts_UpdatedDate_Asc', label: 'UpdatedDate asc.' },
              { value: 'empProducts_SellingRank_Desc', label: 'SellingRank desc.' },
              { value: 'empProducts_SellingRank_Asc', label: 'SellingRank asc.' },
              { value: 'empProducts_Price_Desc', label: 'Price desc.' },
              { value: 'empProducts_Price_Asc', label: 'Price asc.' },
            ]}
          />
          {facetsToShow && facetsToShow.indexOf("category") >= 0 &&
            <>
              <FilterHeading>Category</FilterHeading>
              <RefinementList attribute="shopCategory" />
            </>
          }
          {facetsToShow && facetsToShow.indexOf("brands") >= 0 &&
            <>
              <FilterHeading>Brands</FilterHeading>
              <RefinementList attribute="shopName" />
            </>
          }
          {facetsToShow && facetsToShow.indexOf("pricerangeslider") >= 0 &&
            <>
              <FilterHeading>Average Price</FilterHeading>
              <AlgoliaRangeSlider attribute="price" />
            </>
          }
          {facetsToShow && facetsToShow.indexOf("onsale") >= 0 &&
            <>
              <RefinementList
                attribute="onSale"
                transformItems={items =>
                  items.filter(item => (item.label == '1')).map(item => ({
                    ...item,
                    label: "On Sale",
                  }))
                }
              />
            </>
          }
          {facetsToShow && facetsToShow.indexOf("giftcard") >= 0 &&
            <>
              <RefinementList
                attribute="name"
                transformItems={items =>
                  items.filter(item => (item.label.toLowerCase().indexOf('gift') >= 0))
                }
              />
            </>
          }
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
          <Configure hitsPerPage={15} filters={defaultFilter} />
        </LeftPanel>
        <RightPanel>
          {showSearchBox &&
            <SearchBox />
          }
          {searchIndexName == 'empProducts' &&
            <Hits hitComponent={AlgoliaProductItem} />
          }
          {searchIndexName == 'uncommonry' &&
            <Hits hitComponent={AlgoliaUncommonryItem} />
          }
          <Pagination />
        </RightPanel>
      </InstantSearch>
    </SearchWrapper>
  );
}

export default AlgoliaProductList;
