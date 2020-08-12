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

const StoresWithPaypal = ({ data }) => {
  const { edges } = data.allMysqlMainView;
  const maxItems = 12;
  const [limit, setLimit] = React.useState(maxItems);
  const [showMore, setShowMore] = React.useState(true);

  const increaseLimit = () => {
    setLimit(limit + maxItems);
  }

  const rowRankViewEdges = data.allMysqlRankViewPaypal.edges;
  const combinedEdges = [];

  //Creating a new dataset with original nodes and required columns from DataView
  edges.map((edge) => {
    const inputID = edge.node.AlexaURL;
    var resultRankView = _.filter(rowRankViewEdges, ({ node }) => node.AlexaURL == inputID)
    if (resultRankView.length > 0) {
        //now finding corresponding data from RankView
        let newNode = {
            name: edge.node.FullName,
            slug: edge.node.UserName,
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
    <Layout title={'Stores that accept PayPal | Shop sites that accept PayPal'} description='Stores that accept PayPal make it easy to checkout when shopping. Venmo and Paypal users can checkout quickly on sites that accept PayPal.'>
      <Header title="🧐 Discover top Shopify stores" subtitle=""></Header>

      <ShopsWrapper>
        <div className="intro_text">
          <h3>Stores that accept PayPal</h3>
          <p>Stores that accept PayPal make it easy to checkout</p>
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
                      <img src={node.ProfilePicURL} className="profileimage" style={{ width: "50px", margin: '0px' }} title={node.name + ' is on Shopify'} alt={node.name + ' is on Shopify'} />
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
        <div className="intro_text">
          <h3>Discover stores that accept PayPal on Emprezzo</h3>
          <p>Find stores that accept PayPal by traffic & social media activity. See some of the best PayPal stores.</p>
          <h3>How is the list of stores that accept PayPal ranked?</h3>
          <p>The stores are ranked based upon their SocialScore and overall web rank. The social score is derived from factors such as followers, fans, and activity on social media accounts. Web rank is based upon the websites estimated search engine ranking, as well as average time on site by visitors.</p>
          
        </div>
      </ShopsWrapper>
    </Layout>
  );
};

export default StoresWithPaypal;

export const query = graphql`
  query {
    allMysqlMainView {
      edges {
        node {
            AlexaURL
            UserName
            FullName
        }
      }
    }
    allMysqlRankViewPaypal {
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
