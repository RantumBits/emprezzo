import { Link } from 'gatsby'
import styled from '@emotion/styled';
import React, { Fragment } from 'react'
import { Highlight, Snippet } from 'react-instantsearch-dom'
import { Tag } from 'styled-icons/octicons'
import { Calendar } from 'styled-icons/octicons'
import { connectHits } from 'react-instantsearch-dom'
import {
  FaInstagram,
  FaFacebookSquare,
  FaPinterestSquare,
  FaTwitterSquare,
  FaYoutube,
  FaRegLaugh,
  FaChartLine,
  FaAt,
  FaPaypal,
  FaAmazon,
  FaShopify,
  FaApple,
  FaTags,
  FaTruck,
  FaRegStar,
  FaBoxOpen,
  FaUndoAlt,
} from 'react-icons/fa';

const Wrapper = styled.div`
  width: calc(100% - 1rem) !important;
  display: flex;
  padding: 0.5rem;
  margin: 2px;
  min-height: 60px;
  @media (min-width: 600px) {
    height: 130px;
  }
`;

const Image = styled.div`
  display: flex;
  margin-right: 1em;
  height: 65px;
  min-width: 78px;
  img {
    border-radius: 50%;
    margin: auto;
    width: auto;
    max-height: 65px;
  }
`;


const Information = styled.div`
  width: 75%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.h3`
  font-size: 18px;
  text-transform: capitalize;
  font-weight: bold;
  margin-bottom: 0px;
  color: ${props => props.theme.colors.black.blue};
`;

const Tags = styled.span`
  font-size: 12px;
  font-family: 'Jost','Segoe UI','Roboto','Candal',-apple-system,'BlinkMacSystemFont','Segoe UI','Helvetica','Arial',sans-serif;
  font-weight: 300;
  margin: 5px 0;;
  white-space: none;
  overflow: hidden; word-wrap: none; text-overflow: ellipsis;
  display: block;
  color: ${props => props.theme.colors.black.base};
`;

const Stats = styled.span`
  font-size: 12px;
  display: block;
  color: ${props => props.theme.colors.black.base};
  margin-bottom: 8px;
  svg {
    height: 0.5rem;
  }
`;

const shopHit = hit => (
  <div>
    <Tag size="1em" />
    &nbsp;
    <Highlight attribute="tags" hit={hit} tagName="mark" />
  </div>
)

export default connectHits(function HitComp({ type, hits, onClick }) {
  const extend = { shopHit }[type]
  //console.log(hits)
  //adding the excertp of 140 characters to all the hits
  hits.map(hit => {
    if (hit._highlightResult.shopDescription && hit._highlightResult.shopDescription.value) {
      let text = hit._highlightResult.shopDescription.value;
      //remove the highlighting
      text = text.replace("<ais-highlight-0000000000>", "");
      text = text.replace("</ais-highlight-0000000000>", "");
      text = text.substring(0, 100) + "...";
      //add the highlighting back
      text = text.replace(hit._highlightResult.shopDescription.matchedWords[0], "<ais-highlight-0000000000>" + hit._highlightResult.shopDescription.matchedWords[0] + "</ais-highlight-0000000000>")
      hit._highlightResult.shopDescription.value = text;
    }
  })

  return hits.map(hit => (
    <Wrapper key={hit.slug}>
      {/* <Link to={`/shops/` + hit.emprezzoID + `/`} onClick={onClick}>
        <h4>
          <Highlight attribute="shopName" hit={hit || ""} tagName="mark" />
        </h4>
      </Link>
      <Highlight attribute="shopDescription" hit={hit || ""} tagName="mark" /> */}
      <div style={{ width: "25%" }}>
        <Link href={`/shops/${hit.emprezzoID}/`} title={hit.shopName} target="_blank">
          <Image>
            <img src={hit.shopImage || hit.imageURL} />
          </Image>
        </Link>
      </div>
      <Information>
        <a href={`/shops/${hit.emprezzoID}/`} title={hit.shopName}>
          <div>
            <Title><Highlight attribute="shopName" hit={hit || ""} tagName="mark" /></Title>
            <Tags>{hit.shopCategory}: {hit.shopTags}</Tags>
            <Stats>
              {hit.priceMin &&
                <span style={{ paddingRight: "0" }}>${Math.round(hit.priceMin)}-${Math.round(hit.priceMax)} / ${Math.round(hit.priceAvg)} avg</span>
              }
            </Stats>
            <Stats>
              {hit.freeShipMin != null && hit.freeShipMin != 0 &&
                <span><FaTruck size="14" color="#666" class="icon" title="Free shipping minimum" /> ${hit.freeShipMin}+</span>
              }
              {hit.freeShipMin == 0 &&
                <span title="most orders ship free!"><FaTruck size="14" color="#666" class="icon" title="Get free shipping on most orders!" />* </span>
              }
              {hit.baseShipRate > 0 &&
                <span> <FaBoxOpen paddingRight='2px' size="14" color="#666" class="icon" title="Shipping rates from" />${hit.baseShipRate}+ </span>
              }
              {hit.returnDays != null && hit.returnDays != "0" &&
                <span title={`${hit.returnDays} day returns`}> <FaUndoAlt paddingRight='5px' size="14" color="#666" />{hit.returnDays} </span>
              }
              {hit.returnShipFree != "." && hit.returnShipFree == "Yes" &&
                <span> <FaRegStar size="14" color="#666" title="Most returns ship free" /></span>
              }
            </Stats>
            <br />
          </div>
        </a>
      </Information>
    </Wrapper>
  ))
})
