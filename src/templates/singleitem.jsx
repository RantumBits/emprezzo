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
  const { name, date, imageurl, url, category, tags, amazonlink, sociallink, about, country, state, city, like } = data.googleSheetListRow

  //converting comma seperated tags to tags map
  const tagsList = tags.split(',')

  return (
    <Layout>
      <SEO
        title={name}
        description={about || ' '}
        pathname={url}
      />
      <Header title={name} date={date} cover={imageurl} />
      <Container>
        <br/ >Image URL = <Content input={imageurl} />
        <br/ >URL = <Content input={url} />
        <br/ >Category = <Content input={category} />
        <br/ >Tags = <Content input={tags} />
        <br/ >AmazonLink = <Content input={amazonlink} />
        <br/ >SocialLink = <Content input={sociallink} />
        <br/ >Country = <Content input={country} />
        <br/ >City = <Content input={city} />
        <br/ >State = <Content input={state} />
        <TagsBlock list={tagsList || []} />
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
      date
      imageurl
      url
      category
      tags
      amazonlink
      sociallink
      about
      country
      state
      city
      like
    }
  }
`;
