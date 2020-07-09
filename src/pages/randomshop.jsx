import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import { navigate } from "@reach/router"

const RandomShop = ({ data }) => {
  const { edges } = data.allMysqlSocialIDs;

  console.log("Total Shops = "+edges.length);
  const randomnumber = Math.round(Math.random() * edges.length);
  console.log("Generated Random Number = "+randomnumber);
  const edge = edges[randomnumber-1] ? edges[randomnumber-1] : edges[0];
  const randomshopurl = "/shop/"+edge.node.Instagram;
  console.log("Random URL = "+randomshopurl);
  navigate(randomshopurl);

  return (
    <Helmet title={'Random Shop'} />
  );

};

export default RandomShop;

export const query = graphql`
  query {
    allMysqlSocialIDs {
      edges {
        node {
          Instagram
        }
      }
    }
  }
`;
