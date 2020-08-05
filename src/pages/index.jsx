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

  return (
    <Layout title={'emprezzo | Discover & Shop Independent Online Stores'} description="Discover great independent online stores. Shop directly and support great businesses. Find apparel, toys, food, and more on emprezzo." >
      <Header title="Discover & Shop Independent Online Stores"></Header>

      {/* <p className="center"><a href ="/randomshop" className="button button">Discover a  shop</a></p> */}
      <div className="center">
        🧐 Discover direct-to-consumer stores<br />🛒 Shop & support independent businesseses
      </div>
      <div className="search_main">
        <Search collapse homepage indices={searchIndices} />
      </div>

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
      <h3>Why shop directly from independent online stores?</h3>
      <p>There are a number of reasons to shop directly, rather than making all purchases from large marketplaces or major retailers. There's a huge diversity of merchants and consumers online. What makes a product unique and exceptional is often lost when the brand is taken over by a large company.</p>
      <p>Independent stores are free to run their shops in the best ways to connect with their customers. Rather than being restricted to the rules of a marketplace or vendor, stores are able to act in ways that best support their audience.</p>
      <h3>What's the benefit for online stores></h3>
      <p>Online stores benefit by connecting diretly with their customers and cutting out the fees paid to large markeplaces. Marketplaces typically charge sellers for marketing, fulfillment, commission, and additional fees making it hard for stores to turn a profit without increasing costs.</p>
      <h3>How do consumers benefit></h3>
      <p>By shopping directly with stores, customers know more of the money goes directly to the company, which in turn helps propel the company to stick around and create more great products. Many of the best brands aren't availalbe on major marketplace sites.</p>
      <p>Brands often have exclusive offers, specialty products, and extra giveaways for customers that choose to shop directly.</p>
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
