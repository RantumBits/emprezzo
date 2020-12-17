import React from 'react';
import styled from '@emotion/styled';
import { css, Global } from '@emotion/core';
import _ from 'lodash';
import { Highlight } from 'react-instantsearch-dom';
import theme from '../../config/theme';
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
`;

const Tags = styled.span`
  font-size: 12px;
  font-family: 'Jost','Segoe UI','Roboto','Candal',-apple-system,'BlinkMacSystemFont','Segoe UI','Helvetica','Arial',sans-serif;
  font-weight: 300;
  margin: 5px 0;;
  white-space: none;
  overflow: hidden; word-wrap: none; text-overflow: ellipsis;
  display: block;
`;

const Stats = styled.span`
  font-size: 12px;
  display: block;

  margin-bottom: 8px;

`;

const Price = styled.small`

`;

const AlgoliaUncommonryItem = (props) => {
  //console.log("**** props",props)
  return (
    <Wrapper>
      <Global
        styles={css`
        .ais-Hits-item {
          width: calc(50% - 1rem) !important;
          @media (min-width: 1200px) {
            width: calc(33% - 1rem) !important;
          }
          @media (max-width: 600px) {
            width: calc(100% - 1rem) !important;
          }
        }
        `}
      />
      {props && props.hit &&
        <>
        <div style={{width: "25%"}}>
          <a href={`/shops/${props.hit.emprezzoID}/`} title={props.hit.shopName} target="_blank">
            <Image>
              <img src={props.hit.shopImage || props.hit.imageURL} />
            </Image>
          </a>
          </div>
          <Information>
            <a href={`/shops/${props.hit.emprezzoID}/`} title={props.hit.shopName}>
              <div>
                <Title>{props.hit.shopName}</Title>


                <Tags>{props.hit.shopCategory}: {props.hit.shopTags}</Tags>
                <Stats> {props.hit.priceMin &&  <span  style={{paddingRight: "0"}}>${Math.round(props.hit.priceMin)}-${Math.round(props.hit.priceMax)} / ${Math.round(props.hit.priceAvg)} avg</span>

              }</Stats>

                 <Stats>

                 {/*
                   <b>PAY</b> {props.hit.paypal == '1' &&
                  <span  style={{paddingRight: "0.25rem"}}><FaPaypal size="14" color="#666" /></span>
                }
                {props.hit.shopifyPay == '1' &&
                  <span  style={{paddingRight: "0.25rem"}}><FaShopify size="14" color="#666" /></span>
                }
                {props.hit.applePay == '1' &&
                  <span  style={{paddingRight: "0.25rem"}}><FaApple size="14" color="#666" /></span>
                }
                {props.hit.amazonPay == '1' &&
                  <span  style={{paddingRight: "0.25rem"}}><FaAmazon size="14" color="#666" /></span>
                }
        */}
                {props.hit.freeShipMin != null && props.hit.freeShipMin != 0 &&
                  <span><FaTruck size="14" color="#666" class="icon" title="Free shipping minimum"/> ${props.hit.freeShipMin}+</span>
                }
                {props.hit.freeShipMin == 0 &&
                  <span title="most orders ship free!"><FaTruck size="14" color="#666" class="icon" title="Get free shipping on most orders!"/>* </span>
                }

                {props.hit.baseShipRate > 0 &&
                  <span> <FaBoxOpen paddingRight='2px' size="14" color="#666" class="icon" title="Shipping rates from" />${props.hit.baseShipRate}+ </span>
                }
                {props.hit.returnDays != null && props.hit.returnDays != "0" &&
                  <span title={`${props.hit.returnDays} day returns`}> <FaUndoAlt paddingRight='5px' size="14" color="#666" />{props.hit.returnDays} </span>
                }
                {props.hit.returnShipFree != "." && props.hit.returnShipFree == "Yes" &&
                  <span> <FaRegStar size="14" color="#666" title="Most returns ship free"/></span>
                }




                </Stats>
                <br />
              </div>
            </a>
          </Information>
        </>
      }
    </Wrapper>
  );
}

export default AlgoliaUncommonryItem;
