import React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Layout, Container } from 'layouts';
import { Header, SEO } from 'components';
import PostList from '../components/PostList';
import config from '../../config/site';

const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.white.light};
  padding: 5px 10px;
  border: solid 1px #fff;
  border-radius: 20px;
  &:hover {
    color: ${props => props.theme.colors.black.blue};
    background: ${props => props.theme.colors.white.light};
  }
`;

const TagWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 4rem 4rem 1rem 4rem;
  @media (max-width: 1000px) {
    margin: 4rem 2rem 1rem 2rem;
  }
  @media (max-width: 700px) {
    margin: 4rem 1rem 1rem 1rem;
  }
`;

const Tag = ({ data, pageContext }) => {
  const { posts, tagName } = pageContext;
  const upperTag = tagName.charAt(0).toUpperCase() + tagName.slice(1);
  const title = "Tag: " + tagName;
  const description = `Discover the most popular direct to consumer ${tagName} stores on emprezzo.`
  const listEdges = [];
  const maxItems = 15;
  const [limit, setLimit] = React.useState(maxItems);
  const [showMore, setShowMore] = React.useState(true);

  const increaseLimit = () => {
      setLimit(limit + maxItems);
  }

  //filtering as per limit
  posts.map((node) => {
    if (listEdges.length < limit) {
      listEdges.push(node);
    }
  })

  const rowDataViewEdges = data.allMysqlDataView.edges;

  return (
    <Layout>
      <SEO
        title={`${title} | ${config.title}`}
        description={description}
      />
      <Header title={upperTag}>
        {description}
      </Header>
        <TagWrapper>
          {listEdges.map((node) => (
            <PostList
              key={node.UserName}
              title={node.FullName}
              excerpt={node.Biography}
              path={`/shops/${node.UserName}`}
              mysqldataview={rowDataViewEdges}
              instagramname={node.UserName}
            />
          ))}
        </TagWrapper>
        {showMore && listEdges.length > 0 && listEdges.length < posts.length &&
          <div className="center">
              <button className="button" onClick={increaseLimit}>
                  Load More
              </button>
          </div>
        }
    </Layout>
  );
};

export default Tag;

Tag.propTypes = {
  pageContext: PropTypes.shape({
    posts: PropTypes.array,
    tagName: PropTypes.string,
  }),
};

export const query = graphql`
  query {
    allMysqlDataView {
      edges {
        node {
          UserName
          FullName
          UniquePhotoLink
          ProfilePicURL
          Caption
          ShortCodeURL
        }
      }
    }
  }
`;
