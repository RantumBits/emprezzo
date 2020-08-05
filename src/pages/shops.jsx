import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Header, BlogList } from 'components';
import { Layout } from 'layouts';
import PostList from '../components/PostList';

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

const Shops = ({ data }) => {
  const { edges } = data.allMysqlMainView;
  const listEdges = [];
  const maxItems = 12;
  const [limit, setLimit] = React.useState(maxItems);
  const [showMore, setShowMore] = React.useState(true);

  const increaseLimit = () => {
      setLimit(limit + maxItems);
  }

  const rowDataViewEdges = data.allMysqlDataView.edges;

  //filtering items as per limit
  edges.map((edge) => {
    if (listEdges.length < limit) {
      listEdges.push(edge);
    }
  })

  return (
    <Layout>
      <Helmet title={'all Shops'} />
      <Header title="discover a great independent shop"><span class="Header--Subtitle"></span></Header>

      <ShopsWrapper>
        {listEdges.map(({ node }) => (
          <PostList
              key={node.UsreName}
              path={`/shops/${node.UserName}`}
              title={node.FullName}
              excerpt={node.Biography && node.Biography.substring(0,40)+"..."}
              mysqldataview={rowDataViewEdges}
              instagramname={node.UserName}
            />
        ))}
      </ShopsWrapper>
      {showMore && listEdges.length > 0 && listEdges.length < edges.length &&
        <div className="center">
            <button className="button" onClick={increaseLimit}>
              Load More
            </button>
        </div>
      }
    </Layout>
  );
};

export default Shops;

export const query = graphql`
  query {
    allMysqlMainView {
      edges {
        node {
          AlexaURL
          UserName
          FullName
          Biography
        }
      }
    }
    allMysqlDataView {
      edges {
        node {
          UserName
          FullName
          UniquePhotoLink
          ProfilePicURL
          Caption
          ShortCodeURL
        }
      }
    }
  }
`;
