import React from 'react';
import { Link, graphql } from 'gatsby';
import Image from 'gatsby-image';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import * as queryString from "query-string";
import { Header, BlogList } from 'components';
import { Layout } from 'layouts';
import _ from 'lodash';
import { useMediaQuery } from 'react-responsive'
import Slider from '@material-ui/core/Slider';
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

const TopShopifyStores = ({ location, data }) => {
  const { edges } = data.allMysqlMainView;
  const maxItems = 20;
  const [limit, setLimit] = React.useState(maxItems);
  const [showMore, setShowMore] = React.useState(true);
  const [showDialog, setShowDialog] = React.useState(false);
  const [dialogText, setDialogText] = React.useState();

  const [filterPaypalShopID, setFilterPaypalShopID] = React.useState(false);
  const [filterFreeShipText, setFilterFreeShipText] = React.useState(false);
  const [filterPayPalVenmoSupport, setFilterPayPalVenmoSupport] = React.useState(false);
  const [filterBuyNowPayLater, setFilterBuyNowPayLater] = React.useState(false);
  const [filterText, setFilterText] = React.useState("");

  const [sliderAvgPrice, setSliderAvgPrice] = React.useState([0, 0]);
  const [sliderPriceRange, setSliderPriceRange] = React.useState([0, 0]);

  const [sortBy, setSortBy] = React.useState("GlobalRank_Change");

  const changeSortBy = (e) => { setSortBy(e.target.value) }

  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })

  const increaseLimit = () => {
    setLimit(limit + maxItems);
  }

  React.useEffect(() => {
    //checking if tag filter is present
    if(location && location.search) {
      const { tag } = queryString.parse(location.search);
      setFilterText(tag.trim())
    }
  },[]);

  let combinedEdges = [];

  //Creating a new dataset with original nodes and required columns from PayNShip and allMysqlShopifyProductSummary
  edges.map((edge) => {
    let newNode = {
      name: edge.node.name,
      slug: edge.node.UserName,
      ...edge.node
    }
    const inputID = edge.node.AlexaURL;
    const rowDataViewEdges = data.allMysqlDataView.edges;
    var filteredDataView = _.filter(rowDataViewEdges, ({ node }) => (node.AlexaURL == inputID))
    if (filteredDataView.length > 0) {
      newNode = {
        ...newNode,
        ...filteredDataView[0].node
      }
    }
    const rowPayNShipEdges = data.allMysqlPayNShip.edges;
    var filteredPayNShip = _.filter(rowPayNShipEdges, ({ node }) => (node.URL == inputID))
    if (filteredPayNShip.length > 0) {
      newNode = {
        ...newNode,
        ...filteredPayNShip[0].node
      }
    }
    const rowShopifyProductSummaryEdges = data.allMysqlShopifyProductSummary.edges;
    var filteredShopifyProductSummary = _.filter(rowShopifyProductSummaryEdges, ({ node }) => (node.VendorURL == inputID))
    if (filteredShopifyProductSummary.length > 0) {
      newNode = {
        ...newNode,
        ...filteredShopifyProductSummary[0].node
      }
    }
    combinedEdges.push(newNode);
  })

  if (sliderAvgPrice[0] == 0 && sliderAvgPrice[0] == 0) {
    var minPriceAvg = _.minBy(combinedEdges, 'PriceAvg')
    var maxPriceAvg = _.maxBy(combinedEdges, 'PriceAvg')
    setSliderAvgPrice([minPriceAvg.PriceAvg, maxPriceAvg.PriceAvg])
  }
  combinedEdges = _.filter(combinedEdges, item => sliderAvgPrice[0] <= item.PriceAvg && item.PriceAvg <= sliderAvgPrice[1])

  if (sliderPriceRange[0] == 0 && sliderPriceRange[0] == 0 && combinedEdges.length>0) {
    var minPriceRange = _.minBy(combinedEdges, 'PriceMin')
    var maxPriceRange = _.maxBy(combinedEdges, 'PriceMax')
    setSliderPriceRange([minPriceRange.PriceMin, maxPriceRange.PriceMax])
  }
  combinedEdges = _.filter(combinedEdges, item => sliderPriceRange[0] <= item.PriceMax && item.PriceMax <= sliderPriceRange[1])

  const handerSliderAvgPriceChange = (event, newValue) => {
    setSliderAvgPrice(newValue);
  }
  const handerSliderPriceRangeChange = (event, newValue) => {
    setSliderPriceRange(newValue);
  }

  const sliderValueText = (value) => {
    return value;
  }

  //Now sorting (desc) based on TotalFollowers
  let listEdges = _.sortBy(combinedEdges, obj => sortBy == "GlobalRank" ? obj[sortBy] : -obj[sortBy])

  //Apply filters if any of them is checked
  if (filterPaypalShopID) {
    listEdges = _.filter(listEdges, item => item.PaypalShopID != null)
  }
  if (filterFreeShipText) {
    listEdges = _.filter(listEdges, item => item.FreeShipText != null && item.FreeShipText.trim().length > 0)
  }
  if (filterPayPalVenmoSupport) {
    listEdges = _.filter(listEdges, item => item.PaypalVenmoSupport != null)
  }
  if (filterBuyNowPayLater) {
    listEdges = _.filter(listEdges, item => item.AfterPay || item.Klarna || item.Affirm)
  }
  console.log("**** listEdges",filterText,listEdges)
  if (filterText && filterText.length > 0) {
    listEdges = _.filter(listEdges, item =>
      (item.name && item.name.toLowerCase().indexOf(filterText.toLowerCase()) >= 0)
      || (item.about && item.about.toLowerCase().indexOf(filterText.toLowerCase()) >= 0)
      || (item.tags && item.tags.toLowerCase().indexOf(filterText.toLowerCase()) >= 0)
      || (item.category && item.category.toLowerCase().indexOf(filterText.toLowerCase()) >= 0)
    )
  }
  console.log("**** listEdges",listEdges)

  //Now limiting the items as per limit
  listEdges = _.slice(listEdges, 0, limit)

  const openMoreDialog = (node) => {
    let dialogContent = "";
    dialogContent += "<h1>" + node.name + "</h1>";
    dialogContent += "<p>" + (node.about || "No Description Available") + "</p>";
    dialogContent += "<p>" + (node.tags || "") + "</p>";
    dialogContent += "<a href='" + node.AlexaURL + "'>Go to " + node.name + "</a><br/><br/>";
    setDialogText(dialogContent);
    setShowDialog(true);
  }

  const closeMoreDialog = () => setShowDialog(false);


  return (
    <Layout title={'Discover popular independent stores and direct to consumer brands'} description='Discover popular independent stores and direct to consumer brands. Shop the best and most popular Shopify shop on emprezzo.'>
      <Header title="Discover Great Online Shops" subtitle=""></Header>
      <Dialog isOpen={showDialog} onDismiss={closeMoreDialog}>
        <span dangerouslySetInnerHTML={{ __html: dialogText }} />
        <button onClick={closeMoreDialog}>
          Close
        </button>
      </Dialog>
      <ShopsWrapper>
        <div className="intro_text">
          <h3>Discover Great Online Shops</h3>
          <p>Discover popular independent stores and direct to consumer brands</p>
        </div>
        <div style={{ display: "flex", width: "100%" }}>
          <label>Filter Results:
            <input type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </label>
        </div>
        <div style={{ display: "flex", width: "100%" }}>
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
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
          Display by
          <select value={sortBy} onChange={changeSortBy}>
            <option value="GlobalRank">Traffic rank</option>
            <option value="GlobalRank_Change">Rank change</option>
            <option value="TotalFollowers">Total fans</option>
          </select>
        </div>
        <div style={{ width: "80%", display: "flex" }}>
          <span style={{ width: "20%" }}>Average Price : </span>
          <Slider
            value={sliderAvgPrice}
            onChange={handerSliderAvgPriceChange}
            min={0}
            max={sliderAvgPrice[1]+50}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider-avg"

          />
        </div>
        <div style={{ width: "80%", display: "flex" }}>
          <span style={{ width: "20%" }}>Price Range : </span>
          <Slider
            value={sliderPriceRange}
            onChange={handerSliderPriceRangeChange}
            min={0}
            max={sliderPriceRange[1]+50}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider-range"
          />
        </div>
        <TableWrapper>
          <StickyTableWrapper>
            <TableStickyHeader>
              <thead>
                <tr>
                  <th style={{ width: "3%" }}><strong>#</strong></th>
                  <th style={{ width: "3%" }}></th>

                  <th><strong>Store</strong></th>
                  {!isMobile &&
                    <>
                      <th style={{ width: "20%" }}></th>
                      <th><strong>TrafficRank</strong></th>
                    </>
                  }
                  <th><strong>TotalFollowers</strong></th>
                  {!isMobile &&
                    <>
                      <th><strong>Avg Price</strong></th>
                      <th><strong>Price Range</strong></th>
                      <th><strong>Rank Change</strong></th>
                    </>
                  }
                </tr>
              </thead>
              <tbody>
                {listEdges.map((node, index) => (
                  <tr key={index} id={`post-${index}`}>
                    <td>{index + 1}</td>
                    <td><a href="javascript:void(0)" onClick={() => openMoreDialog(node)}>&gt;&gt;</a></td>
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
                    <td>{node.TotalFollowers}</td>
                    {!isMobile &&
                      <>
                        <td>${(node.PriceAvg || 0).toFixed(2)}</td>
                        <td>${(node.PriceMin || 0).toFixed(2)}{" - "}${(node.PriceMax || 0).toFixed(2)}</td>
                        <td>{node.GlobalRank_Change}</td>
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
            GlobalRank
            GlobalRank_Change
            Instagram
            LocalRank
            Pinterest
            TOS
            TikTok
            Twitter
            UserName
            YouTube
            category
            tags
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
    allMysqlDataView {
      edges {
        node {
          AlexaURL
          UserName
          FullName
          Biography
          PostDate
          PhotoLink
          ProfilePicURL
          FollowerRate
          PostRate
          activity
          TotalFollowers
          TotalFollowing
          AlexaRankOrder          
          Caption
          ShortCodeURL
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
    allMysqlShopifyProductSummary {
      edges {
        node {
          DateListActive
          PriceAvg
          PriceListActive
          PriceMax
          PriceMin
          PriceAvgTop10
          VendorURL
        }
      }
    }
  }
`;
