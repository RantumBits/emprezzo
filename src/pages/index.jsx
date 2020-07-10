import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import { Header, PostList } from 'components';
import { Layout } from 'layouts';
import Search from 'components/search'

const PostSectionHeading = styled.h1`
  margin-left: 4rem;
`;

const PostWrapper = styled.div`
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

const ShopSectionHeading = styled.h1`
  margin-left: 4rem;
`;

const ShopWrapper = styled.div`
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

const Index = ({ data }) => {
  const { edges } = data.allMarkdownRemark;
  const rowEdges = data.allGoogleSheetListRow.edges;
  const foodEdges = [];
  const homeEdges = [];
  const maxItems = 9;

  const searchIndices = [
    { name: `uncommonry`, title: `Shops`, type: `shopHit` },
  ]

  //filtering home and food items maximum to 6 items
  rowEdges.map((edge) => {
    if (edge.node.category && edge.node.category != "" && foodEdges.length < maxItems) {
      foodEdges.push(edge);
    }
    else if (edge.node.category && edge.node.category == " " && homeEdges.length < maxItems) {
      homeEdges.push(edge);
    }
  })

  const rowDataViewEdges = data.allMysqlDataView.edges;

  return (
    <Layout>
      <Helmet title={'emprezzo'} />
      <Header title="Discover & Shop Independent Businesses"></Header>

      {/* <p class="center"><a href ="/randomshop" class="button button">Discover a  shop</a></p> */}
      <div class="center">
        🧐 Discover direct-to-consumer stores<br />🛒 Shop & support independent businesseses
      </div>
      <div class="search_main">
        <Search collapse homepage indices={searchIndices} />

      </div>

      <ShopSectionHeading></ShopSectionHeading>

      <ShopWrapper>

        {foodEdges.map(({ node }) => {
          return (
            <PostList
              key={node.name}
              cover={node.localImageUrl && node.localImageUrl.childImageSharp.fluid}
              path={`/shops/${node.slug}`}
              title={node.name}
              excerpt={node.about && node.about.substring(0, 40) + "..."}
              mysqldataview={rowDataViewEdges}
              instagramname={node.instagramname}
            />
          );
        })}
      </ShopWrapper>


      <ShopWrapper>
        {homeEdges.map(({ node }) => {
          return (
            <PostList
              key={node.name}
              cover={node.localImageUrl && node.localImageUrl.childImageSharp.fluid}
              path={`/shops/${node.slug}`}
              title={node.name}
              excerpt={node.about.substring(0, 40) + "..."}
              mysqldataview={rowDataViewEdges}
              instagramname={node.instagramname}
            />
          );
        })}
      </ShopWrapper>





    </Layout>
  );
};

export default Index;

Index.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            excerpt: PropTypes.string,
            frontmatter: PropTypes.shape({
              cover: PropTypes.object.isRequired,
              path: PropTypes.string.isRequired,
              title: PropTypes.string.isRequired,
              date: PropTypes.string.isRequired,
              tags: PropTypes.array,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
};

export const query = graphql`
  query {
    allMarkdownRemark(
      limit: 9
      sort: { order: ASC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 75)
          frontmatter {
            title
            path
            tags
            date(formatString: "MM.DD.YYYY")
            cover {
              childImageSharp {
                fluid (srcSetBreakpoints: [200, 400]) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }

    allMysqlDataView {
      edges {
        node {
          UserName
          UniquePhotoLink
          ProfilePicURL
          Caption
          ShortCodeURL
        }
      }
    }

    allGoogleSheetListRow {
      edges {
        node {
          name
          url
          slug
          category
          tags
          about
          state
          city
          instagramname
        }
      }
    }
  }
`;
