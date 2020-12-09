import React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Layout, Container, Content } from 'layouts';
import { TagsBlock, Header, SEO } from 'components';
import _ from 'lodash';
import { getRelatedShops } from '../components/RelatedShops'
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import ProductCategoryItem from '../components/ProductCategoryItem';
import AlgoliaProductList from '../components/AlgoliaProductList';
import { useMediaQuery } from 'react-responsive';
import ReactFrappeChart from 'react-frappe-charts';
import {
  FaInstagram,
  FaFacebookSquare,
  FaPinterestSquare,
  FaTwitterSquare,
  FaYoutube,
  FaRegLaugh,
  FaChartLine,
  FaAt,
  FaPaypal,
  FaAmazon,
  FaShopify,
  FaApple,
  FaTags,
  FaTruck,
  FaRegStar,
  FaBoxOpen,
  FaUndoAlt,
} from 'react-icons/fa';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import '../styles/prism';

const SuggestionBar = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  background: ${props => props.theme.colors.white.light};
  box-shadow: ${props => props.theme.shadow.suggestion};
`;
const PostSuggestion = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 3rem 0 3rem;
  @media (max-width: 600px) {
    margin-left: 1rem;
    margin-right: 1rem;
  }
`;

const Title = styled.h1`
  margin-bottom: 5px;
  font-size: 2rem;
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    font-size: 1.4rem;
  }
`;

const Subtitle = styled.p`
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    font-size: 0.8rem;
  }
font-family: 'Jost','Segoe UI','Roboto','Candal',-apple-system,'BlinkMacSystemFont','Segoe UI','Helvetica','Arial',sans-serif;
  line-height: 1.5;
  margin-top: 1rem;
  margin-bottom: 0rem;
`;

const Stat = styled.p`
  font-size: 1rem;
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    font-size: 0.7rem;
  }
  font-family: 'Overpass Mono', 'Consolas', 'Open Sans', -apple-system,
    'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
  line-height: 1.5;
  margin-top: 0rem;
  margin-bottom: 0rem;
`;

const Statistics = styled.div`
  display: flex;
  margin-bottom: 15px;
  padding: 5px;
  flex-wrap: wrap;
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    .break {
      flex-basis: 100%;
      height: 0;
    }
  }
`;

const TabStyle = {
  marginBottom: '0px',
  padding: '6px',
  'font-size': '14px',

};



const StatisticItem = styled.div`
  margin-right: 1rem;
  text-align: center;
  line-height: 1.2rem;
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    font-size: 1rem;
    margin-right: 10px;
    padding-bottom: 8px;
  }
  h5,
  h6 {
    margin: 0px;
    font-size: 0.7em;
    font-family: 'Overpass Mono', 'Consolas', 'Open Sans', -apple-system,
      'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial',
      sans-serif;
  }
`;

const StatisticIcon = styled.img`
  max-width: 25px;
  margin: 5px;
`;

const ViewContainer = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  gap: 10px;
`;
const ViewCard = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    flex: 2;
  }
`;
const ViewImage = styled.div`
  max-width: 100%;
`;
const ViewInfo = styled.div``;



const SocialIcons = styled.div`
  display: flex;
  a {
    margin-right: 10px;
  }
`;

const PostSectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 2rem;
  text-align: left;
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PostSectionImage = styled.div`
  width: 100%;
  height: 8rem;
  text-align: center;

`;

const PostSectionContent = styled.div`
  padding-top: 1rem;
`;

const CategoryWrapper = styled.div`
  display: grid;
  margin: 0 auto;
  width: 100%;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(5, 1fr);
`;

