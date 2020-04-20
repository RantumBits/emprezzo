import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Container } from 'layouts';
import { Header, TagsBlock, SEO } from 'components';
import config from '../../config/site';

const Tags = ({ pageContext }) => {
  const { tags } = pageContext;

  const title = "All Tags Page";

  return (
    <Layout>
      <SEO
        title={`${title} | ${config.title}`}
      />
      <Header title={title}>Gatsby Tutorial Starter</Header>
      <Container>
        <TagsBlock list={tags} />
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
