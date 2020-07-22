import React from 'react';
import { Link, graphql } from 'gatsby';
import Image from 'gatsby-image';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Header, BlogList } from 'components';
import { Layout } from 'layouts';
import _ from 'lodash';

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

const TopShopifyStores = ({ data }) => {
  const { edges } = data.allGoogleSheetListRow;
  const maxItems = 12;
  const [limit, setLimit] = React.useState(maxItems);
  const [showMore, setShowMore] = React.useState(true);

  const increaseLimit = () => {
    setLimit(limit + maxItems);
  }

  const rowRankViewEdges = data.allMysqlRankView.edges;
  const combinedEdges = [];

  //Creating a new dataset with original nodes and required columns from DataView
  edges.map((edge) => {
    const inputInstaID = edge.node.instagramname;
    var resultRankView = _.filter(rowRankViewEdges, ({ node }) => node.UserName == inputInstaID)
    if (resultRankView.length > 0) {
      //now finding corresponding data from RankView
      let newNode = {
        name: edge.node.name,
        slug: edge.node.slug,
        about: edge.node.about,
        ...resultRankView[0].node
      }
      combinedEdges.push(newNode);
    }
  })

  //Now sorting (desc) based on activity
  var sortedEdges = _.sortBy(combinedEdges, obj => -obj.activity)

  //Now limiting the items as per limit
  const listEdges = _.slice(sortedEdges, 0, limit)

  return (
    <Layout>
      <Helmet title={'Top Shopify Stores | Shop the most popular stores'} description='Discover top Shopify stores. Shop the best and most popular Shopify shop on emprezzo.'/>
      <Header title="🧐 Discover top Shopify stores" subtitle=""></Header>

      <ShopsWrapper>
        <div class="intro_text">
          <h3>Browse top Shopify stores</h3>
          <p>Discover top Shopify sellers based upon organic search traffic and social media activity.</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Store</th>

              <th></th>
              <th>GlobalRank</th>
              <th>TOS</th>
              <th>FollowerRate</th>
              <th>PostRate</th>
              <th>Activity</th>
            </tr>
          </thead>
          <tbody>
            {listEdges.map((node, index) => (
              <tr key={index} id={`post-${index}`}>
                <td>
                  {node.ProfilePicURL &&
                    <Link to={`/shops/${node.slug}`}>
                      <img src={node.ProfilePicURL} class="profileimage" style={{ width: "50px", margin: '0px' }} title={node.name + ' is on Shopify'} alt={node.name + ' is on Shopify'} />
                    </Link>
                  }
                </td>
                <td><Link to={`/shops/${node.slug}`} title={node.about}>{node.name}</Link></td>

                <td>{node.GlobalRank}</td>
                <td>{node.TOS}</td>
                <td>{node.FollowerRate}</td>
                <td>{node.PostRate}</td>
                <td>{node.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </ShopsWrapper>
      {showMore && listEdges.length > 0 && listEdges.length < edges.length &&
        <div className="center">
          <button className="button" onClick={increaseLimit}>
            Load More
          </button>
        </div>
      }
      <ShopsWrapper>
        <div class="intro_text">
          <h3>Discover top Shopify stores of 2020</h3>
          <p>Find the top Shopify stores by traffic & social media activity. See some of the best Shopify store examples.</p><p>Search in header for more Shopify stores or <a href="/randomshop">discover a shop</a></p>
          <h3>How is the list of top Shopify stores ranked?</h3>
          <p>The stores are ranked based upon their SocialScore and overall web rank. The social score is derived from factors such as followers, fans, and activity on social media accounts. Web rank is based upon the websites estimated search engine ranking, as well as average time on site by visitors.</p>
          <h3>What are some great Shopify stores examples? </h3>
          <p>This list is an excellent resource for seeing examples of Shopify stores. These are some of the most popular Shopify stores and are great for getting ideas for your own store.</p>
          <h3>What are Shopify stores?</h3>
          <p>Shpoify stores are online stores running on the Shopify ecommece platorm. They are typically indpendent businesses selling directly to customers. The sites are hosted by Shopify, which generally handles the payment as well, making Shopify sites safe and secure.</p>
          <h3>How many Shopify stores are there?</h3>
          <p>As of July 2020, there are approximately 1,422,815 live Shopify sites. 3.6% of the top 1M sites are powerd by Shopify. 5.29% of the top 10k sites are powered by Shopify. </p>
        </div>
      </ShopsWrapper>
    </Layout>
  );
};

export default TopShopifyStores;

export const query = graphql`
  query {
    allGoogleSheetListRow {
      edges {
        node {
          name
          url
          slug
          about
          instagramname
        }
      }
    }
    allMysqlRankView {
      edges {
        node {
          UserName
          AlexaURL
          GlobalRank
          LocalRank
          TOS
          ProfilePicURL
          FollowerRate
          PostRate
          activity
        }
      }
    }
  }
`;
