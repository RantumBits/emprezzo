import React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Layout, Container, Content } from 'layouts';
import { TagsBlock, Header, SEO } from 'components';
import _ from 'lodash';
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
import { useMediaQuery } from 'react-responsive'
import ReactFrappeChart from "react-frappe-charts";
import { FaInstagram, FaFacebookSquare, FaPinterestSquare, FaTwitterSquare, FaYoutube, FaRegLaugh, FaChartLine } from 'react-icons/fa';
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
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    font-size: 1rem;
  }
`;

const Subtitle = styled.h5`
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    font-size: 0.7rem;
  }
  font-family: 'Overpass Mono','Consolas','Open Sans',-apple-system,'BlinkMacSystemFont','Segoe UI','Roboto','Helvetica','Arial',sans-serif;
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

const StatisticItem = styled.div`
  margin-right: 1rem;
  text-align: center;
  line-height: 1.2rem;
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    font-size: 1rem;
    margin-right: 10px;
    padding-bottom: 5px;
  }
  h5, h6 {
    margin: 0px;
    font-size: .7em;
    font-family: 'Overpass Mono','Consolas','Open Sans',-apple-system,'BlinkMacSystemFont','Segoe UI','Roboto','Helvetica','Arial',sans-serif;
  }
`;

const StatisticIcon = styled.img`
  max-width: 25px;
  margin:5px;
`;

const ViewContainer = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  gap:10px;
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
const ViewInfo = styled.div`

`;

const TabStyle = {
  marginBottom: "0px"
}

const SocialIcons = styled.div`
  display: flex;
  a {
    margin-right: 10px;
  }
`;

