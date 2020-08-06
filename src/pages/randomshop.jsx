import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import _ from 'lodash';
import { navigate } from "@reach/router"

const RandomShop = ({ data }) => {
  const { edges } = data.allMysqlMainView;
  const rowRankViewEdges = data.allMysqlRankView.edges;

  const combinedEdges = [];
  //Creating a new dataset with original nodes and required columns from DataView
  edges.map((edge) => {
    const inputInstaID = edge.node.UserName;
    var resultRankView = _.filter(rowRankViewEdges, ({ node }) => node.UserName == inputInstaID)
    if (resultRankView.length > 0) {
      combinedEdges.push(edge);
    }
  })

  //console.log("Total Shops with Rank View = "+combinedEdges.length);
  const randomnumber = Math.round(Math.random() * combinedEdges.length);
  //console.log("Generated Random Number = "+randomnumber);
  const edge = combinedEdges[randomnumber-1] ? combinedEdges[randomnumber-1] : combinedEdges[0];
  //console.log(edge)
  const randomshopurl = "/shops/"+edge.node.UserName;
  console.log("Random URL = "+randomshopurl);
  navigate(randomshopurl);

  return (
    <Helmet title={'Random Shop'} />
  );

};

export default RandomShop;

export const query = graphql`
  query {
    allMysqlMainView {
      edges {
        node {
          AlexaURL
          UserName
        }
      }
    }
    allMysqlRankView {
      edges {
        node {
          UserName
        }
      }
    }
  }
`;
