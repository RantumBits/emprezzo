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

const SingleItem = ({ data, pageContext }) => {
  const { next, prev } = pageContext;
  const { name, date, slug, imageurl, url, category, tags, localImageUrl, profileimage, instagramname, instagramposts, instagramfollowers, instagramfollowing, alexalink, alexarank, alexatimeonsite, about, country, state, city, like, fields } = data.googleSheetListRow

  //converting comma seperated tags to tags map
  const tagsList = tags ? tags.split(',') : [];
  const image = localImageUrl ? localImageUrl.childImageSharp.fluid : null;
  const atomfeed = fields && fields.atomfeed ? fields.atomfeed : [];

  const subtitle = city+", "+state+" "+country

  return (
    <Layout>
      <SEO
        title={name}
        description={about || ' '}
        banner={image}
        pathname={url}
      />
      <Header title={name} children={subtitle} date={date} cover={image} />
      <Container>
        <div class="profile_left" style={{ display: "flex" }}>
          <img width="100px" height="100px" src={profileimage} alt={name} class="profileimage"/>
          <div style={{paddingLeft: "15px"}}>
          <Statistics>
            <StatisticItem><a target="_blank" href={`https://www.instagram.com/${instagramname}/`}><StatisticIcon src="/instagram_icon.png" alt={instagramname} width="15px" height="15px" max-width="25px"  /></a></StatisticItem>
            <StatisticItem>{instagramfollowers} <br/><span class="stat_title" title="*Instagram Follow Score">*IFS*</span></StatisticItem>
            <StatisticItem>{instagramposts} <br/><span class="stat_title" title="Instagram Post Score">*IPS*</span></StatisticItem>

          </Statistics>

          </div>
        </div>
        <Content input={about} /><br/>
        <TagsBlock title="tags" list={tagsList || []} />
        <a target="_blank" href={url} className="button">Shop {name}</a> <a href="/randomshop" className="button buttonalt">Discover another shop</a>

<AtomFeedList list={atomfeed} /><br />
{/*
        <Statistics>
          <StatisticItem><a target="_blank" href={alexalink}><StatisticIcon src="/alexa_icon.jpg" alt={alexalink} /></a></StatisticItem>
          <StatisticItem>{alexarank} <br/>alexa rank</StatisticItem>
          <StatisticItem>{alexatimeonsite} <br/>avg minutes per visit</StatisticItem>
        </Statistics>
*/}


      </Container>
      <SuggestionBar>
        <PostSuggestion>
          {prev && (
            <Link to={`/shops/${prev.slug}`}>
              Previous
              <h3>{prev.name}</h3>
            </Link>
          )}
        </PostSuggestion>
        <PostSuggestion>
          {next && (
            <Link to={`/shops/${next.slug}`}>
              Next
              <h3>{next.name}</h3>
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
