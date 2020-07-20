import React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Layout, Container, Content } from 'layouts';
import { TagsBlock, Header, SEO } from 'components';
import _ from 'lodash';

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
`;

const Statistics = styled.div`
  display: flex;
  margin-bottom: 15px;
  padding: 5px;
`;

const StatisticItem = styled.div`
  margin-right: 1rem;
  text-align: center;
  line-height: 1.2rem;
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    font-size: 1rem;

    margin-right: 10px;
  }
`;

const StatisticIcon = styled.img`
  max-width: 25px;
  margin:5px;
`;

const ViewContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
`;
const ViewCard = styled.div`
  flex: 1 ${props => props.itemWidth ? props.itemWidth : '25%'};
  padding: 5px;
  @media (max-width: ${props => props.theme.breakpoints.s}) {
      flex: 1 96%;
  }
`;
const ViewImage = styled.div`
  max-width: 100%;
`;
const ViewInfo = styled.div`
  margin-top: auto;
`;

const SingleItem = ({ data, pageContext }) => {
  const { next, prev } = pageContext;
  const { name, date, slug, imageurl, url, category, tags, localImageUrl, profileimage, localProfileImage, instagramname, instagramposts, instagramfollowers, instagramfollowing, alexarank, alexatimeonsite, socialscore, about, state, city, like, fields } = data.googleSheetListRow

  //converting comma seperated tags to tags map
  const tagsList = tags ? tags.split(',') : [];
  const image = localImageUrl ? localImageUrl.childImageSharp.fluid : null;
  const atomfeed = fields && fields.atomfeed ? fields.atomfeed : [];

  console.log("*** instagramname used for matching = " + instagramname)

  //Extracting Posts from MySQL Data
  const maxPosts = 3;
  const rowDataViewEdges = data.allMysqlDataView.edges;
  //filtering top 3 for current instagram id
  const filteredDataView = _.filter(rowDataViewEdges, ({ node }) => node.UserName == instagramname)
  const listPostEdges = _.slice(filteredDataView,0,maxPosts);
  const firstRowDataView = listPostEdges && listPostEdges.length ? listPostEdges[0] : null;
  //console.log("*****++FirstRow+++********")
  //console.log(firstRowDataView)
  //console.log("*****++listPostEdges+++********")
  //console.log(listPostEdges)

  //Now filtering instagram posts if the image or caption is not present
  const listInstaPostEdges = _.filter(listPostEdges, ({ node }) => (node.UniquePhotoLink))
  //console.log("*****++listInstaPostEdges+++********")
  //console.log(listInstaPostEdges)

  //Extracting Social IDs from MySQL Data
  let socialDetails = null
  const rowSocialIDEdges = data.allMysqlSocialIDs.edges;
  rowSocialIDEdges.map((edge) => {
    if (edge.node.Instagram == instagramname) {
      socialDetails = {
        "InstagramLink": edge.node.Instagram ? "https://www.instagram.com/" + edge.node.Instagram : null,
        "FacebookLink": edge.node.Facebook ? "https://www.facebook.com/" + edge.node.Facebook : null,
        "PinterestLink": edge.node.Pinterest ? "https://www.pinterest.com/" + edge.node.Pinterest : null,
        "TikTokLink": edge.node.TikTok ? "https://www.tiktok.com/" + edge.node.TikTok : null,
        "TwitterLink": edge.node.Twitter ? "https://www.twitter.com/" + edge.node.Twitter : null,
        "YouTubeLink": edge.node.YouTube ? "https://www.youtube.com/c/" + edge.node.YouTube : null
      }
      //console.log("+++++++++++++")
      //console.log(socialDetails)
      //console.log("+++++++++++++")
    }
  })

  let subtitle = (city || "") + " " + (state || "")
  subtitle += "<div>" + ((firstRowDataView && firstRowDataView.node.AlexaCountry) || "") + "</div>"


  //Extracting Products from MySQL Data
  const maxProducts = 5;
  const rowShopifyViewEdges = data.allMysqlShopifyView.edges;
  //filtering top 3 for current instagram id
  const filteredProductView = _.filter(rowShopifyViewEdges, ({ node }) => node.UserName == instagramname)
  const listProductEdges = _.slice(filteredProductView,0,maxProducts);
  //console.log("*****++listProductEdges+++********")
  //console.log(listProductEdges)

  return (
    <Layout>
      <SEO
        title={`Find ${name} & other great ${category||''} stores on emprezzo`}
        description={`Find ${name} and discover great ${category||''} online stores on emprezzo. ${about}`}
        banner={image}
        pathname={url}
      />
      <Header title={name} children={subtitle} date={date} socialDetails={socialDetails} />
      <Container>
        <div className="profileimage" style={{ display: "flex" }}>
          {firstRowDataView && firstRowDataView.node.ProfilePicURL &&
            <img src={firstRowDataView.node.ProfilePicURL} alt={name} className="profileimage" style={{ width: "100px", height: "100px" }} />
          }
          <div style={{ paddingLeft: "15px" }}>
            <Statistics>
              {firstRowDataView && (firstRowDataView.node.activity || firstRowDataView.node.FollowerRate || firstRowDataView.node.PostRate) &&
                <StatisticItem><a target="_blank" href={firstRowDataView && firstRowDataView.node.ShortCodeURL}></a></StatisticItem>
              }
              {firstRowDataView && firstRowDataView.node.activity &&
                <StatisticItem>{(firstRowDataView.node.activity+firstRowDataView.node.FollowerRate+firstRowDataView.node.PostRate).toFixed(1)} <br /><span className="stat_title" title="Social Score">Social Score</span></StatisticItem>
              }

            </Statistics>


            <Statistics>
              {firstRowDataView && (firstRowDataView.node.GlobalRank || firstRowDataView.node.LocalRank || firstRowDataView.node.TOS) &&
                <StatisticItem></StatisticItem>
              }
              {firstRowDataView && firstRowDataView.node.GlobalRank &&
                <StatisticItem>{firstRowDataView.node.GlobalRank.toLocaleString()} <br /><span className="stat_title" title="Social Score">Traffic Rank</span></StatisticItem>
              }

            </Statistics>


          </div>
        </div>
        <Content input={about} /><br />

{tagsList}

        {/*<AtomFeedList list={atomfeed} /><br />*/}
        {/* List of Products from MySQL View */}
        {listProductEdges && listProductEdges.length > 0 && <h3>shop {name}</h3>}
        <ViewContainer>
          {listProductEdges.map(( {node} ) => {
            return (
              <ViewCard key={node.ProductURL} itemWidth="18%">
                <a href={node.ProductURL} target="_blank">
                  <ViewImage>
                  <div style={{  width: '100%', height: '150px;' }}>
                    <img src={node.ImageURL} style={{  'object-fit': 'cover','height': '150px', width: '100%', 'margin': 'auto'}} alt={node.Title}/>
                    </div>
                  </ViewImage>
                </a>
                <small>${node.Price}</small>
                <ViewInfo className="info">
                  <a href={node.ProductURL} target="_blank">
                    {node.Title && node.Title.substring(0, 50)}
                  </a>
                </ViewInfo>
              </ViewCard>
            );
          })}

          <br />
          {/* List of Posts from MySQL View */}
          {listInstaPostEdges && listInstaPostEdges.length > 0 && <h3>instagram posts</h3>}
          <ViewContainer style={{ 'width': "100%" }}>
            {listInstaPostEdges.map(( {node} ) => {
              return (
                <ViewCard key={node.UniquePhotoLink} itemWidth="30%"  >
                  <a href={node.ShortCodeURL} target="_blank">
                    <ViewImage >
                      <img  src={node.UniquePhotoLink} alt={node.Caption} style={{  'object-fit': 'cover','height': '200px', width: '100%', 'margin': 'auto'}}/>
                    </ViewImage>
                  </a>
                  <ViewInfo className="info" >
                    {node.Caption && node.Caption.substring(0, 140) + "..."}
                  </ViewInfo>
                </ViewCard>
              );
            })}
          </ViewContainer>
        </ViewContainer><br />
        <a href="/randomshop" className="button ">Discover another shop</a>
      </Container>
      <SuggestionBar>
        <PostSuggestion>
          {prev && (
            <Link to={`/shops/${prev.slug}`}>
              <p>&lt; {prev.name}</p>
            </Link>
          )}
        </PostSuggestion>
        <PostSuggestion>
          {next && (
            <Link to={`/shops/${next.slug}`}>

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
          activity
          FollowerRate
          PostRate
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
    allMysqlSocialIDs {
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
    googleSheetListRow(slug: {eq: $pathSlug}) {
      name
      url
      slug
      category
      tags
      about
      instagramname
      alexarank
      alexatimeonsite
      state
      city
      fields {
        atomfeed {
          guid
          title
          link
        }
      }
    }
  }
`;
