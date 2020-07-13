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
  const { edges } = data.allGoogleSheetListRow;
  const maxItems = 9;
  const [limit, setLimit] = React.useState(maxItems);
  const [showMore, setShowMore] = React.useState(true);

  const increaseLimit = () => {
    setLimit(limit + maxItems);
  }

  const searchIndices = [
    { name: `uncommonry`, title: `Shops`, type: `shopHit` },
  ]

  const rowDataViewEdges = data.allMysqlDataView.edges;
  const combinedEdges = [];

  //Creating a new dataset with original nodes and required columns from DataView
  edges.map((edge) => {
    const inputInstaID = edge.node.instagramname;
    //filter to only show shops with AlexaURLs in DataView
    var resultData = _.filter(rowDataViewEdges, ({ node }) => (node.UserName == inputInstaID && node.AlexaURL != null))
    var firstDataRow = null;
    if (resultData.length > 0) {
      firstDataRow = resultData[0]
      let newNode = {
        name: edge.node.name,
        slug: edge.node.slug,
        about: edge.node.about,
        instagramname: edge.node.instagramname,
        ...firstDataRow.node
      }
      combinedEdges.push(newNode);
    }
  })

  //Now sorting (desc) based on activity
  var sortedEdges = _.sortBy(combinedEdges, obj => -obj.activity)

  //Now limiting the items as per limit
  const listEdges = _.slice(sortedEdges, 0, limit)

  console.log("+++++++++++++++++++++++++++++")
  console.log(listEdges)

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
        {listEdges.map((node, index) => (
            <PostList
              key={node.index}
              path={`/shops/${node.slug}`}
              title={node.name}
              excerpt={node.about && node.about.substring(0, 40) + "..."}
              mysqldataview={rowDataViewEdges}
              instagramname={node.instagramname}
            />
        ))}
      </ShopWrapper>
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
          PostDate
          AlexaCountry
          UniquePhotoLink
          PostsCount
          FollowersCount
          FollowingCount
          GlobalRank
          LocalRank
          TOS
          ProfilePicURL
          Caption
          ShortCodeURL
          FollowerRate
          PostRate
          activity
          AlexaURL
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
