import React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const FeedContainer = styled.div`
  margin: 1rem 0;

  div {
    margin: 0 1rem 1rem 0;
    padding: 0.3rem 0.6rem;
    border-bottom: 1px solid ${props => props.theme.colors.primary.light};
  }
`;

const AtomFeedList = ({ list }) => (
  <FeedContainer>
    {list && list.length > 0 && <h3>Sample product list:</h3>}

    {list && list.length > 0 &&
      list.slice(0, 5).map(feed => {
        //const upperTag = tag.charAt(0).toUpperCase() + tag.slice(1);
        return (
          <div key={feed.guid} >
            <a key={feed.guid} href={feed.link} target="_blank">
              {feed.title}
            </a>
          </div>
        );
      })}
  </FeedContainer>
);

export default AtomFeedList;

AtomFeedList.propTypes = {
  list: PropTypes.array,
};