const SingleItem = ({ data, pageContext }) => {
  const { next, prev } = pageContext;
  const { AlexaURL, FollowerRate, InstaFollowers, InstaFollowing, TotalFollowers, GlobalRank, LocalRank, PostRate, ProfilePicURL, TOS, UserID, UserName, activity, category, tags, FBLikes, PinFollowers, PinFollowing, TTFollowers, TTFollowing, TTLikes, TwitterFollowers, TwitterFollowing, YTSubs, name, about, signup_promos } = data.mysqlMainView;

  const rowSocialIDViewEdges = data.allMysqlSocialIdView.edges;
  const filteredSocialIDView = _.filter(rowSocialIDViewEdges, ({ node }) => node.Instagram == UserName);
  const { Facebook, Instagram, Pinterest, TikTok, Twitter, URL, YouTube } = filteredSocialIDView.length>0?filteredSocialIDView[0].node:[];

  //Creating Social IDs Data to pass to header for displaying
  let socialDetails = {
    "InstagramLink": Instagram ? "https://www.instagram.com/" + Instagram : null,
    "FacebookLink": Facebook ? "https://www.facebook.com/" + Facebook : null,
    "PinterestLink": Pinterest ? "https://www.pinterest.com/" + Pinterest : null,
    "TikTokLink": TikTok ? "https://www.tiktok.com/" + TikTok : null,
    "TwitterLink": Twitter ? "https://www.twitter.com/" + Twitter : null,
    "YouTubeLink": YouTube ? "https://www.youtube.com/c/" + YouTube : null
  }
  //console.log("+++++++++++++")
  //console.log(socialDetails)
  //console.log("+++++++++++++")

  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })
  //console.log("****** isMobile = " + isMobile)

  //converting comma seperated tags to tags map
  const tagsList = tags ? tags.split(',') : [];

  //Extracting Posts from MySQL Data
  const maxPosts = 3;
  const rowDataViewEdges = data.allMysqlDataView.edges;
  //filtering top 3 for current instagram id
  const filteredDataView = _.filter(rowDataViewEdges, ({ node }) => node.AlexaURL == AlexaURL)
  const listPostEdges = _.slice(filteredDataView, 0, maxPosts);
  const firstRowDataView = listPostEdges && listPostEdges.length ? listPostEdges[0] : null;
  //console.log("*********** firstRowDataView")
  //console.log(firstRowDataView)
  //Now filtering instagram posts if the image or caption is not present
  const listInstaPostEdges = _.filter(listPostEdges, ({ node }) => (node.PhotoLink))
  //console.log("*****++listInstaPostEdges+++********")
  //console.log(listInstaPostEdges)

  //Extracting Products from MySQL Data
  const maxProducts = 5;
  const rowShopifyViewEdges = data.allMysqlShopifyView.edges;
  //filtering top 3 for current AlexaURL
  const filteredProductView = _.filter(rowShopifyViewEdges, ({ node }) => node.AlexaURL == AlexaURL && node.Price > 20 && node.Title.toLowerCase().indexOf("gift") < 0 && node.Title.toLowerCase().indexOf("test") < 0 && node.Title.toLowerCase().indexOf("shipping") < 0)
  const listProductEdges = _.slice(filteredProductView, 0, maxProducts);
  //console.log("*****++listProductEdges+++********")
  //console.log(listProductEdges)

  const rowallMysqlShopifyProductsAllEdges = data.allMysqlShopifyProductsAll ? data.allMysqlShopifyProductsAll.edges : [];
  
  //Extracting bestseller products
  const filteredShopifyBestSellers = _.sortBy(rowallMysqlShopifyProductsAllEdges, ({node}) => node.Position)
  const listShopifyBestSellersEdges = _.slice(filteredShopifyBestSellers, 0, maxProducts);

  //Extracting classic products
  const filteredShopifyClassicProducts = _.sortBy(rowallMysqlShopifyProductsAllEdges, ({node}) => node.PublishedDate)
  const listShopifyClassicProductsEdges = _.slice(filteredShopifyClassicProducts, 0, maxProducts);

  //Extracting new products
  const filteredShopifyNewProducts = _.sortBy(rowallMysqlShopifyProductsAllEdges, ({node}) => -node.PublishedDate)
  const listShopifyNewProductsEdges = _.slice(filteredShopifyNewProducts, 0, maxProducts);

  //Generating the data for chart
  let chartRankData = null;
  let chartTOSData = null;
  let globalRank_Dates = _.split(data.mysqlMainView.GlobalRank_Dates, ',') || [];
  let globalRank_Dates_NoTime = _.map(globalRank_Dates, (el) => {
    let datetime = _.split(el.trim(), ' ')
    return (datetime && datetime.length > 0) ? datetime[0] : el;
  });

  //Rank data
  if (data.mysqlMainView.GlobalRank_List) {
    chartRankData = {
      labels: globalRank_Dates_NoTime,
      datasets: [
        {
          name: 'Rank Data',
          type: 'line',
          values: _.split(data.mysqlMainView.GlobalRank_List, ',')
        }
      ]
    };
  }
  //TOS data
  if (data.mysqlMainView.TOS_List) {
    chartTOSData = {
      labels: globalRank_Dates_NoTime,
      datasets: [
        {
          name: 'TOS Data',
          type: 'line',
          values: _.split(data.mysqlMainView.TOS_List, ',')
        }
      ]
    };
  }

  //Social chart data
  const chartSocialLabels = [];
  const chartSocialValues = [];  
  if(InstaFollowers && InstaFollowers != 0) {
    chartSocialLabels.push("Instagram")
    chartSocialValues.push(InstaFollowers)
  }
  if(FBLikes && FBLikes != 0) {
    chartSocialLabels.push("Facebook")
    chartSocialValues.push(FBLikes)
  }
  if(TwitterFollowers && TwitterFollowers != 0) {
    chartSocialLabels.push("Twitter")
    chartSocialValues.push(TwitterFollowers)
  }
  if(YTSubs && YTSubs != 0) {
    chartSocialLabels.push("Youtube")
    chartSocialValues.push(YTSubs)
  }
  if(PinFollowers && PinFollowers != 0) {
    chartSocialLabels.push("Pinterest")
    chartSocialValues.push(PinFollowers)
  }
  if(TTFollowers && TTFollowers != 0) {
    chartSocialLabels.push("TikTok")
    chartSocialValues.push(TTFollowers)
  }

  const chartSocialFollowerData = {
    labels: chartSocialLabels,
    datasets: [
      {
        name: "followers",
        values: chartSocialValues
      }
    ]
  };

  //Extracting social history
  const rowSocialHistoryEdges = data.allMysqlSocialHistory.edges;
  //filtering top 3 for current AlexaURL
  const filteredSocialHistory = _.filter(rowSocialHistoryEdges, ({ node }) => node.Instagram == UserName);
  let facebookChartData = null;
  let instagramChartData = null;
  let pinterestChartData = null;
  let tiktokChartData = null;
  let twitterChartData = null;
  let youtubeChartData = null;
  if (filteredSocialHistory && filteredSocialHistory.length>0) {
    if(filteredSocialHistory[0].node.FacebookLikesList){
      facebookChartData = {
        labels: _.split(filteredSocialHistory[0].node.FacebookCreateDates, ','),
        datasets: [
          {
            name: 'Facebook',
            type: 'line',
            values: _.split(filteredSocialHistory[0].node.FacebookLikesList, ',')
          }
        ]
      };
    }
    if(filteredSocialHistory[0].node.InstagramFollowersList){
      instagramChartData = {
        labels: _.split(filteredSocialHistory[0].node.InstagramCreateDates, ','),
        datasets: [
          {
            name: 'Instagram',
            type: 'line',
            values: _.split(filteredSocialHistory[0].node.InstagramFollowersList, ',')
          }
        ]
      };
    }
    if(filteredSocialHistory[0].node.PinterestFollowersList){
      pinterestChartData = {
        labels: _.split(filteredSocialHistory[0].node.PinterestCreateDates, ','),
        datasets: [
          {
            name: 'Pinterest',
            type: 'line',
            values: _.split(filteredSocialHistory[0].node.PinterestFollowersList, ',')
          }
        ]
      };
    }
    if(filteredSocialHistory[0].node.TiktokFollowersList){
      tiktokChartData = {
        labels: _.split(filteredSocialHistory[0].node.TiktokCreateDates, ','),
        datasets: [
          {
            name: 'Tiktok',
            type: 'line',
            values: _.split(filteredSocialHistory[0].node.TiktokFollowersList, ',')
          }
        ]
      };
    }
    if(filteredSocialHistory[0].node.TwitterFollowersList){
      twitterChartData = {
        labels: _.split(filteredSocialHistory[0].node.TwitterCreateDates, ','),
        datasets: [
          {
            name: 'Twitter',
            type: 'line',
            values: _.split(filteredSocialHistory[0].node.TwitterFollowersList, ',')
          }
        ]
      };
    }
    if(filteredSocialHistory[0].node.YoutubeSubscribersList){
      youtubeChartData = {
        labels: _.split(filteredSocialHistory[0].node.YoutubeCreateDates, ','),
        datasets: [
          {
            name: 'Youtube',
            type: 'line',
            values: _.split(filteredSocialHistory[0].node.YoutubeSubscribersList, ',')
          }
        ]
      };
    }
  }

  const rowShopifyProductSummary =  data.mysqlShopifyProductSummary || [];
  
  let subtitle = "<div>" + "</div>"
  let FreeShipText = "";

  const get100Words = (text) => {
    let calculatedText = _.join(_.split(text, ' ', 100), ' ')
    return calculatedText;
  }

  const renderProduct = (node, ismobile) => {
    return (
      <ViewCard key={node.ProductURL} style={{ padding: (ismobile && "15px") }}>
        <a href={node.ProductURL} target="_blank">
          <ViewImage>
            <div style={{ width: '100%', height: '150px' }}>
              <img src={node.ImageURL} style={{ objectFit: 'cover', height: '150px', width: '100%', margin: 'auto' }} alt={node.Title} />
            </div>
          </ViewImage>
        </a>
        <small>${node.Price}</small>
        <ViewInfo className="info">
          <a href={node.ProductURL} target="_blank">
            {node.Title && node.Title.substring(0, 50)}
          </a>
          <p style={{ color: (ismobile && "white") }}>{node.Description && node.Description.substring(0, 150)}</p>
        </ViewInfo>
      </ViewCard>
    );
  }

  const renderPost = (node, ismobile) => {
    return (
      <ViewCard key={node.PhotoLink} style={{ padding: (ismobile && "15px"), width: (!ismobile && "30%") }}>
        <a href={node.ShortCodeURL} target="_blank">
          <ViewImage >
            {node.mysqlImage &&
              <Image fluid={node.mysqlImage.childImageSharp.fluid} alt={node.Caption} style={{ height: '200px', width: '100%', margin: 'auto' }} />
            }
            {!node.mysqlImage &&
              <img src={node.PhotoLink} alt={node.Caption} style={{ objectFit: 'cover', height: '200px', width: '100%', margin: 'auto' }} />
            }
          </ViewImage>
        </a>
        <ViewInfo className="info" style={{ color: (ismobile && "white") }}>
          {node.Caption && node.Caption.substring(0, 200) + "..."}
        </ViewInfo>
      </ViewCard>
    );
  }

  return (
    <Layout>
      <SEO
        title={`Discover ${name}: Best Sellers, Coupons, & Stats `}
        description={`Find best sellers and popular products from ${name} on emprezzo. See social media growth, search popularity, and more stats online stores selling ${tagsList}. `}
        pathname={AlexaURL}
      />
      <Header title={name} children={subtitle}/>
      <Container>
        <div className="profileimage" style={{ display: "flex" }}>
          {ProfilePicURL &&
            <img src={ProfilePicURL} alt={name} className="profileimage" style={{ width: "100px", height: "100px" }} />
          }
          <div style={{ paddingLeft: "15px" }}>
            <Statistics>
              {(activity || FollowerRate || PostRate) &&
                <StatisticItem><a target="_blank" href={firstRowDataView && firstRowDataView.node.ShortCodeURL}></a></StatisticItem>
              }
              {TotalFollowers &&
                <StatisticItem>
                  {TotalFollowers.toLocaleString()}<br /><span className="stat_title">Total Fans</span>
                </StatisticItem>
              }
            </Statistics>
            <Statistics>
              {firstRowDataView && firstRowDataView.node.AlexaRankOrder &&
                <StatisticItem>{firstRowDataView.node.AlexaRankOrder} <br /><span className="stat_title" title="Emprezzo Traffic Rank">Traffic Rank</span></StatisticItem>
              }
            </Statistics>
          </div>
        </div>

        {rowShopifyProductSummary.PriceAvg && 
          <div>Average Price : ${rowShopifyProductSummary.PriceAvg.toFixed(2)}</div>
        }
        {rowShopifyProductSummary.PriceMin && rowShopifyProductSummary.PriceMax &&
          <div>Range : ${rowShopifyProductSummary.PriceMin.toFixed(2)} - ${rowShopifyProductSummary.PriceMax.toFixed(2)}</div>
        }
        
        <div style={{ margin: "2rem" }}>
          <a href={AlexaURL} className="button" target="_blank">shop {name}</a> <a href="/randomshop" className="button buttonalt">Discover another shop</a>
        </div>
        <Content input={about} /><br />
        {/* List of Products from MySQL View */}
        {listProductEdges && listProductEdges.length > 0 && <h3>shop {name}</h3>}

        {signup_promos && signup_promos.toLowerCase() != "n/a" &&
          <><Content input={signup_promos} /><br /></>
        }

        <Tabs>
          <TabList>
            {listShopifyBestSellersEdges && listShopifyBestSellersEdges.length > 0 &&
              <Tab style={TabStyle}>Best sellers</Tab>
            }
            <Tab style={TabStyle}>Classics</Tab>
            {listShopifyNewProductsEdges && listShopifyNewProductsEdges.length > 0 &&
              <Tab style={TabStyle}>New products</Tab>
            }
          </TabList>
          {listShopifyBestSellersEdges && listShopifyBestSellersEdges.length > 0 &&
            <TabPanel>
              <ViewContainer>
                {listShopifyBestSellersEdges.map(({ node }) => {
                  return renderProduct(node);
                })}
              </ViewContainer>
            </TabPanel>
          }
          <TabPanel>
            {/* Show carousel for mobile version */}
            {isMobile &&
              <Carousel
                showThumbs={false}
                infiniteLoop
                showIndicators={false}
                selectedItem={1}
                showArrows={true}
                showStatus={false}
              >
                {listShopifyClassicProductsEdges && listShopifyClassicProductsEdges.map(({ node }) => {
                  return renderProduct(node, true);
                })}
              </Carousel>
            }

            {/* Show carousel for mobile version */}
            {!isMobile &&
              <ViewContainer>
                <>
                  <span>&nbsp;</span>
                  {listShopifyClassicProductsEdges && listShopifyClassicProductsEdges.map(({ node }) => {
                    return renderProduct(node);
                  })}
                </>
              </ViewContainer>
            }
          </TabPanel>
          {listShopifyNewProductsEdges && listShopifyNewProductsEdges.length > 0 &&
            <TabPanel>
              <ViewContainer>
                {listShopifyNewProductsEdges.map(({ node }) => {
                  return renderProduct(node);
                })}
              </ViewContainer>
            </TabPanel>
          }
        </Tabs>

        {listProductEdges && listProductEdges.map(({ node }) => {
          FreeShipText = node.FreeShipText;
        })}

        {FreeShipText && FreeShipText.length > 0 && <h3>get free shipping at {name}</h3>}
        <p>{get100Words(FreeShipText)}</p>
        <br />

        {rowShopifyProductSummary &&
          <ReactFrappeChart
            type="axis-mixed"
            colors={["#743ee2"]}
            height={250}
            axisOptions={{ xAxisMode: "tick", xIsSeries: 1 }}
            data={{
              labels: _.split(rowShopifyProductSummary.DateListActive, ','),
              datasets: [
                {
                  name: 'Product Summary',
                  type: 'line',
                  values: _.split(rowShopifyProductSummary.PriceListActive, ',')
                }
              ],
              yMarkers: [{ label: "Avg Price", value: rowShopifyProductSummary.PriceAvg,
		          options: { hideLine: 1 }}],
            }}
          />
        }

        {/* Social Statistics Section */}
        <h3>{name} site traffic</h3>
        <Tabs>
          <TabList>
            <Tab style={TabStyle}>Traffic rank</Tab>
            <Tab style={TabStyle}>Time on site</Tab>
          </TabList>
          <TabPanel>
            {chartRankData &&
              <ReactFrappeChart
                type="axis-mixed"
                colors={["#743ee2"]}
                height={250}
                axisOptions={{ xAxisMode: "tick", xIsSeries: 1 }}
                data={chartRankData}
              />
            }
          </TabPanel>
          <TabPanel>
            {chartTOSData &&
              <ReactFrappeChart
                type="axis-mixed"
                colors={["#743ee2"]}
                height={250}
                axisOptions={{ xAxisMode: "tick", xIsSeries: 1 }}
                data={chartTOSData}
              />
            }
          </TabPanel>
        </Tabs>

        <h3>{name} social media stats</h3>

        {socialDetails &&
        <SocialIcons>
          {socialDetails.InstagramLink &&
            <a href={socialDetails.InstagramLink} target="_blank"><FaInstagram size="32" color="black" /></a>
          }
          {socialDetails.FacebookLink &&
            <a href={socialDetails.FacebookLink} target="_blank"><FaFacebookSquare size="32" color="black" /></a>
          }
          {socialDetails.PinterestLink &&
            <a href={socialDetails.PinterestLink} target="_blank"><FaPinterestSquare size="32" color="black" /></a>
          }
          {socialDetails.TwitterLink &&
            <a href={socialDetails.TwitterLink} target="_blank"><FaTwitterSquare size="32" color="black" /></a>
          }
          {socialDetails.YouTubeLink &&
            <a href={socialDetails.YouTubeLink} target="_blank"><FaYoutube size="32" color="black" /></a>
          }
        </SocialIcons>
      }

        {chartSocialFollowerData &&
          <ReactFrappeChart
            type="bar"
            title="Followers"
            height={250}
            axisOptions={{ xAxisMode: "tick", xIsSeries: 1, shortenYAxisNumbers: 1 }}
            barOptions={{ stacked: 0 }}
            data={chartSocialFollowerData}
          />
        }
        <Tabs>
          <TabList>
            {facebookChartData && <Tab style={TabStyle}>Facebook</Tab> }
            {instagramChartData && <Tab style={TabStyle}>Instagram</Tab> }
            {pinterestChartData && <Tab style={TabStyle}>Pinterest</Tab> }
            {tiktokChartData && <Tab style={TabStyle}>TikTok</Tab> }
            {twitterChartData && <Tab style={TabStyle}>Twitter</Tab> }
            {youtubeChartData && <Tab style={TabStyle}>Youtube</Tab> }
          </TabList>          
          {facebookChartData &&
            <TabPanel>
            <ReactFrappeChart
            type="axis-mixed"
              title="Facebook"
              height={250}
              axisOptions={{ xAxisMode: "tick", xIsSeries: 1, shortenYAxisNumbers: 1 }}
              data={facebookChartData}
            />
            </TabPanel>
          }
          {instagramChartData &&
            <TabPanel>
            <ReactFrappeChart
            type="axis-mixed"
              title="Instagram"
              height={250}
              axisOptions={{ xAxisMode: "tick", xIsSeries: 1, shortenYAxisNumbers: 1 }}
              data={instagramChartData}
            />
            </TabPanel>
          }
          {pinterestChartData &&
            <TabPanel>
            <ReactFrappeChart
            type="axis-mixed"
              title="Pinterest"
              height={250}
              axisOptions={{ xAxisMode: "tick", xIsSeries: 1, shortenYAxisNumbers: 1 }}
              data={pinterestChartData}
            />
            </TabPanel>
          }
          {tiktokChartData &&
            <TabPanel>
            <ReactFrappeChart
            type="axis-mixed"
              title="Tiktok"
              height={250}
              axisOptions={{ xAxisMode: "tick", xIsSeries: 1, shortenYAxisNumbers: 1 }}
              data={tiktokChartData}
            />
            </TabPanel>
          }
          {twitterChartData &&
            <TabPanel>
            <ReactFrappeChart
            type="axis-mixed"
              title="Twitter"
              height={250}
              axisOptions={{ xAxisMode: "tick", xIsSeries: 1, shortenYAxisNumbers: 1 }}
              data={twitterChartData}
            />
            </TabPanel>
          }
          {youtubeChartData &&
            <TabPanel>
            <ReactFrappeChart
            type="axis-mixed"
              title="Youtube"
              height={250}
              axisOptions={{ xAxisMode: "tick", xIsSeries: 1, shortenYAxisNumbers: 1 }}
              data={youtubeChartData}
            />
            </TabPanel>
          }          
        </Tabs>










        {/* List of Posts from MySQL View */}
        {listInstaPostEdges && listInstaPostEdges.length > 0 && <h3>instagram posts</h3>}
        <Content input={firstRowDataView.node.Biography} /><br />

        {/* Show carousel for mobile version */}
        {isMobile &&
          <Carousel
            showThumbs={false}
            infiniteLoop
            showIndicators={false}
            selectedItem={1}
            showArrows={true}
            showStatus={false}
          >
            {listInstaPostEdges && listInstaPostEdges.map(({ node }) => {
              return renderPost(node, true)
            })}
          </Carousel>
        }

        {/* Show carousel for mobile version */}
        {!isMobile &&
          <ViewContainer>
            {listInstaPostEdges && listInstaPostEdges.map(({ node }) => {
              return renderPost(node)
            })}
          </ViewContainer>
        }
        <br />


        <a href="/randomshop" className="button ">Discover another shop</a><br /><br />
        See more online stores for:  <TagsBlock list={tagsList || []} />
      </Container>
      <SuggestionBar>
        <PostSuggestion>

        </PostSuggestion>
        <PostSuggestion>

        </PostSuggestion>
      </SuggestionBar>
    </Layout>
  );
};

