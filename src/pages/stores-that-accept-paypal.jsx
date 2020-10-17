import React from 'react';
import { Link, graphql } from 'gatsby';
import Image from 'gatsby-image';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Header, BlogList } from 'components';
import { Layout } from 'layouts';
import _ from 'lodash';
import { useMediaQuery } from 'react-responsive'

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

const TableWrapper = styled.div`
  width: 100%;
  height: 800px;
`;

const StickyTableWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const TableStickyHeader = styled.table`
  display: table;

  thead {
    display: table-header-group;
  }

  thead>tr {
    display: table-row;
  }

  thead>tr>th {
    position: sticky;
    display: table-cell;
    top: 0px;
    white-space: nowrap;
    z-index: 2;
    width: auto;
    background-color: white;
    @media (max-width: ${props => props.theme.breakpoints.s}) {
      padding-left: 0.2rem;
      padding-right: 0.2rem;
    }
  }

  tbody>tr>td {
    @media (max-width: ${props => props.theme.breakpoints.s}) {
      padding-left: 0.2rem;
      padding-right: 0.2rem;
    }
  }
`;


const StoresWithPaypal = ({ data }) => {
  const { edges } = data.allMysqlMainView;
  const maxItems = 12;
  const [limit, setLimit] = React.useState(maxItems);
  const [showMore, setShowMore] = React.useState(true);

  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })

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
        ...edge.node,
        ...resultRankView[0].node
      }
      combinedEdges.push(newNode);
    }
  })

  //Now sorting (desc) based on activity
  var sortedEdges = _.sortBy(combinedEdges, obj => -obj.FollowerRate)

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
        <TableWrapper>
          <StickyTableWrapper>
            <TableStickyHeader>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Store</th>
                  {!isMobile &&
                    <>
                      <th></th>
                      <th>TrafficRank</th>
                    </>
                  }
                  <th>FollowerRate</th>
                  {!isMobile &&
                    <>
                      <th>Pinterest</th>
                      <th>Instagram</th>
                      <th>Twitter</th>
                      <th>Facebook</th>
                      <th>Tiktok</th>
                      <th>Youtube</th>
                    </>
                  }
                </tr>
              </thead>
              <tbody>
                {listEdges.map((node, index) => (
                  <tr key={index} id={`post-${index}`}>
                    <td>{index + 1}</td>
                    <td>
                      {node.ProfilePicURL &&
                        <Link to={`/shops/${node.UserName}/`}>
                          <img src={node.ProfilePicURL} className="profileimage" style={{ width: "50px", margin: '0px' }} title={node.about} alt={node.about} />
                        </Link>
                      }
                    </td>
                    {!isMobile &&
                      <>
                        <td><Link to={`/shops/${node.UserName}/`} title={node.name}>{node.name}</Link></td>
                        <td>{node.GlobalRank}</td>
                      </>
                    }
                    <td>{node.FollowerRate}</td>
                    {!isMobile &&
                      <>
                        <td>{node.PinFollowers || "-"}</td>
                        <td>{node.InstaFollowers || "-"}</td>
                        <td>{node.TwitterFollowers || "-"}</td>
                        <td>{node.FBLikes || "-"}</td>
                        <td>{node.TTFollowers || "-"}</td>
                        <td>{node.YTSubs || "-"}</td>
                      </>
                    }
                  </tr>
                ))}
              </tbody>
            </TableStickyHeader>
          </StickyTableWrapper>
        </TableWrapper>

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
            InstaFollowers
            FBLikes
            PinFollowers
            TTFollowers
            TwitterFollowers
            YTSubs
            name
            about
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
