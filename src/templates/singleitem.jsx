import React from 'react';
import { graphql, Link } from 'gatsby';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Layout, Container, Content } from 'layouts';
import { TagsBlock, Header, SEO } from 'components';
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
`;

const SingleItem = ({ data, pageContext }) => {
  const { next, prev } = pageContext;
  const { name, date, imageurl, url, category, tags, localImageUrl, sociallink, about, country, state, city, like } = data.googleSheetListRow

  //converting comma seperated tags to tags map
  const tagsList = tags.split(',')
  const image = localImageUrl.childImageSharp.fluid;

  return (
    <Layout>
      <SEO
        title={name}
        description={about || ' '}
        banner={image}
        pathname={url}
      />
      <Header title={name} date={date} cover={image} />
      <Container>

        <h1>{name}</h1>
        <h5>{city}, {state} {country}</h5>
        <TagsBlock list={tagsList || []} />
        <p><Content input={about} /></p><br/>
        <a target="_blank" href ={url} class="button">Shop {name}</a> <a href ="/randomshop" class="button buttonalt">See another shop</a>

      </Container>
      <SuggestionBar>
        <PostSuggestion>
          {prev && (
            <Link to={`/shops/${prev.name}`}>
              Previous
              <h3>{prev.name}</h3>
            </Link>
          )}
        </PostSuggestion>
        <PostSuggestion>
          {next && (
            <Link to={`/shops/${next.name}`}>
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
    googleSheetListRow(name: {eq: $pathSlug}) {
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
      category
      tags
      sociallink
      about
      country
      state
      city
    }
  }
`;
