import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header, BlogList } from 'components';
import { Layout } from 'layouts';

const Shops = ({ data }) => {
  const { edges } = data.allGoogleSheetListRow;
  return (
    <Layout>
      <Helmet title={'Shops Page'} />
      <Header title="Shops Page">Gatsby Tutorial Starter</Header>
      {edges.map(({ node }) => (
        <BlogList
          key={node.name}
          cover={node.imageurl}
          path={`/shops/${node.name}`}
          title={node.name}
          date={node.date}
          tags={node.tags.split(',')}
          excerpt={node.about}
        />
      ))}
    </Layout>
  );
};

export default Shops;

export const query = graphql`
  query {
    allGoogleSheetListRow(sort: {fields: date, order: DESC}) {
      edges {
        node {
          name
          date
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
          imageurl
        }
      }
    }
  }
`;
