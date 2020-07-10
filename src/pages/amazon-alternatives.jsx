import React from 'react';
import { Link, graphql } from 'gatsby';
import Image from 'gatsby-image';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Header, BlogList } from 'components';
import { Layout } from 'layouts';

const ShopsWrapper = styled.div`
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

const Entries = ({ data }) => {
  const { edges } = data.allGoogleSheetListRow;
  const listEdges = [];
  const maxItems = 12;
  const [limit, setLimit] = React.useState(maxItems);
  const [showMore, setShowMore] = React.useState(true);

  const increaseLimit = () => {
    setLimit(limit + maxItems);
  }

  //filtering items as per limit
  edges.map((edge) => {
    if (listEdges.length < limit) {
      listEdges.push(edge);
    }
  })

  return (
    <Layout>
      <Helmet title={'Amazon Alternatives | Anti-Amazon Shopping Marketpace '} />
      <Header title="🧐 Discover great Amazon alternatives" subtitle=""></Header>

      <ShopsWrapper>
<div class="intro_text">
<h3>Browse shopping alternatives to Amazon</h3>
<p>Independent online shops offer great alternatives to the Amazon marketplace.</p>
</div>
        <table>
          <thead>
            <tr>
              <th>Store</th>
              <th></th>

              <th>IFS</th>
              <th>IPS</th>
              <th>ESS</th>
            </tr>
          </thead>
          <tbody>
            {listEdges.map(({ node }) => (
              <tr key={node.name}>
                <td>
                  {node.localProfileImage &&
                    <Link to={`/shops/${node.slug}`}>
                      <Image fluid={node.localProfileImage.childImageSharp.fluid} class="profileimage" style={{ width: "50px" }} title={node.name + 'is on Shopify'} alt={node.about && node.about.substring(0, 140) }/>

                    </Link>
                  }

                </td>

                  <td><Link to={`/shops/${node.slug}`}>{node.name}</Link></td>

                <td>{node.followersperfollow}</td>
                <td>{node.followersperpost}</td>
                <td>{node.socialscore}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </ShopsWrapper>
      {showMore && listEdges.length > 0 && listEdges.length < edges.length &&
        <div className="center">
          <a className="button" onClick={increaseLimit} style={{ cursor: "pointer" }}>
            Load More
            </a>
        </div>
      }
      <ShopsWrapper>
      <div class="intro_text">
      <h3>Discover the best Amazon marketplace alternatives for shoppping online</h3>
      <p>Find some of the best anti-amazon shops and avoid the hassle of looking for amazon customer service.</p><p>Search for great Amazon shopping alternatives in header or <a href="/randomshop">discover a shop</a>.</p>
      </div>
        </ShopsWrapper>
    </Layout>
  );
};

export default Entries;

export const query = graphql`
  query {
    allGoogleSheetListRow {
      edges {
        node {
          name
          url
          slug
          about
        }
      }
    }
  }
`;
