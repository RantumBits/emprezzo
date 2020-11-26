import React from 'react';
import styled from '@emotion/styled';
import { css, Global } from '@emotion/core';
import _ from 'lodash';
import { Highlight } from 'react-instantsearch-dom';
import theme from '../../config/theme';

const Wrapper = styled.div`
  display: flex;
  padding: 3px;
  margin: 2px;
  min-height: 80px;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.span`
  font-size: 14px;
  text-transform: capitalize;
  font-weight: bold;
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
          @media (max-width: 700px) {
            width: calc(100% - 1rem) !important;
          }
        }
        `}
      />
      {props && props.hit &&
        <>
          <a href={`/shops/${props.hit.emprezzoID}/`} title={props.hit.shopName} target="_blank">
            <Image>
              <img src={props.hit.shopImage || props.hit.imageURL} />
            </Image>
          </a>
          <Information>
            <a href={`/shops/${props.hit.emprezzoID}/`} title={props.hit.shopName} target="_blank">
              <div>
                <Title>{props.hit.shopName}</Title>
                <br />
                <i>{props.hit.shopTags}</i><br />
                <Price>Avg price: ${props.hit.price}</Price>
                {` `}
                <Price>Free ship min: ${props.hit.freeShipMin}</Price>
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