const SingleItem = ({ data, pageContext }) => {
  const { next, prev } = pageContext;
  let {
    AlexaURL,
    InstaFollowers,
    InstaFollowing,
    GlobalRank,
    LocalRank,
    TOS,
    ProfileImage,
    emprezzoID,
    UserName,
    category,
    tags,
    FBLikes,
    PinFollowers,
    PinFollowing,
    TTFollowers,
    TTFollowing,
    TTLikes,
    TwitterFollowers,
    TwitterFollowing,
    YTSubs,
    name,
    about,
    signup_promos,
    AmazonPay,
    ApplePay,
    ShopifyPay,
    PaypalShopID,
  } = data.mysqlMainView;
  if (AlexaURL.slice(-1) != '/') AlexaURL += "/";

  const allMysqlMainViewEdges = data.allMysqlMainView.edges;
  const rowallMysqlCrunchBaseViewEdges = data.allMysqlCrunchBaseView ? data.allMysqlCrunchBaseView.edges : [];
  const rowallMysqlPayNShipEdges = data.allMysqlPayNShip ? data.allMysqlPayNShip.edges : [];
  const rowSocialIDViewEdges = data.allMysqlSocialIdView.edges;
  const filteredSocialIDView = _.filter(rowSocialIDViewEdges, ({ node }) => node.Instagram == UserName);
  const { Facebook, Instagram, Pinterest, TikTok, Twitter, URL, YouTube } = filteredSocialIDView.length > 0 ? filteredSocialIDView[0].node : [];

  //Creating Social IDs Data to pass to header for displaying
  let socialDetails = {
    InstagramLink: Instagram ? 'https://www.instagram.com/' + Instagram : null,
    FacebookLink: Facebook ? 'https://www.facebook.com/' + Facebook : null,
    PinterestLink: Pinterest ? 'https://www.pinterest.com/' + Pinterest : null,
    TikTokLink: TikTok ? 'https://www.tiktok.com/' + TikTok : null,
    TwitterLink: Twitter ? 'https://www.twitter.com/' + Twitter : null,
    YouTubeLink: YouTube ? 'https://www.youtube.com/c/' + YouTube : null,
  };

  const maxVisibleItems = 10;
  const [visibleItems, setVisibleItems] = React.useState(maxVisibleItems);
  const [showMore, setShowMore] = React.useState(true);
  const increaseLimit = () => {
    setVisibleItems(visibleItems + maxVisibleItems);
  }

  const [sortBy, setSortBy] = React.useState("UpdateDate");
  const [sortOrder, setSortOrder] = React.useState("DESC");
  const changeSortBy = (e) => { setSortBy(e.target.value) }
  const changeSortOrder = (e) => { setSortOrder((sortOrder == "DESC") ? "ASC" : "DESC") }

  const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
  //console.log("****** isMobile = " + isMobile)

  const removeTimeFromDate = (datawithtime) => {
    return _.map(datawithtime, el => {
      let datetime = _.split(el.trim(), ' ');
      return datetime && datetime.length > 0 ? datetime[0] : el;
    });
  }

  //converting comma seperated tags to tags map
  const tagsList = tags ? tags.split(',') : [];

  //Extracting Posts from MySQL Data
  const maxPosts = 3;
  const rowDataViewEdges = data.allMysqlDataView.edges;
  //filtering top 3 for current instagram id
  const filteredDataView = _.filter(rowDataViewEdges, ({ node }) => node.AlexaURL == AlexaURL || node.AlexaURL == AlexaURL.substring(0, AlexaURL.length - 1));
  const listPostEdges = _.slice(filteredDataView, 0, maxPosts);
  let firstRowDataView = listPostEdges && listPostEdges.length ? listPostEdges[0] : [];
  //adding profileimage to firstrow
  var crunchBaseData = _.filter(rowallMysqlCrunchBaseViewEdges, ({ node }) => node.URL == AlexaURL || node.URL == AlexaURL.substring(0, AlexaURL.length - 1))
  var crunchBaseRow = crunchBaseData.length > 0 ? crunchBaseData[0] : [];
  //adding PayNShip data to firstrow
  var payNShipData = _.filter(rowallMysqlPayNShipEdges, ({ node }) => node.URL == AlexaURL || node.URL == AlexaURL.substring(0, AlexaURL.length - 1))
  var payNShipRow = payNShipData.length > 0 ? payNShipData[0] : [];
  firstRowDataView = {
    node: {
      ...firstRowDataView.node,
      ...crunchBaseRow.node,
      ...payNShipRow.node,
    }
  }

  //Now filtering instagram posts if the image or caption is not present
  const listInstaPostEdges = _.filter(listPostEdges, ({ node }) => node.PhotoLink);

  //Creating a new dataset with original nodes and required columns from DataView
  let combinedMainDataEdges = [];
  allMysqlMainViewEdges.map((edge) => {
    let newNode = {
      name: edge.node.name,
      slug: edge.node.UserName,
      ...edge.node
    }
    const inputID = edge.node.AlexaURL;
    var filteredDataViewEdge = _.filter(rowDataViewEdges, ({ node }) => (node.AlexaURL == inputID))
    if (filteredDataViewEdge.length > 0) {
      newNode = {
        ...newNode,
        ...filteredDataViewEdge[0].node
      }
    }
    combinedMainDataEdges.push(newNode);
  })
  const relatedShops = getRelatedShops(data.mysqlMainView, combinedMainDataEdges);
  const combinedRelatedShops = [];
  relatedShops.map(({ shop, points }) => {
    //filter for profileimage
    var crunchBaseData = _.filter(rowallMysqlCrunchBaseViewEdges, ({ node }) => node.URL == AlexaURL)
    var crunchBaseRow = crunchBaseData.length > 0 ? crunchBaseData[0] : [];
    let newNode = {
      points,
      shop: {
        ...shop,
        ...crunchBaseRow.node,
      }
    }
    combinedRelatedShops.push(newNode);
  })

  //Extracting Products from MySQL Data
  const maxProducts = 10;
  const rowShopifyViewEdges = data.allMysqlShopifyView.edges;
  //filtering top 3 for current AlexaURL
  const filteredProductView = _.filter(rowShopifyViewEdges, ({ node }) =>
    node.AlexaURL == AlexaURL &&
    node.Price > 5 &&
    node.Title.toLowerCase().indexOf('gift') < 0 &&
    node.Title.toLowerCase().indexOf('test') < 0 &&
    node.Title.toLowerCase().indexOf('shipping') < 0
  );
  const listProductEdges = _.slice(filteredProductView, 0, maxProducts);
  //console.log("*****++listProductEdges+++********")
  //console.log(listProductEdges)

  const rowallMysqlShopifyProductsAllEdges = data.allMysqlShopifyProductsAll ? data.allMysqlShopifyProductsAll.edges : [];

  //Extracting bestseller products
  const filteredShopifyBestSellers = _.sortBy(_.filter(rowallMysqlShopifyProductsAllEdges, ({ node }) => node.Position != null && node.Title.toLowerCase().indexOf("gift card") < 0 && node.Title.toLowerCase().indexOf("shipping") < 0 && node.Title.toLowerCase().indexOf("insurance") < 0), ({ node }) => node.Position);
  const listShopifyBestSellersEdges = _.slice(filteredShopifyBestSellers, 0, maxProducts);

  //Extracting classic products
  let filteredShopifyClassicProducts = _.sortBy(_.filter(rowallMysqlShopifyProductsAllEdges, ({ node }) => node.Title.toLowerCase().indexOf("gift card") < 0 && node.Title.toLowerCase().indexOf("shipping") < 0 && node.Title.toLowerCase().indexOf("insurance") < 0), ({ node }) => node.PublishedDate);
  //Now applying sorting
  if (sortBy != "UpdateDate") {
    filteredShopifyClassicProducts = _.sortBy(filteredShopifyClassicProducts, ({ node }) => sortOrder != "DESC" ? node[sortBy] : -node[sortBy])
  } else {
    filteredShopifyClassicProducts = _.sortBy(filteredShopifyClassicProducts, ({ node }) => sortOrder != "DESC" ? new Date(node[sortBy]) : -(new Date(node[sortBy])))
  }
  //Now limiting the items as per limit
  const visibleShopifyClassicProductsEdges = _.slice(filteredShopifyClassicProducts, 0, visibleItems);
  if (showMore && visibleShopifyClassicProductsEdges.length >= filteredShopifyClassicProducts.length) setShowMore(false);
  //Now checking if 'Position' and 'DiscountPct' data is present in the list, if yes then only show 'Position' and 'DiscountPct' in the sorting options
  const isPositionPresent = _.filter(visibleShopifyClassicProductsEdges, ({ node }) => node.Position != null).length > 0;

  //Extracting new products
  const filteredShopifyNewProducts = _.sortBy(_.filter(rowallMysqlShopifyProductsAllEdges, ({ node }) => node.Title.toLowerCase().indexOf("gift card") < 0 && node.Title.toLowerCase().indexOf("shipping") < 0 && node.Title.toLowerCase().indexOf("insurance") < 0), ({ node }) => -node.PublishedDate);
  const listShopifyNewProductsEdges = _.slice(filteredShopifyNewProducts, 0, maxProducts);

  //Extracting sale products
  const filteredShopifySaleProducts = _.sortBy(_.filter(rowallMysqlShopifyProductsAllEdges, ({ node }) => node.DiscountPct > 0.10 && node.DiscountPct < 1 && node.Title.toLowerCase().indexOf("gift card") < 0 && node.Title.toLowerCase().indexOf("shipping") < 0 && node.Title.toLowerCase().indexOf("insurance") < 0), ({ node }) => -node.DiscountPct);
  const listShopifySaleProducts = _.slice(filteredShopifySaleProducts, 0, maxProducts);

  //Extracting gift cards
  const filteredShopifyGiftCards = _.filter(rowallMysqlShopifyProductsAllEdges, ({ node }) => node.Title.toLowerCase().indexOf("gift card") >= 0);
  const listShopifyGiftCards = _.slice(filteredShopifyGiftCards, 0, maxProducts);

  //Generating the data for chart
  let chartRankData = null;
  let chartTOSData = null;
  let globalRank_Dates = _.split(data.mysqlMainView.GlobalRank_Dates, ',') || [];
  let globalRank_Dates_NoTime = removeTimeFromDate(globalRank_Dates)

  //Rank data
  if (data.mysqlMainView.GlobalRank_List) {
    chartRankData = {
      labels: globalRank_Dates_NoTime,
      datasets: [
        {
          name: 'alexa global rank',
          type: 'line',
          values: _.split(data.mysqlMainView.GlobalRank_List, ','),
        },
      ],
      yMarkers: [
        {
          label: 'Low rank is better',
          value: '01',
        },
      ],

    };
  }
  //TOS data
  if (data.mysqlMainView.TOS_List) {
    chartTOSData = {
      labels: globalRank_Dates_NoTime,
      datasets: [
        {
          name: 'Time on site',
          type: 'line',
          values: _.split(data.mysqlMainView.TOS_List, ','),
        },
      ],
    };
  }

  //Social chart data
  const chartSocialFollowerLabels = [];
  const chartSocialFollowerValues = [];
  if (InstaFollowers && InstaFollowers != 0) {
    chartSocialFollowerLabels.push('Instagram');
    chartSocialFollowerValues.push(InstaFollowers);
  }
  if (FBLikes && FBLikes != 0) {
    chartSocialFollowerLabels.push('Facebook');
    chartSocialFollowerValues.push(FBLikes);
  }
  if (TwitterFollowers && TwitterFollowers != 0) {
    chartSocialFollowerLabels.push('Twitter');
    chartSocialFollowerValues.push(TwitterFollowers);
  }
  if (YTSubs && YTSubs != 0) {
    chartSocialFollowerLabels.push('Youtube');
    chartSocialFollowerValues.push(YTSubs);
  }
  if (PinFollowers && PinFollowers != 0) {
    chartSocialFollowerLabels.push('Pinterest');
    chartSocialFollowerValues.push(PinFollowers);
  }
  if (TTFollowers && TTFollowers != 0) {
    chartSocialFollowerLabels.push('TikTok');
    chartSocialFollowerValues.push(TTFollowers);
  }

  const chartSocialFollowingValues = [];
  if (InstaFollowing && InstaFollowing != 0) {
    chartSocialFollowingValues.push(InstaFollowing);
  }
  if (TwitterFollowing && TwitterFollowing != 0) {
    chartSocialFollowingValues.push(TwitterFollowing);
  }
  if (PinFollowing && PinFollowing != 0) {
    chartSocialFollowingValues.push(PinFollowing);
  }
  if (TTFollowing && TTFollowing != 0) {
    chartSocialFollowingValues.push(TTFollowing);
  }

  const chartSocialData = {
    labels: chartSocialFollowerLabels,
    datasets: [
      {
        name: 'followers',
        values: chartSocialFollowerValues,
      },

    ],
  };

  //Extracting social history
  const rowSocialHistoryEdges = data.allMysqlSocialHistory.edges;
  //filtering top 3 for current AlexaURL
  const filteredSocialHistory = _.filter(
    rowSocialHistoryEdges,
    ({ node }) => node.Instagram == UserName
  );

  let allSocialChartsData = null;
  if (filteredSocialHistory && filteredSocialHistory.length > 0) {
    let socialLabels = [];
    let socialDataSet = [];
    if (filteredSocialHistory[0].node.FacebookLikesList) {
      socialLabels = _.union(socialLabels, removeTimeFromDate(_.split(filteredSocialHistory[0].node.FacebookCreateDates, ',')))
      socialDataSet.push({
        name: 'Facebook',
        type: 'line',
        values: _.split(
          filteredSocialHistory[0].node.FacebookLikesList,
          ','
        ),
      });
      allSocialChartsData = {
        labels: socialLabels,
        datasets: socialDataSet,
      };
    }

    if (filteredSocialHistory[0].node.InstagramFollowersList) {
      socialLabels = _.union(socialLabels, removeTimeFromDate(_.split(filteredSocialHistory[0].node.InstagramCreateDates, ',')))
      socialDataSet.push({
        name: 'Instagram',
        type: 'line',
        values: _.split(
          filteredSocialHistory[0].node.InstagramFollowersList,
          ','
        ),
      });
      allSocialChartsData = {
        labels: socialLabels,
        datasets: socialDataSet,
      };
    }
    if (filteredSocialHistory[0].node.PinterestFollowersList) {
      socialLabels = _.union(socialLabels, removeTimeFromDate(_.split(filteredSocialHistory[0].node.PinterestCreateDates, ',')))
      socialDataSet.push({
        name: 'Pinterest',
        type: 'line',
        values: _.split(
          filteredSocialHistory[0].node.PinterestFollowersList,
          ','
        ),
      });
      allSocialChartsData = {
        labels: socialLabels,
        datasets: socialDataSet,
      };
    }
    if (filteredSocialHistory[0].node.TiktokFollowersList) {
      socialLabels = _.union(socialLabels, removeTimeFromDate(_.split(filteredSocialHistory[0].node.TiktokCreateDates, ',')))
      socialDataSet.push({
        name: 'Tiktok',
        type: 'line',
        values: _.split(
          filteredSocialHistory[0].node.TiktokFollowersList,
          ','
        ),
      });
      allSocialChartsData = {
        labels: socialLabels,
        datasets: socialDataSet,
      };
    }
    if (filteredSocialHistory[0].node.TwitterFollowersList) {
      socialLabels = _.union(socialLabels, removeTimeFromDate(_.split(filteredSocialHistory[0].node.TwitterCreateDates, ',')))
      socialDataSet.push({
        name: 'Twitter',
        type: 'line',
        values: _.split(
          filteredSocialHistory[0].node.TwitterFollowersList,
          ','
        ),
      });
      allSocialChartsData = {
        labels: socialLabels,
        datasets: socialDataSet,
      };
    }
    if (filteredSocialHistory[0].node.YoutubeSubscribersList) {
      socialLabels = _.union(socialLabels, removeTimeFromDate(_.split(filteredSocialHistory[0].node.YoutubeCreateDates, ',')))
      socialDataSet.push({
        name: 'Youtube',
        type: 'line',
        values: _.split(
          filteredSocialHistory[0].node.YoutubeSubscribersList,
          ','
        ),
      });
      allSocialChartsData = {
        labels: socialLabels,
        datasets: socialDataSet,
      };
    }
  }

  const rowShopifyProductSummary = data.mysqlShopifyProductSummary || [];
  let productSummary_Dates = _.split(rowShopifyProductSummary.DateListActive, ',') || [];
  let productSummary_Dates_NoTime = _.map(productSummary_Dates, el => {
    let datetime = _.split(el.trim(), ' ');
    return datetime && datetime.length > 0 ? datetime[0] : el;
  });

  let subtitle = '';
  let FreeShipText = '';

  const get100Words = text => {
    let calculatedText = _.join(_.split(text, ' ', 100), ' ');
    return calculatedText;
  };

  const renderProduct = (node, key) => {
    return (
      <ProductCategoryItem
        key={key}
        cover={getProductImage(node)}
        path={`/shops/${node.UserName}/`}
        vendorname={node.VendorName}
        title={node.Title}
        price={node.Price}
        node={node}
      />
    );
  };

  const renderProductList = (edges, key) => {
    const limitedEdges = edges //_.slice(edges, 0, maxProducts)
    return (
      <>
        {/* below renderer for desktop version */}
        { !isMobile && limitedEdges && limitedEdges.length > 0 && (
          <CategoryWrapper>
            {limitedEdges.map(({ node }, index) => {
              return renderProduct(node, key + "-" + index)
            })}
          </CategoryWrapper>
        )}
        {/* below renderer for mobile version */}
        { isMobile && limitedEdges && limitedEdges.length > 0 && (
          <Carousel
            showThumbs={false}
            infiniteLoop
            showIndicators={false}
            selectedItem={1}
            showArrows={true}
            showStatus={false}
          >
            {limitedEdges.map(({ node }, index) => {
              return renderProduct(node, key + "-" + index);
            })}
          </Carousel>
        )}
      </>
    );
  }

  const renderPost = (node, ismobile) => {
    return (
      <ViewCard
        key={node.PhotoLink}
        style={{ padding: ismobile && '15px', width: !ismobile && '30%' }}
      >

        <ViewImage style={{ height: '200px' }}>
          <a href={node.ShortCodeURL} target="_blank">
            {node.mysqlImage && (
              <Image
                fluid={node.mysqlImage.childImageSharp.fluid}
                alt={node.Caption && node.Caption.substring(0, 140) + '...'}
                style={{ height: '200px', width: '100%', margin: 'auto' }}
              />
            )}
            {!node.mysqlImage && (
              <img
                src={node.PhotoLink}
                alt={node.Caption && node.Caption.substring(0, 140) + '...'}
                style={{
                  objectFit: 'cover',
                  height: '200px',
                  width: '100%',
                  margin: 'auto',
                }}
              />
            )}
          </a>
        </ViewImage>

        <ViewInfo className="info" style={{ color: ismobile && 'white' }}>
          {node.Caption && node.Caption.substring(0, 140) + '...'}
        </ViewInfo>
      </ViewCard>
    );
  };

  const defaultImageOnError = (e) => { e.target.src = "/logo/logo.png" }

  const renderProfilePicURL = (node, name) => {
    if (node.mysqlImages && node.mysqlImages.length > 0) {
      return (
        <Image fluid={node.mysqlImages[0].childImageSharp.fluid} style={{ width: '100px', height: '100px' }} title={name} alt={name} />
      );
    } else if (ProfileImage) {
      return (
        <img src={ProfileImage} className="profileimage" onError={defaultImageOnError} style={{ width: '100px', height: '100px', 'border-radius': '100%', margin: '3%' }} title={name} alt={name} />
      );
    } else if (node.ProfilePicURL) {
      return (
        <img src={node.ProfilePicURL} className="profileimage" onError={defaultImageOnError} style={{ width: '100px', height: '100px', 'border-radius': '100%', margin: '3%' }} title={name} alt={name} />
      );
    } else if (node.profile_image_url) {
      return (
        <img src={node.profile_image_url} className="profileimage" onError={defaultImageOnError} style={{ width: '100px', height: '100px', 'border-radius': '100%', margin: '3%' }} title={name} alt={name} />
      );
    } else {
      return (
        <img src={"/logo/logo.png"} className="profileimage" style={{ width: '100px', height: '100px' }} title={name} alt={name} />
      );
    }
  }

  const getProductImage = (node) => {
    let productImage = node.VariantImageURL;
    if (!productImage) productImage = node.ImageURL;
    return productImage;
  }

  console.log("*** firstRowDataView", firstRowDataView)

  return (
    <Layout>
      <SEO
        title={`Discover ${name}: Best Sellers, Social Media, & Stats `}
        description={`${name} is a ${category} brand that sells products related to ${tags} direct to consumers on its website. Prices range from ${rowShopifyProductSummary.PriceMin} - ${rowShopifyProductSummary.PriceMax} with an average price of ${rowShopifyProductSummary.PriceAvg}. See product data about ${name} at emprezzo. `}
        pathname={AlexaURL}
      />
      <Header
        description={`${category}: ${tags}`} children={subtitle} likeEnabled={{ storeName: name, storeURL: AlexaURL, storeProfileImage: (firstRowDataView && firstRowDataView.node.ProfilePicURL) }} />
      <Container>
        <div className="profileimage" style={{ display: 'flex' }}>
          {/*firstRowDataView && renderProfilePicURL(firstRowDataView.node, name)*/}
          <div style={{ paddingLeft: '5px' }}>

            <Title>{name}</Title>
            <Subtitle><b>{category}</b><br /><i>{tags}</i><br/></Subtitle>
            <Stat>{rowShopifyProductSummary.PriceMin &&
          rowShopifyProductSummary.PriceMax && (
            <small>
              ${rowShopifyProductSummary.PriceMin}-${rowShopifyProductSummary.PriceMax} (${rowShopifyProductSummary.PriceAvg} avg)</small>
          )}
</Stat>



            <Stat>PAY&nbsp; 
            {PaypalShopID && PaypalShopID != '#' &&
              <span  style={{paddingRight: "0.25rem"}}><FaPaypal size="16" color="#666" /></span>
            }
            {AmazonPay == '1' &&
              <span  style={{paddingRight: "0.25rem"}}><FaAmazon size="16" color="#666" /></span>
            }
            {ShopifyPay && ShopifyPay == '1' &&
              <span  style={{paddingRight: "0.25rem"}}><FaShopify size="16" color="#666" /></span>
            }
            {ApplePay && ApplePay == '1' &&
              <span  style={{paddingRight: "0.25rem"}}><FaApple size="16" color="#666" /></span>
            }

</Stat>


<Stat>

            {firstRowDataView &&
              <div>

                {firstRowDataView.node.FreeShipMin != null && firstRowDataView.node.FreeShipMin != 0 &&
                  <span><FaTruck size="16" color="#666" class="icon" title="free shipping info"/> Free shipping over ${firstRowDataView.node.FreeShipMin}<br /></span>
                }
                {firstRowDataView.node.FreeShipMin == 0 &&
                  <span><FaTruck size="16" color="#666" class="icon" title="free shipping on most orders"/> Most orders ship free!<br /></span>
                }
                {firstRowDataView.node.BaseShipRate > 1 &&
                  <span><FaBoxOpen size="16" color="#666" class="icon" title="shipping rates" /> Rates from ${firstRowDataView.node.BaseShipRate}<br /></span>
                }
                {firstRowDataView.node.ReturnDays != null && firstRowDataView.node.ReturnDays != "0" &&
                  <span><FaUndoAlt size="16" color="#666" /> {firstRowDataView.node.ReturnDays} day returns</span>
                }
                {firstRowDataView.node.ReturnShipFree != "." && firstRowDataView.node.ReturnShipFree == "Yes" &&
                  <span><br/><FaRegStar size="16" color="#666" /> Returns ship free!</span>
                }

              </div>
            }

</Stat>
            <br />








          </div>
        </div>





        <Tabs>
          <TabList>
            <Tab style={TabStyle}>Shop {name}</Tab>
            {/* {listShopifyBestSellersEdges &&
              listShopifyBestSellersEdges.length > 0 && (
                <Tab style={TabStyle}>Best sellers</Tab>
              )}
            {listShopifyNewProductsEdges &&
              listShopifyNewProductsEdges.length > 0 && (
                <Tab style={TabStyle}>New products</Tab>
              )}
            {listShopifySaleProducts &&
              listShopifySaleProducts.length > 0 && (
                <Tab style={TabStyle}>Sale</Tab>
              )}
            {listShopifyGiftCards &&
              listShopifyGiftCards.length > 0 && (
                <Tab style={TabStyle}>Gift Cards</Tab>
              )} */}
          </TabList>

          <TabPanel>
            <AlgoliaProductList
              defaultFilter={`emprezzoID:"${emprezzoID}"`}
              hideLeftPanel={true}
              facetsToShow={'onsale,giftcard'}
              showSearchBox={true}
              showClearFilter={false}
              enableCart={true}
              currentShop={{ name: name, link: AlexaURL }}
              noResultMessage={`Shop direct at <a href=${AlexaURL} target="_blank">${name}</a>`}
            />
          </TabPanel>

          {/* {listShopifyBestSellersEdges && listShopifyBestSellersEdges.length > 0 && (
            <TabPanel>
              {renderProductList(listShopifyBestSellersEdges, 'listShopifyBestSellersEdges')}
            </TabPanel>
          )}
          {listShopifyNewProductsEdges && listShopifyNewProductsEdges.length > 0 && (
            <TabPanel>
              {renderProductList(listShopifyNewProductsEdges, 'listShopifyNewProductsEdges')}
            </TabPanel>
          )}

          {listShopifySaleProducts && listShopifySaleProducts.length > 0 && (
            <TabPanel>
              {renderProductList(listShopifySaleProducts, 'listShopifySaleProducts')}
            </TabPanel>
          )}
          {listShopifyGiftCards &&
            listShopifyGiftCards.length > 0 && (
              <TabPanel>

                <PostSectionGrid>
                  {listShopifyGiftCards.map(({ node, index }) => {
                    return renderProduct(node, 'Giftcard-' + index);
                  })}
                </PostSectionGrid>
              </TabPanel>
            )} */}
        </Tabs>





        <br />
        {!!combinedRelatedShops.length && (
          <>
            <h3>Discover shops similar to {name}</h3>
            <PostSectionGrid>
              {combinedRelatedShops && combinedRelatedShops.map(({ shop }, index) => (
                <span key={index}>
                  <PostSectionImage>
                    <Link key={index} to={`/shops/${shop.emprezzoID}/`}>
                      <img src={shop.ProfilePicURL || shop.profile_image_url || "/logo/logo.png"} title={shop.name} alt={shop.name} onError={defaultImageOnError} style={{ height: 'inherit', 'textAlign': 'center', 'borderRadius': '100%' }} />
                    </Link>
                  </PostSectionImage>
                  <PostSectionContent>
                    <Link key={index} to={`/shops/${shop.emprezzoID}/`}>
                      {shop.name && <b>{shop.name}</b>}
                    </Link>

                  </PostSectionContent>
                </span>
              ))}
            </PostSectionGrid>
          </>
        )}
        <br />
        {listInstaPostEdges && listInstaPostEdges.length > 0 && (
          <h3>See recent posts from @{firstRowDataView.node.UserName}</h3>
        )}




        {/* Show carousel for mobile version */}
        {isMobile && (
          <Carousel
            showThumbs={false}
            infiniteLoop
            showIndicators={false}
            selectedItem={1}
            showArrows={true}
            showStatus={false}
          >
            {listInstaPostEdges &&
              listInstaPostEdges.map(({ node }) => {
                return renderPost(node, true);
              })}
          </Carousel>
        )}
        {/* Show carousel for mobile version */}
        {!isMobile && (
          <ViewContainer>
            {listInstaPostEdges &&
              listInstaPostEdges.map(({ node }) => {
                return renderPost(node);
              })}
          </ViewContainer>
        )}

        <br />


        <h3>About {name}</h3>
          <b>{name}</b> produces and sells {category} products {tags} and more. The company sells direct-to-consumer on its website.

      {rowShopifyProductSummary.PriceMin &&
            rowShopifyProductSummary.PriceMax && (
              <span>
                &nbsp;Prices range from ${rowShopifyProductSummary.PriceMin} - ${rowShopifyProductSummary.PriceMax} with an average price of ${rowShopifyProductSummary.PriceAvg}.</span>
            )}
          {socialDetails && (
            <span>
              &nbsp;The {name} brand can be found on
              {socialDetails.InstagramLink && (
                " Instagram, "
              )}
              {socialDetails.FacebookLink && (
                " Facebook, "
              )}
              {socialDetails.PinterestLink && (
                " Pinterest, "
              )}
              {socialDetails.TikTok && (
                " TikTok, "
              )}
              {socialDetails.TwitterLink && (
                " Twitter, "
              )}
              {socialDetails.YouTubeLink && (
                " Youtube, "
              )}
               and here on Emprezzo.&nbsp;
            </span>
          )}
          <br />
          <a href={AlexaURL} className="button" target="_blank">
            shop {name}
          </a>{' '}
          <a href="/randomshop" className="button buttonalt">
            Discover another shop
      </a>
      <div>
      <br/>
</div>
        <h3 style={{ 'top-margin': '1rem' }}>{name} data and charts</h3>
        <Tabs>
          <TabList>
            <Tab style={TabStyle}>Fans</Tab>
            <Tab style={TabStyle}>Growth</Tab>
            {rowShopifyProductSummary.PriceListActive && (<Tab style={TabStyle}>Prices</Tab>)}
            <Tab style={TabStyle}>Traffic</Tab>
            {chartTOSData && (<Tab style={TabStyle}>Time</Tab>)}


          </TabList>
          <TabPanel>

              <div style={{ flex: '100%' }}>

                {chartSocialData && chartSocialData.labels && chartSocialData.labels.length > 0 && (
                  <ReactFrappeChart
                    type="donut"
                    title="Total fans by platform"
                    height={300}
                    data={chartSocialData}
                  />
                )}
              </div>
                </TabPanel>
                <TabPanel>
              <div style={{ flex: '60%' }}>
                {allSocialChartsData && (
                  <ReactFrappeChart
                    type="axis-mixed"
                    colors={['#743ee2']}
                    title="Social media follower growth by platform"
                    height={250}
                    axisOptions={{
                      xAxisMode: 'tick',
                      xIsSeries: 1,
                      shortenYAxisNumbers: 1,
                    }}
                    data={allSocialChartsData}
                  />
                )}
              </div>

          </TabPanel>
          {rowShopifyProductSummary.PriceListActive && (
            <TabPanel>

              {rowShopifyProductSummary && (
                <ReactFrappeChart
                  title="Product prices by release date"
                  type="axis-mixed"
                  colors={['#743ee2']}
                  height={250}
                  axisOptions={{ xAxisMode: 'tick', xIsSeries: 1 }}
                  lineOptions={{ hideLine: 1 }}
                  tooltipOptions={{
                    formatTooltipX: d => d,
                    formatTooltipY: d => '$ ' + parseFloat(d || 0).toFixed(2),
                  }}
                  data={{
                    labels: _.split(productSummary_Dates_NoTime, ','),
                    datasets: [
                      {
                        name: 'Product prices',
                        type: 'line',
                        values: _.split(
                          rowShopifyProductSummary.PriceListActive,
                          ','
                        ),
                      },
                    ],
                    yMarkers: [
                      {
                        label: 'Avg Price',
                        value: rowShopifyProductSummary.PriceAvg,
                      },
                    ],
                  }}
                />
              )}
            </TabPanel>
          )}
          <TabPanel>
            {chartRankData && (
              <ReactFrappeChart
                title="Alexa traffic rank over time"
                type="axis-mixed"
                colors={['#743ee2']}
                height={250}
                axisOptions={{ xAxisMode: 'tick', xIsSeries: 1 }}
                lineOptions={{ spline: 1 }}
                data={chartRankData}
              />
            )}
          </TabPanel>
          <TabPanel>
            {chartTOSData && (
              <ReactFrappeChart
                type="axis-mixed"
                title="Average time spent on site"
                colors={['#743ee2']}
                height={250}
                axisOptions={{ xAxisMode: 'tick', xIsSeries: 1 }}
                lineOptions={{ spline: 1 }}
                data={chartTOSData}
                tooltipOptions={{
                  formatTooltipX: d => d,
                  formatTooltipY: d => d + " seconds",
                }}
              />
            )}
          </TabPanel>



        </Tabs>




      </Container>
      <SuggestionBar>
        <div style={{ margin: '2rem 2rem 2rem 4rem', 'max-width': '60%' }}>



        </div>

        <div style={{ float: 'right', margin: '2rem', }}>

        </div>
      </SuggestionBar>

    </Layout>
  );
};

