
import React from 'react';
import { connectStateResults } from 'react-instantsearch-dom';

const StateResults = ({ searchResults, noResultMessage }) => {
  const hasResults = searchResults && searchResults.nbHits !== 0;
  const nbHits = searchResults && searchResults.nbHits;
  return (
    <div>
      {/* <div hidden={!hasResults}>There are {nbHits} results</div> */}
      {searchResults && searchResults.nbHits == 0 &&
        <div hidden={hasResults} dangerouslySetInnerHTML={{ __html: noResultMessage }} />
      }
    </div>
  );
};

const AlgoliaStateResults = connectStateResults(StateResults);

export default AlgoliaStateResults;