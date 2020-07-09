import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import _ from 'lodash';
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
  const { edges } = data.allMysqlSocialIDs;
  const rowDataViewEdges = data.allMysqlDataView.edges;
  const listEdges = [];
  const maxItems = 12;
  const [limit, setLimit] = React.useState(maxItems);
  const [showMore, setShowMore] = React.useState(true);

  const increaseLimit = () => {
    setLimit(limit + maxItems);
  }

  //filtering items as per limit
  edges.map((edge) => {
    const inputInstaID = edge.node.Instagram;
    //console.log("****+++*** = "+inputInstaID)
    var result = _.filter(rowDataViewEdges, ({node}) => node.UserName == inputInstaID)
    //console.log(result)
    if (listEdges.length < limit && result.length>0) {
      listEdges.push(result[0]);
      console.log("***** "+result[0].UniquePhotoLink)
    }
  })

  return (
    <Layout>
      <Helmet title={'all Shops'} />
      <Header title="discover a great independent shop"></Header>

      <ShopsWrapper>
        {listEdges.map(({ node }) => (
          <PostList
            key={node.UserName}
            cover={node.UniquePhotoLink}
            path={`/shop/${node.UserName}`}
            title={node.FullName}
            excerpt={node.Biography && node.Biography.substring(0, 40) + "..."}
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

export default Shops;

export const query = graphql`
  query {
    allMysqlSocialIDs {
      edges {
        node {
          Instagram
        }
      }
    }
    allMysqlDataView {
      edges {
        node {
          UserName
          FullName
          PostDate
          AlexaCountry
          AlexaURL
          UniquePhotoLink
          PostsCount
          FollowersCount
          FollowingCount
          GlobalRank
          LocalRank
          Biography
          TOS
          ProfilePicURL
          Caption
          ShortCodeURL
        }
      }
    }
  }
`;
