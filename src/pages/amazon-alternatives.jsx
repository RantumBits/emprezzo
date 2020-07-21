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

const AmazonAlternatives = ({ data }) => {
  const { edges } = data.allGoogleSheetListRow;
  const maxItems = 12;
  const [limit, setLimit] = React.useState(maxItems);
  const [showMore, setShowMore] = React.useState(true);

  const increaseLimit = () => {
    setLimit(limit + maxItems);
  }

  const rowDataViewEdges = data.allMysqlDataView.edges;
  const combinedEdges = [];

  //Creating a new dataset with original nodes and required columns from DataView
  edges.map((edge) => {
    const inputInstaID = edge.node.instagramname;
    //filter to show only shops with DataView . AlexaCountry = United States
    var resultData = _.filter(rowDataViewEdges, ({ node }) => (node.UserName == inputInstaID && node.AlexaCountry == "United States"))
    var firstDataRow = null;
    if (resultData.length > 0) {
      firstDataRow = resultData[0]
      let newNode = {
        name: edge.node.name,
        slug: edge.node.slug,
        ...firstDataRow.node
      }
      combinedEdges.push(newNode);
    }
  })

  //Now sorting (asc) based on LocalRank
  var sortedEdges = _.sortBy(combinedEdges, obj => obj.LocalRank)

  //Now limiting the items as per limit
  const listEdges = _.slice(sortedEdges, 0, limit)

  return (
    <Layout>
      <Helmet title={'Amazon Alternatives | Anti-Amazon Shopping Marketpace '} />
      <Header title="🧐 Discover great Amazon alternatives" subtitle=""></Header>

      <ShopsWrapper>
        <div class="intro_text">
          <h3>Browse shopping alternatives to Amazon</h3>
          <p>Independent online shops offer great alternatives to the Amazon marketplace.</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Store</th>
              <th></th>
              <th>LocalRank</th>
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
                      <img src={node.ProfilePicURL} class="profileimage" style={{ width: "50px", margin: '0px' }} title={node.name + 'is on Shopify'} alt={node.name + 'is on Shopify'} />
                    </Link>
                  }
                </td>
                <td><Link to={`/shops/${node.slug}`}>{node.name}</Link></td>
                <td>{node.LocalRank}</td>
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
          <h3>Discover the best Amazon marketplace alternatives for shoppping online</h3>
          <p>Find some of the best anti-amazon shops and avoid the hassle of looking for amazon customer service.</p><p>Search for great Amazon shopping alternatives in header or <a href="/randomshop">discover a shop</a>.</p>
        </div>
      </ShopsWrapper>
    </Layout>
  );
};

export default AmazonAlternatives;

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
  }
`;
