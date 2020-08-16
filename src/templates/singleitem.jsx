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
import { FaInstagram, FaFacebookSquare, FaPinterestSquare, FaTwitterSquare, FaYoutube } from 'react-icons/fa';

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
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    display: block;
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

const SingleItem = ({ data, pageContext }) => {
  const { next, prev } = pageContext;
  const { AlexaURL, Facebook, FollowerRate, GlobalRank, Instagram, LocalRank, Pinterest, PostRate, ProfilePicURL, TOS, TikTok, Twitter, UserID, UserName, YouTube, activity, category, tags, FullName, Biography, FBLikes, PinFollowers, PinFollowing, TTFollowers, TTFollowing, TTLikes, TwitterFollowers, TwitterFollowing, YTSubs, name, about, promos } = data.mysqlMainView;

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
  const listInstaPostEdges = _.filter(listPostEdges, ({ node }) => (node.UniquePhotoLink))
  //console.log("*****++listInstaPostEdges+++********")
  //console.log(listInstaPostEdges)

  //Extracting Products from MySQL Data
  const maxProducts = 5;
  const rowShopifyViewEdges = data.allMysqlShopifyView.edges;
  //filtering top 3 for current AlexaURL
  const filteredProductView = _.filter(rowShopifyViewEdges, ({ node }) => node.AlexaURL == AlexaURL)
  const listProductEdges = _.slice(filteredProductView, 0, maxProducts);
  //console.log("*****++listProductEdges+++********")
  //console.log(listProductEdges)

  const socialDetails = {
    "InstagramLink": Instagram ? "https://www.instagram.com/" + Instagram : null,
    "FacebookLink": Facebook ? "https://www.facebook.com/" + Facebook : null,
    "PinterestLink": Pinterest ? "https://www.pinterest.com/" + Pinterest : null,
    "TikTokLink": TikTok ? "https://www.tiktok.com/" + TikTok : null,
    "TwitterLink": Twitter ? "https://www.twitter.com/" + Twitter : null,
    "YouTubeLink": YouTube ? "https://www.youtube.com/c/" + YouTube : null
  }

  let subtitle = "<div>" + ((firstRowDataView && firstRowDataView.node.AlexaCountry) || "") + "</div>"
  let FreeShipText = "";

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
      <ViewCard key={node.UniquePhotoLink} style={{ padding: (ismobile && "15px"), width: (!ismobile && "30%") }}>
        <a href={node.ShortCodeURL} target="_blank">
          <ViewImage >
            {node.mysqlImage &&
              <Image fluid={node.mysqlImage.childImageSharp.fluid} alt={node.Caption} style={{ height: '200px', width: '100%', margin: 'auto' }} />
            }
            {!node.mysqlImage &&
              <img src={node.UniquePhotoLink} alt={node.Caption} style={{ objectFit: 'cover', height: '200px', width: '100%', margin: 'auto' }} />
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
        title={`Find ${name} | ${category || ''} `}
        description={`Find ${name} and discover great ${category || ''} online stores on emprezzo. ${about}`}
        pathname={AlexaURL}
      />
      <Header title={name} children={subtitle} socialDetails={socialDetails} />
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
              {activity &&
                <StatisticItem>{(activity + FollowerRate + PostRate).toFixed(1)} <br /><span className="stat_title" title="Social Score">Social Score</span></StatisticItem>
              }
            </Statistics>
            <Statistics>
              {(GlobalRank || LocalRank || TOS) &&
                <StatisticItem></StatisticItem>
              }
              {GlobalRank &&
                <StatisticItem>{GlobalRank.toLocaleString()} <br /><span className="stat_title" title="Social Score">Traffic Rank</span></StatisticItem>
              }
            </Statistics>
          </div>
        </div>
        <TagsBlock list={tagsList || []} />
        <Content input={about} /><br />

        {/* Social Statistics Section */}
        <Statistics>
          {FBLikes &&
            <StatisticItem>
              <a href={socialDetails.FacebookLink} target="_blank"><FaFacebookSquare size="32" color="black" /></a>
            </StatisticItem>
          }
          {FBLikes &&
            <StatisticItem>
              <h5>{FBLikes}</h5>
              <h6>fans</h6>
            </StatisticItem>
          }
          {(PinFollowers || PinFollowing) &&
            <StatisticItem>
              <a href={socialDetails.PinterestLink} target="_blank"><FaPinterestSquare size="32" color="black" /></a>
            </StatisticItem>
          }
          {PinFollowers &&
            <StatisticItem>
              <h5>{PinFollowers}</h5>
              <h6>followers</h6>
            </StatisticItem>
          }
          {PinFollowing &&
            <StatisticItem>
              <h5>{PinFollowing}</h5>
              <h6>following</h6>
            </StatisticItem>
          }
          {(TTFollowers || TTFollowing || TTLikes) &&
            <StatisticItem>
              <a href={socialDetails.TikTokLink} target="_blank"><svg stroke="currentColor" fill="currentColor" style={{ color: "black" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="32" height="32"><path fill="currentColor" d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"></path></svg></a>
            </StatisticItem>
          }
          {TTFollowers &&
            <StatisticItem>
              <h5>{TTFollowers}</h5>
              <h6>followers</h6>
            </StatisticItem>
          }
          {TTFollowing &&
            <StatisticItem>
              <h5>{TTFollowing}</h5>
              <h6>following</h6>
            </StatisticItem>
          }
          {TTLikes &&
            <StatisticItem>
              <h5>{TTLikes}</h5>
              <h6>likes</h6>
            </StatisticItem>
          }
          {(TwitterFollowers || TwitterFollowing) &&
            <StatisticItem>
              <a href={socialDetails.TwitterLink} target="_blank"><FaTwitterSquare size="32" color="black" /></a>
            </StatisticItem>
          }
          {TwitterFollowers &&
            <StatisticItem>
              <h5>{TwitterFollowers}</h5>
              <h6>followers</h6>
            </StatisticItem>
          }
          {TwitterFollowing &&
            <StatisticItem>
              <h5>{TwitterFollowing}</h5>
              <h6>following</h6>
            </StatisticItem>
          }
          {YTSubs &&
            <StatisticItem>
              <a href={socialDetails.YouTubeLink} target="_blank"><FaYoutube size="32" color="black" /></a>
            </StatisticItem>
          }
          {YTSubs &&
            <StatisticItem>
              <h5>{YTSubs}</h5>
              <h6>subscribers</h6>
            </StatisticItem>
          }
          {firstRowDataView && (firstRowDataView.node.FollowersCount || firstRowDataView.node.FollowingCount) &&
            <StatisticItem>
              <a href={socialDetails.InstagramLink} target="_blank"><FaInstagram size="32" color="black" /></a>
            </StatisticItem>
          }
          {firstRowDataView && firstRowDataView.node.FollowersCount &&
            <StatisticItem>
              <h5>{firstRowDataView.node.FollowersCount}</h5>
              <h6>followers</h6>
            </StatisticItem>
          }
          {firstRowDataView && firstRowDataView.node.FollowingCount &&
            <StatisticItem>
              <h5>{firstRowDataView.node.FollowingCount}</h5>
              <h6>following</h6>
            </StatisticItem>
          }
        </Statistics>

        {/* List of Products from MySQL View */}
        {listProductEdges && listProductEdges.length > 0 && <h3>shop {name}</h3>}

        {promos && promos.toLowerCase()!="n/a" &&
          <><Content input={promos} /><br /></>
        }

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
            {listProductEdges && listProductEdges.map(({ node }) => {
              FreeShipText = node.FreeShipText;
              return renderProduct(node, true);
            })}
          </Carousel>
        }

        {/* Show carousel for mobile version */}
        {!isMobile &&
          <ViewContainer>
            {listProductEdges.map(({ node }) => {
              FreeShipText = node.FreeShipText;
              return renderProduct(node);
            })}
          </ViewContainer>
        }
        <h5 style={{ textTransform: "capitalize" }}>{FreeShipText}</h5>
        <br />

        {/* List of Posts from MySQL View */}
        {listInstaPostEdges && listInstaPostEdges.length > 0 && <h3>instagram posts</h3>}
        <Content input={Biography} /><br />

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
        <a href="/randomshop" className="button ">Discover another shop</a>
      </Container>
      <SuggestionBar>
        <PostSuggestion>
          {prev && (
            <Link to={`/shops/${prev.UserName}`}>
              <p>&lt; {prev.name}</p>
            </Link>
          )}
        </PostSuggestion>
        <PostSuggestion>
          {next && (
            <Link to={`/shops/${next.UserName}`}>

              <p>{next.name}	&gt;</p>
            </Link>
          )}
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
      FullName
      Biography
      FBLikes
      PinFollowers
      PinFollowing
      TTFollowers
      TTFollowing
      TTLikes
      TwitterFollowers
      TwitterFollowing
      YTSubs
      name
      about
      promos
    }
    allMysqlDataView  (filter: {AlexaURL: {eq: $pathSlug}}) {
      edges {
        node {
          AlexaURL
          UserName
          FullName
          Biography
          PostDate
          AlexaCountry
          UniquePhotoLink
          mysqlImage {
            childImageSharp {
              fluid (srcSetBreakpoints: [200, 400]) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          PostsCount
          FollowersCount
          FollowingCount
          GlobalRank
          LocalRank
          TOS
          ProfilePicURL
          Caption
          ShortCodeURL
          activity
          FollowerRate
          PostRate
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
  }
`;
