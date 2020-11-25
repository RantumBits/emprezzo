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
import AlgoliaProductList from '../components/AlgoliaProductList';
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
  const [categoryFilter, setCategoryFilter] = React.useState("");

  const changeSortBy = (e) => { setSortBy(e.target.value) }

  const changeCategoryFilter = (e) => { setCategoryFilter(e.target.value) }

  const allCategories = _.orderBy(_.uniq(Object.values(_.mapValues(edges, ({ node }) => node.category))))

  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })

  const increaseLimit = () => {
    setLimit(limit + maxItems);
  }

  React.useEffect(() => {
    //checking if tag filter is present
    if (location && location.search) {
      const { tag } = queryString.parse(location.search);
      setFilterText(tag.trim())
    }
  }, []);

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

  if (sliderAvgPrice[0] == 0 && sliderAvgPrice[1] == 0) {
    var minPriceAvg = _.minBy(combinedEdges, 'PriceAvg')
    var maxPriceAvg = _.maxBy(combinedEdges, 'PriceAvg')
    if (minPriceAvg && maxPriceAvg) { setSliderAvgPrice([minPriceAvg.PriceAvg, maxPriceAvg.PriceAvg]) }
  }
  combinedEdges = _.filter(combinedEdges, item => sliderAvgPrice[0] <= item.PriceAvg && item.PriceAvg <= sliderAvgPrice[1])

  if (sliderPriceRange[0] == 0 && sliderPriceRange[1] == 0 && combinedEdges.length > 0) {
    var minPriceRange = _.minBy(combinedEdges, 'PriceMin')
    var maxPriceRange = _.maxBy(combinedEdges, 'PriceMax')
    if (minPriceRange && maxPriceRange) { setSliderPriceRange([minPriceRange.PriceMin, maxPriceRange.PriceMax]) }
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

  //applying category filter
  if(categoryFilter.length>0) {
    listEdges = _.filter(listEdges, item => item.category == categoryFilter)
  }

  if (filterText && filterText.length > 0) {
    listEdges = _.filter(listEdges, item =>
      (item.name && item.name.toLowerCase().indexOf(filterText.toLowerCase()) >= 0)
      || (item.about && item.about.toLowerCase().indexOf(filterText.toLowerCase()) >= 0)
      || (item.tags && item.tags.toLowerCase().indexOf(filterText.toLowerCase()) >= 0)
      || (item.category && item.category.toLowerCase().indexOf(filterText.toLowerCase()) >= 0)
    )
  }

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

  const defaultImageOnError = (e) => { e.target.src = "https://source.unsplash.com/100x100/?abstract," + (Math.random() * 1000) }

  const renderProfilePicURL = (node) => {
    if (node.mysqlImages && node.mysqlImages.length > 0) {
      return (
        <Image fluid={node.mysqlImages[0].childImageSharp.fluid} style={{ width: "50px", margin: '0px' }} title={node.about} alt={node.about} />
      );
    } else if (node.ProfilePicURL) {
      return (
        <img src={node.ProfilePicURL} className="profileimage" onError={defaultImageOnError} style={{ width: "50px", margin: '0px' }} title={node.about} alt={node.about} />
      );
    } else {
      return (
        <img src={"https://source.unsplash.com/100x100/?abstract," + (Math.random() * 1000)} className="profileimage" style={{ width: "50px", margin: '0px' }} title={node.about} alt={node.about} />
      );
    }
  }

  return (
    <Layout title={'Discover great independent online stores'} description='Discover great independent online stores. Search hundreds of independent shops and direct-to-consumer brands. Filter by average price, free shipping, and more.'>
      <Header title="Discover great independent online stores" subtitle="Search hundreds of independent shops and direct-to-consumer brands "></Header>
      <ShopsWrapper>
          <AlgoliaProductList
            facetsToShow={'category,pricerangeslider,brands,storeoffers'}
            showSearchBox={true}
            showClearFilter={true}
            searchIndexName={`uncommonry`}
          />
        </ShopsWrapper>
    
      <ShopsWrapper>

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
          mysqlImages {
            childImageSharp {
              fluid(srcSetBreakpoints: [200, 400]) {
                ...GatsbyImageSharpFluid
              }
            }
          }
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
