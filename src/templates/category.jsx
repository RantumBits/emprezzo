import React from 'react';
import { graphql } from 'gatsby';
import styled from '@emotion/styled';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header } from 'components';
import PostList from '../components/PostList';
import { Layout } from 'layouts';

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
      <Helmet title={'Shop Independent ' + categoryHeading + ' | Discover direct-to-consumer' + categoryHeading } />
      <Header title={categoryHeading}><span class="Header--Subtitle">discover exceptional independent {categoryHeading}</span></Header>

      <CategoryWrapper>
        {listEdges.map(({ node }) => (
          <PostList
              key={node.name}
              cover={node.localImageUrl && node.localImageUrl.childImageSharp.fluid}
              path={`/shops/${node.slug}`}
              title={node.name}
              excerpt={node.about && node.about.substring(0,40)+"..."}
            />
        ))}
      </CategoryWrapper>
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

export default Category;

export const query = graphql`
  query($category: String!) {
    allGoogleSheetListRow(filter: {category: {eq: $category}}) {
      edges {
        node {
          name
          slug
          url
          category
          tags
          about
          country
          state
          city
          localImageUrl {
            childImageSharp {
              fluid(
                maxWidth: 1000
                quality: 100
                traceSVG: { color: "#2B2B2F" }
              ) {
                ...GatsbyImageSharpFluid_withWebp_tracedSVG
              }
            }
          }
          imageurl
        }
      }
    }
  }
`;