export default SingleItem;

export const query = graphql`
  query($pathSlug: String!) {
    mysqlMainView(AlexaURL: { eq: $pathSlug }) {
      AlexaURL
      GlobalRank
      LocalRank
      TOS
      UserName
      emprezzoID
      ProfileImage
      category
      tags
      FBLikes
      InstaFollowers
      InstaFollowing
      TwitterFollowers
      TwitterFollowing
      YTSubs
      PinFollowers
      PinFollowing
      TTFollowers
      TTFollowing
      id
      name
      about
      signup_promos
      GlobalRank_Change
      GlobalRank_Dates
      GlobalRank_List
      TOS_List
      AmazonPay
      ApplePay
      ShopifyPay
      PaypalShopID
      emprezzoID
    }
    allMysqlMainView {
      edges {
        node {
          id
          AmazonPay
          ApplePay
          ShopifyPay
          AlexaURL
          UserName
          category
          tags
          name
          about
          url
          Description
          FreeShipMin
          BaseShipRate
          ReturnDays
          ReturnShipFree
          PriceMin
          PriceMax
          PriceAvg
          CountProducts
          ProfilePicURL
          ProfileImage
          CreateDate
          emprezzoID
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
          mysqlImage {
            childImageSharp {
              fluid(srcSetBreakpoints: [200, 400]) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          Caption
          ShortCodeURL
        }
      }
    }

    allMysqlSocialHistory {
      edges {
        node {
          Facebook
          FacebookCreateDates
          FacebookLikesList
          Instagram
          InstagramCreateDates
          InstagramFollowersList
          Pinterest
          PinterestCreateDates
          PinterestFollowersList
          Tiktok
          TiktokCreateDates
          TiktokFollowersList
          TwitterCreateDates
          TwitterFollowersList
          TwitterUsername
          URL
          Youtube
          YoutubeCreateDates
          YoutubeSubscribersList
        }
      }
    }

    allMysqlShopifyView(filter: { AlexaURL: { eq: $pathSlug } }) {
      edges {
        node {
          AlexaURL
          UserName
          Title
          ProductURL
          Description
          ImageURL
          Price
          FreeShipText
        }
      }
    }

    allMysqlShopifyProductsAll(filter: { VendorURL: { eq: $pathSlug } }) {
      edges {
        node {
          DiscountAmt
          emprezzoID
          Description
          productDesc
          DiscountPct
          HasVariants
          ImageURL
          MaxPrice
          Position
          Price
          ProductID
          ProductURL
          Title
          UniqueKey
          VariantID
          VariantImageURL
          VariantTitle
          VariantUpdateDate
          VendorName
          VendorURL
          GlobalRankOrder
          SocialRankScore
          PublishedDate
          UpdateDate
          UserName
          tags
          category
          FreeShipMin
          BaseShipRate
          ReturnDays
          ReturnShipFree
          ProfilePicURL

        }
      }
    }

    mysqlShopifyProductSummary(VendorURL: { eq: $pathSlug }) {
      DateListActive
      PriceAvg
      PriceListActive
      PriceMax
      PriceMin
      VendorURL
      TitleList
    }

    allMysqlSocialIdView {
      edges {
        node {
          Instagram
          Facebook
          Pinterest
          TikTok
          Twitter
          URL
          YouTube
        }
      }
    }

    allMysqlCrunchBaseView {
      edges {
        node {
          URL
          profile_image_url
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
            FreeShipMin
            BaseShipRate
            ReturnDays
            ReturnShipFree
            ReturnCondition
            ReturnNotes
        }
      }
    }
  }
`;
