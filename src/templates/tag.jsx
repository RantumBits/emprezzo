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

const Tag = ({ pageContext }) => {
  const { posts, tagName } = pageContext;
  const upperTag = tagName.charAt(0).toUpperCase() + tagName.slice(1);
  const title = "Tag: " + tagName;
  const listEdges = [];
  const maxItems = 12;
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

  return (
    <Layout>
      <SEO
        title={`${title} | ${config.title}`}
      />
      <Header title={upperTag}>
        Browse indepent online {upperTag} stores selling directly to consumers
      </Header>
        <TagWrapper>
          {listEdges.map((node) => (
            <PostList
              key={node.name}
              cover={node.imageurl}
              path={`/shops/${node.slug}`}
              title={node.name}
              excerpt={node.about && node.about.substring(0,40)+"..."}
            />
          ))}
        </TagWrapper>
        {showMore && listEdges.length > 0 && listEdges.length < posts.length &&
          <div className="center">
              <a className="button" onClick={increaseLimit} style={{cursor: "pointer"}}>
                  Load More
              </a>
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
