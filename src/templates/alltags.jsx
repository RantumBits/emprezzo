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

  const [countFilter, setCountFilter] = React.useState()

  const title = "All Tags Page";

  const lowerList = _.mapValues(tags, _.method('toLowerCase'));
  const trimedList = _.mapValues(lowerList, _.method('trim'))
  const uniqueList = _.uniq(Object.values(trimedList))
  const orderdList = _.orderBy(uniqueList)
  //remove blank tags
  const filteredList = _.filter(orderdList, (tag) => (tag != null && tag.trim().length > 0))

  const getPostsByTag = (tag) => {
    //filter from trimmed and lowercase
    const filteredPosts = _.filter(edges, ({ node }) => node.tags && node.tags.toLowerCase().indexOf(tag) >= 0)
    return filteredPosts
  }

  //creating map of tags and its posts counts
  let tagList = [];
  const countList = [];
  filteredList.map((tag) => {
    const count = getPostsByTag(tag.trim()).length;
    const newItem = {
      tag: tag,
      count: count
    }
    tagList.push(newItem)
    countList.push(count)
  });

  const finalCountList = _.orderBy(_.uniq(countList))

  const handleChange = (event) => {
    let selectedOption = event.target.value;
    setCountFilter(selectedOption)
    //console.log(`Option selected:`, selectedOption);
  }

  //if countFilter is set then filter finaltag list
  if (countFilter && countFilter.length > 0) {
    tagList = _.filter(tagList, (item) => item.count == countFilter)
  }

  return (
    <Layout>
      <SEO
        title={`${title} | ${config.title}`}
      />
      <Header title={title}>All Tags</Header>
      <Container>
        <div style={{ display: "flex", verticalAlign: "middle" }}>
          Filter based on count : {` `}
          <select style={{ padding: "0.5rem" }} onChange={event => handleChange(event)}>
            <option value=""></option>
            {finalCountList.map((count) =>
              <option key={count}>{count}</option>
            )}
          </select>
        </div>
        <TagsContainer>
          {tagList && tagList.map((item, index) => {
            //const upperTag = tag.charAt(0).toUpperCase() + tag.slice(1);
            return (
              <Link key={index} to={`/tags/${_.kebabCase(item.tag.trim())}`}>
                <span>{item.tag} - </span><span className="count">{item.count}</span>
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

