import React from 'react';
import styled from '@emotion/styled';
import _ from 'lodash';
import AlgoliaProductItem from './AlgoliaProductItem'
import AlgoliaUncommonryItem from './AlgoliaUncommonryItem'
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  ClearRefinements,
  RefinementList,
  Configure,
} from 'react-instantsearch-dom';
import 'instantsearch.css/themes/algolia.css';

const SearchWrapper = styled.div`
  width: 100%;  
  display: flex;
`;

const LeftPanel = styled.div`
  float: left;
  width: 20vw;

  .ais-ClearRefinements-button {
    background-color: #C04CFD;
  }

  .ais-RefinementList-item {
    margin-bottom: 0px;    
  }

  .ais-RefinementList-labelText {
    margin-left: 5px;
    font-size: 0.8rem;
  }

  .ais-RefinementList-count {
    font-size: 0.6rem;
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

  ais-Breadcrumb-link, .ais-HierarchicalMenu-link, .ais-Menu-link, .ais-Pagination-link, .ais-RatingMenu-link {
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
          <Configure hitsPerPage={10} filters={defaultFilter} />
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
