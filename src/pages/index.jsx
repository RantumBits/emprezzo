import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import { Header, PostList } from 'components';
import { Layout } from 'layouts';
import Search from 'components/search';
import _ from 'lodash';

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
  const { edges } = data.allMysqlMainView;
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
      let newNode = {
        name: edge.node.FullName,
        slug: edge.node.UserName,
        about: edge.node.Biography,
        instagramname: edge.node.UserName,
        ...edge.node
      }
      combinedEdges.push(newNode);

  })

  //Now sorting (desc) based on activity
  var sortedEdges = _.sortBy(combinedEdges, obj => -obj.activity)

  //Now limiting the items as per limit
  const listEdges = _.slice(sortedEdges, 0, limit)

  const featuredShopEdges = _.filter(edges, ({ node }) => node.tags && node.tags.indexOf("featured")>=0)
  const combinedFeatureShopEdges = [];
  //Creating a new dataset with original nodes and required columns from DataView
  featuredShopEdges.map((edge) => {
      let newNode = {
        name: edge.node.FullName,
        slug: edge.node.UserName,
        about: edge.node.Biography,
        instagramname: edge.node.UserName,
        ...edge.node
      }
      combinedFeatureShopEdges.push(newNode);
  })

  return (
    <Layout title={'emprezzo | Discover the best online shopping sites & direct-to-consumer brands'} description="Discover the best online shopping sites & direct to consumer brands." >
      <Header title="Discover the best online shopping sites"></Header>

      {/* <p className="center"><a href ="/randomshop" className="button button">Discover a  shop</a></p> */}
      <div className="center">
        🧐 Discover the best online shopping sites<br />🛒 Shop direct-to-consumer brands
      </div>
      <div className="search_main">
        <Search collapse homepage indices={searchIndices} />
      </div>

      <ShopSectionHeading>Featured Shops</ShopSectionHeading>
      <ShopWrapper>
        {combinedFeatureShopEdges.map((node, index) => (
            <PostList
              id={`post-${index}`}
              key={index}
              path={`/shops/${node.slug}`}
              title={node.name}
              excerpt={node.about && node.about.substring(0, 40) + "..."}
              mysqldataview={rowDataViewEdges}
              instagramname={node.instagramname}
            />
        ))}
      </ShopWrapper>

      <ShopSectionHeading></ShopSectionHeading>
      <ShopWrapper>
        {listEdges.map((node, index) => (
            <PostList
              id={`post-${index}`}
              key={index}
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
          <button className="button" onClick={increaseLimit}>
            Load More
          </button>
        </div>
      }
      <ShopWrapper>
      <h3>Discover the best online shopping sites at Emprezzo</h3>
      <p>There are endless options when shopping online, yet nothing seems like the right fit. Discover the best direct to consumer brands at Emprezzo.</p>

      <h3>What's the benefit of shopping direct-to-consumer brands?</h3>
      <p>Direct to consumers stores connect diretly with their customer, which helps reduce costs paid to large reatilers and makertplaces. Marketplaces typically charge sellers for marketing, fulfillment, commission, and additional fees making it hard for stores to turn a profit without increasing costs.</p>
      <h3>What are the best online shopping sites?</h3>
      <p>Our lists are comprised of stores based on data from social media data, traffic data, and our own analysis. </p>
    </ShopWrapper>
    </Layout>
  );
};

export default Index;


export const query = graphql`
  query {
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

    allMysqlMainView {
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
          FullName
          Biography
        }
      }
    }
  }
`;