export default SingleItem;

export const query = graphql`
  query($pathSlug: String!) {
    mysqlMainView (AlexaURL: {eq: $pathSlug}) {
      AlexaURL
      FollowerRate
      GlobalRank
      LocalRank
      PostRate
      ProfilePicURL
      TOS
      UserID
      UserName
      activity
      category
      tags
      TotalFollowers
      TotalFollowing
      FBLikes
      InstaFollowers
      TwitterFollowers
      YTSubs
      PinFollowers
      TTFollowers
      name
      about
      signup_promos
      GlobalRank_Change
      GlobalRank_Dates
      GlobalRank_List
      TOS_List
    }
    allMysqlDataView  (filter: {AlexaURL: {eq: $pathSlug}}) {
      edges {
        node {
          AlexaURL
          UserName
          FullName
          Biography
          PostDate
          PhotoLink
          AlexaRankOrder
          mysqlImage {
            childImageSharp {
              fluid (srcSetBreakpoints: [200, 400]) {
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

    allMysqlShopifyView (filter: {AlexaURL: {eq: $pathSlug}}) {
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

    allMysqlShopifyProductsAll (filter: {VendorURL: {eq: $pathSlug}}) {
      edges {
        node {
          ImageURL
          MaxPrice
          Position
          Price
          ProductID
          ProductURL
          PublishedDate
          Title
          VariantID
          VariantImageURL
          VariantTitle
          VariantUpdateDate
          VendorName
          VendorURL
        }
      }
    }

    mysqlShopifyProductSummary (VendorURL: {eq: $pathSlug}) {
      CountProductsActive
      CountProductsAll
      CountVariantsActive
      CountVariantsAll
      DateListActive
      DateListInactive
      PriceAvg
      PriceListActive
      PriceListInactive
      PriceMax
      PriceMin
      VendorURL
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

  }
`;
