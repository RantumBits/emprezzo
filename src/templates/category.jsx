import React from 'react';
import { graphql } from 'gatsby';
import styled from '@emotion/styled';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header } from 'components';
import PostList from '../components/PostList';
import { Layout } from 'layouts';
import _ from 'lodash';

const CategoryHeading = styled.h1`
  margin-left: 4rem;
`;

const CategoryWrapper = styled.div`
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

const Category = ({ data, pageContext }) => {
  const { category } = pageContext;
  const categoryHeading = category + " Shops";
  const { edges } = data.allMysqlMainView;
  const listEdges = [];
  const maxItems = 12;
  const [limit, setLimit] = React.useState(maxItems);
  const [showMore, setShowMore] = React.useState(true);

  const increaseLimit = () => {
      setLimit(limit + maxItems);
  }

  //filtering items as per limit
  edges.map((edge) => {
    if (listEdges.length < limit) {
      listEdges.push(edge);
    }
  })

  const rowDataViewEdges = data.allMysqlDataView.edges;

  const getDetailsFromDataView = (AlexaURL) => {
    const filteredDataView = _.filter(rowDataViewEdges, ({ node }) => node.AlexaURL == AlexaURL)
    const firstRowDataView = filteredDataView && filteredDataView.length ? filteredDataView[0] : null;
    return firstRowDataView
  }

  const getFullNameFromDataView = (AlexaURL) => {
    const firstRowDataView = getDetailsFromDataView(AlexaURL)
    return firstRowDataView && firstRowDataView.node.FullName;
  }

  const getBiographyFromDataView = (AlexaURL) => {
    const firstRowDataView = getDetailsFromDataView(AlexaURL)
    return firstRowDataView && firstRowDataView.node.Biography;
  }

  return (
    <Layout title={'Shop Independent ' + categoryHeading + ' | Discover direct-to-consumer' + categoryHeading } >
      <Header title={categoryHeading} subtitle={`discover exceptional independent ${categoryHeading}`} />

      <CategoryWrapper>
        {listEdges.map(({ node }) => (
          <PostList
              key={getFullNameFromDataView(node.AlexaURL,"FullName")}
              path={`/shops/${node.UserName}`}
              title={getFullNameFromDataView(node.AlexaURL,"FullName")}
              excerpt={getBiographyFromDataView(node.AlexaURL,"Biography") && getBiographyFromDataView(node.AlexaURL,"Biography").substring(0,40)+"..."}
              mysqldataview={rowDataViewEdges}
              instagramname={node.UserName}
            />
        ))}
      </CategoryWrapper>
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

export default Category;

export const query = graphql`
  query($category: String!) {
    allMysqlDataView {
      edges {
        node {
          UserName
          PhotoLink
          ProfilePicURL
          Caption
          ShortCodeURL
          AlexaURL
          FullName
          Biography
        }
      }
    }
    allMysqlMainView(filter: {category: {eq: $category}}) {
      edges {
        node {
          AlexaURL
          Facebook
          FollowerRate
          GlobalRank
          Instagram
          LocalRank
          Pinterest
          PostRate
          ProfilePicURL
          TOS
          TikTok
          Twitter
          UserID
          UserName
          YouTube
          activity
          category
          tags
        }
      }
    }
  }
`;
