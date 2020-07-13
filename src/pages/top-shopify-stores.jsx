import React from 'react';
import { Link, graphql } from 'gatsby';
import Image from 'gatsby-image';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Header, BlogList } from 'components';
import { Layout } from 'layouts';

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

  const rowShopifyViewEdges = data.allMysqlShopifyView.edges;
  const rowDataViewEdges = data.allMysqlDataView.edges;
  const combinedEdges = [];

  //Creating a new dataset with original nodes and required columns from DataView
  edges.map((edge) => {
    const inputInstaID = edge.node.instagramname;
    //filter to show only shops present in ShopifyView
    var resultShopify = _.filter(rowShopifyViewEdges, ({ node }) => node.UserName == inputInstaID)
    if (resultShopify.length > 0) {
      //now finding corresponding data from DataView
      var resultData = _.filter(rowDataViewEdges, ({ node }) => node.UserName == inputInstaID)
      var firstDataRow = null;
      if (resultData.length > 0) {
        firstDataRow = resultData[0]
      }
      let newNode = {
        name: edge.node.name,
        slug: edge.node.slug,
        ...firstDataRow.node
      }
      combinedEdges.push(newNode);
    }
  })

  //Now sorting (desc) based on activity
  var sortedEdges = _.sortBy(combinedEdges, obj => -obj.activity)

  //Now limiting the items as per limit
  const listEdges = _.slice(sortedEdges,0,limit)

  console.log("+++++++++++++++++++++++++++++")
  console.log(listEdges)

  return (
    <Layout>
      <Helmet title={'Top Shopify Stores | Shop the most popular stores'} />
      <Header title="🧐 Discover the top Shopify stores" subtitle=""></Header>

      <ShopsWrapper>
        <div class="intro_text">
          <h3>Browse the most popular Shopify stores</h3>
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
            {listEdges.map(( node, index ) => (
              <tr key={index}>
                <td>
                  {node.ProfilePicURL &&
                    <Link to={`/shops/${node.slug}`}>
                      <img src={node.ProfilePicURL} class="profileimage" style={{ width: "50px", margin: '0px' }} title={node.name + 'is on Shopify'} alt={node.name + 'is on Shopify'} />
                    </Link>
                  }
                </td>
                <td><Link to={`/shops/${node.slug}`}>{node.name}</Link></td>
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
          <a className="button" onClick={increaseLimit} style={{ cursor: "pointer" }}>
            Load More
            </a>
        </div>
      }
      <ShopsWrapper>
        <div class="intro_text">
          <h3>Discover top Shopify stores of 2020</h3>
          <p>Find the top Shopify stores by traffic & social media activity. See some of the best Shopify store examples.</p><p>Search in header for more Shopify stores or <a href="/randomshop">discover a shop</a></p>
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
        }
      }
    }
    allMysqlShopifyView {
      edges {
        node {
          UserName
          Title
          ProductURL
          ImageURL
          Price
        }
      }
    }
  }
`;
