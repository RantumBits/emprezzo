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
  const { edges } = data.allMysqlMainView;
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
      <Helmet title={'Store Rankings | Discover the best ecommerce stores'} />
      <Header title="🧐 Discover direct-to-consumer stores"><span className="Header--Subtitle"></span></Header>

      <ShopsWrapper>

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
              <tr key={node.UserName}>
                <td>
                  {node.ProfilePicURL &&
                    <Link to={`/shops/${node.UserName}`}>
                      <img src={node.ProfilePicURL} className="profileimage" style={{ width: "50px" }} title={node.FullName}/>
                    </Link>
                  }
                </td>
                  <td><Link to={`/shops/${node.UserName}`}>{node.FullName}</Link></td>
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
    </Layout>
  );
};

export default Entries;

export const query = graphql`
  query {
    allMysqlMainView {
      edges {
        node {
          AlexaURL
          UserName
          FullName
          Biography
          ProfilePicURL
        }
      }
    }
  }
`;
