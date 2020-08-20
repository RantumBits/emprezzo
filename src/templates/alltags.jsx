import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Container } from 'layouts';
import styled from '@emotion/styled';
import { Header, TagsBlock, SEO } from 'components';
import config from '../../config/site';
import { graphql, Link } from 'gatsby'
import _ from 'lodash';

const TagsContainer = styled.div`
  margin: 1rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  a {
    margin: 0 1rem 1rem 0;
    color: ${props => props.theme.colors.black.blue};
    padding: 0.3rem 0.6rem;
    background: ${props => props.theme.colors.white.grey};
    border-radius: 10px;
    &:hover {
      color: ${props => props.theme.colors.white.light};
      background: ${props => props.theme.colors.primary.light};
      border: ${props => props.theme.colors.primary.light};
    }
    .count {
        color: ${props => props.theme.colors.white.light};
        background: ${props => props.theme.colors.primary.light};
        border-radius: 10px;
        padding: 5px;
    }
  }
`;

const Tags = ({ pageContext, data }) => {
  const { tags } = pageContext;
  const { edges } = data.allMysqlMainView;

  const title = "All Tags Page";

  //remove blank tags
  const filteredList = _.filter(tags, (tag) => (tag != null && tag.trim().length > 0))

  const getPostsByTag = (tag) => {
    const filteredPosts = _.filter(edges, ({ node }) => node.tags && node.tags.indexOf(tag) >= 0)
    //console.log("********* filteredPosts")
    //console.log(filteredPosts)
    return filteredPosts
  }

  return (
    <Layout>
      <SEO
        title={`${title} | ${config.title}`}
      />
      <Header title={title}>All Tags</Header>
      <Container>
        <TagsContainer>
          {filteredList && filteredList.map((tag, index) => {
            const upperTag = tag.charAt(0).toUpperCase() + tag.slice(1);
            return (
              <Link key={index} to={`/tags/${_.kebabCase(tag.trim())}`}>
                <span>{upperTag} - </span><span className="count">{getPostsByTag(tag.trim()).length}</span>
              </Link>
            );
          })}
        </TagsContainer>
      </Container>
    </Layout>
  );
};

export default Tags;

Tags.propTypes = {
  pageContext: PropTypes.shape({
    tags: PropTypes.array,
  }),
};

export const query = graphql`
query allQuery {
  allMysqlMainView {
    edges {
      node {
        tags
        UserName
      }
    }
  }
}
`;

