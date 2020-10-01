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
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

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

const TopShopifyStores = ({ data }) => {
  const { edges } = data.allMysqlMainView;
  const maxItems = 12;
  const [limit, setLimit] = React.useState(maxItems);
  const [showMore, setShowMore] = React.useState(true);
  const [showDialog, setShowDialog] = React.useState(false);
  const [dialogText, setDialogText] = React.useState();

  const [filterPaypalShopID, setFilterPaypalShopID] = React.useState(false);
  const [filterFreeShipText, setFilterFreeShipText] = React.useState(false);
  const [filterPayPalVenmoSupport, setFilterPayPalVenmoSupport] = React.useState(false);
  const [filterBuyNowPayLater, setFilterBuyNowPayLater] = React.useState(false);

  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })

  const increaseLimit = () => {
    setLimit(limit + maxItems);
  }

  const combinedEdges = [];

  //Creating a new dataset with original nodes and required columns from PayNShip
  edges.map((edge) => {
    const inputID = edge.node.AlexaURL;
    const rowPayNShipEdges = data.allMysqlPayNShip.edges;
    var resultData = _.filter(rowPayNShipEdges, ({ node }) => (node.URL == inputID))
    var firstDataRow = null;
    if (resultData.length > 0) {
      firstDataRow = resultData[0]
      let newNode = {
        name: edge.node.name,
        slug: edge.node.UserName,
        ...edge.node,
        ...firstDataRow.node
      }
      combinedEdges.push(newNode);
    }
  })

  //Now sorting (desc) based on TotalFollowers
  var sortedEdges = _.sortBy(combinedEdges, obj => -obj.TotalFollowers)

  //Now limiting the items as per limit
  let listEdges = _.slice(sortedEdges, 0, limit)
  
  //Apply filters if any of them is checked
  if (filterPaypalShopID) {
    listEdges = _.filter(listEdges, item => item.PaypalShopID != null)
  }
  if (filterFreeShipText) {
    listEdges = _.filter(listEdges, item => item.FreeShipText != null && item.FreeShipText.trim().length > 0)
  }
  if (filterPayPalVenmoSupport) {
    listEdges = _.filter(listEdges, item => item.PayPalVenmoSupport != null)
  }
  if (filterBuyNowPayLater) {
    listEdges = _.filter(listEdges, item => item.AfterPay == 1 || item.Klarna == 1 || item.Affirm == 1)
  }

  const openMoreDialog = (text) => {
    setDialogText(text || "No Description Available");
    setShowDialog(true);
    //alert(text)
  }

  const closeMoreDialog = () => setShowDialog(false);


  return (
    <Layout title={'Top Shopify Stores | Shop the most popular stores'} description='Discover top Shopify stores. Shop the best and most popular Shopify shop on emprezzo.'>
      <Header title="🧐 Discover top Shopify stores" subtitle=""></Header>
      <Dialog isOpen={showDialog} onDismiss={closeMoreDialog}>
        <p>{dialogText}</p>
        <button onClick={closeMoreDialog}>
          Close
        </button>
      </Dialog>
      <ShopsWrapper>
        <div className="intro_text">
          <h3>Browse top Shopify stores</h3>
          <p>Discover top Shopify sellers based upon organic search traffic and social media activity.</p>
        </div>
        <div style={{ display: "flex" }}>
          <label>
            <input type="checkbox" style={{ margin: "0.5rem" }}
              checked={filterPaypalShopID}
              onChange={() => setFilterPaypalShopID(!filterPaypalShopID)}
            />
          PayPal
        </label>
          <label>
            <input type="checkbox" style={{ margin: "0.5rem" }}
              checked={filterFreeShipText}
              onChange={() => setFilterFreeShipText(!filterFreeShipText)}
            />
          Free Shipping
        </label>
          <label>
            <input type="checkbox" style={{ margin: "0.5rem" }}
              checked={filterPayPalVenmoSupport}
              onChange={() => setFilterPayPalVenmoSupport(!filterPayPalVenmoSupport)}
            />
          Venmo
        </label>
          <label>
            <input type="checkbox" style={{ margin: "0.5rem" }}
              checked={filterBuyNowPayLater}
              onChange={() => setFilterBuyNowPayLater(!filterBuyNowPayLater)}
            />
          Buy now, pay later
        </label>
        </div>
        <TableWrapper>
          <StickyTableWrapper>
            <TableStickyHeader>
              <thead>
                <tr>
                  <th>#</th>
                  <th></th>

                  <th>Store</th>
                  {!isMobile &&
                    <>
                      <th></th>
                      <th>TrafficRank</th>
                    </>
                  }
                  <th>TotalFollowers</th>
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
                    <td><a href="javascript:void(0)" onClick={() => openMoreDialog(node.about)}>&gt;&gt;</a></td>
                    <td>
                      {node.ProfilePicURL &&
                        <Link to={`/shops/${node.UserName}`}>
                          <img src={node.ProfilePicURL} className="profileimage" style={{ width: "50px", margin: '0px' }} title={node.about} alt={node.about} />
                        </Link>
                      }
                    </td>
                    {!isMobile &&
                      <>
                        <td><Link to={`/shops/${node.UserName}`} title={node.name}>{node.name}</Link></td>
                        <td>{node.GlobalRank}</td>
                      </>
                    }
                    <td>{node.TotalFollowers}</td>
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

      </ShopsWrapper >
      { showMore && listEdges.length > 0 && listEdges.length < edges.length &&
        <div className="center">
          <button className="button" onClick={increaseLimit}>
            Load More
          </button>
        </div>
      }
      <ShopsWrapper>
        <div className="intro_text">
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
    </Layout >
  );
};

export default TopShopifyStores;

export const query = graphql`
  query {
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
            InstaFollowers
            FBLikes
            PinFollowers
            TTFollowers
            TwitterFollowers
            TotalFollowers
            YTSubs
            name
            about
        }
      }
    }
    allMysqlPayNShip {
      edges {
        node {
            URL
            Shipping
            PaypalShopID
            PaypalCurrency
            PaypalVenmoSupport
            AfterPay
            Klarna
            Affirm
            FreeShipText
        }
      }
    }
  }
`;
