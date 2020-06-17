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
  const { edges } = data.allGoogleSheetListRow;
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

  return (
    <Layout>
      <Helmet title={'all Shops'} />
      <Header title="discover a great independent shop"><span class="Header--Subtitle"></span></Header>

      <ShopsWrapper>
        {listEdges.map(({ node }) => (
          <PostList
              key={node.name}
              cover={node.localImageUrl && node.localImageUrl.childImageSharp.fluid}
              path={`/shops/${node.slug}`}
              title={node.name}
              excerpt={node.about && node.about.substring(0,40)+"..."}
            />
        ))}
      </ShopsWrapper>
      {showMore && listEdges.length > 0 && listEdges.length < edges.length &&
        <div className="center">
            <a className="button" onClick={increaseLimit} style={{cursor: "pointer"}}>
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
    allGoogleSheetListRow {
      edges {
        node {
          name
          url
          slug
          category
          tags
          about
          country
          state
          city
          localImageUrl {
            childImageSharp {
              fluid (srcSetBreakpoints: [200, 400]) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          imageurl
        }
      }
    }
  }
`;
