import React from 'react';
import { graphql, Link } from 'gatsby';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Layout, Container, Content } from 'layouts';
import { TagsBlock, Header, SEO } from 'components';
import AtomFeedList from '../components/AtomFeedList';
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
  border: 1px solid ${props => props.theme.colors.white.grey};
  margin-bottom: 15px;
  padding: 5px;
`;

const StatisticItem = styled.div`
  margin-right: 40px;
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    font-size: 0.6rem;
    margin-right: 10px;
  }
`;

const StatisticIcon = styled.img`
  width: 30px;
  margin-left: 7px;
  margin-top: 5px;
`;

const SingleItem = ({ data, pageContext }) => {
  const { next, prev } = pageContext;
  const { name, date, slug, imageurl, url, category, tags, localImageUrl, profileimage, instagramname, instagramposts, instagramfollowers, instagramfollowing, alexalink, alexarank, alexatimeonsite, about, country, state, city, like, fields } = data.googleSheetListRow

  //converting comma seperated tags to tags map
  const tagsList = tags ? tags.split(',') : [];
  const image = localImageUrl ? localImageUrl.childImageSharp.fluid : null;
  const atomfeed = fields && fields.atomfeed ? fields.atomfeed : [];

  return (
    <Layout>
      <SEO
        title={name}
        description={about || ' '}
        banner={image}
        pathname={url}
      />
      <Header title={name} date={date} />
      <Container>
        <div style={{ display: "flex" }}>
          <img src={profileimage} />
          <div style={{paddingLeft: "15px"}}>
            <Title>{name}</Title>
            <Subtitle>{city}, {state} {country}</Subtitle>
          </div>
        </div>
        <TagsBlock list={tagsList || []} />
        <Content input={about} /><br />

        <Statistics>
          <StatisticItem><a target="_blank" href={`https://www.instagram.com/${instagramname}/`}><StatisticIcon src="/instagram_icon.png" alt={instagramname} /></a></StatisticItem>
          <StatisticItem>{instagramfollowers} <br/>followers</StatisticItem>
          <StatisticItem>{instagramposts} <br/>posts</StatisticItem>
          <StatisticItem>{instagramfollowing} <br/>following</StatisticItem>
        </Statistics>

        <Statistics>
          <StatisticItem><a target="_blank" href={alexalink}><StatisticIcon src="/alexa_icon.jpg" alt={alexalink} /></a></StatisticItem>
          <StatisticItem>{alexarank} <br/>alexa rank</StatisticItem>
          <StatisticItem>{alexatimeonsite} <br/>avg minutes per visit</StatisticItem>
        </Statistics>

        <AtomFeedList list={atomfeed} /><br />
        <a target="_blank" href={url} className="button">Shop {name}</a> <a href="/randomshop" className="button buttonalt">Discover another shop</a>

      </Container>
      <SuggestionBar>
        <PostSuggestion>
          {prev && (
            <Link to={`/shops/${prev.slug}`}>
              <h4>Previous</h4>
              <p>{prev.name}</p>
            </Link>
          )}
        </PostSuggestion>
        <PostSuggestion>
          {next && (
            <Link to={`/shops/${next.slug}`}>
              <h4>Next</h4>
              <p>{next.name}</p>
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
    googleSheetListRow(slug: {eq: $pathSlug}) {
      name
      imageurl
      localImageUrl {
        childImageSharp {
          fluid(
            maxWidth: 1920
            quality: 100
            duotone: { highlight: "#386eee", shadow: "#2323be", opacity: 60 }
          ) {
            ...GatsbyImageSharpFluid_withWebp
          }
          resize(width: 1200, quality: 90) {
            src
          }
        }
      }
      url
      slug
      category
      tags
      about
      profileimage
      instagramname
      instagramposts
      instagramfollowers
      instagramfollowing
      alexalink
      alexarank
      alexatimeonsite
      country
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
