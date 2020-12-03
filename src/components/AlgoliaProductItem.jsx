import React, { useContext } from 'react';
import styled from '@emotion/styled';
import _ from 'lodash';
import { CartContext } from './Cart/CartContext'
import { Highlight } from 'react-instantsearch-dom';
import theme from '../../config/theme';
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

const Wrapper = styled.article`
  position: relative;
  z-index: 0;
  border-radius: ${props => props.theme.borderRadius.default};
  {/* box-shadow: ${props => props.theme.shadow.feature.small.default};*/}
  transition: ${props => props.theme.transitions.boom.transition};
  height: 12rem;

  &:hover {
    box-shadow: ${props => props.theme.shadow.feature.small.hover};
    transform: scale(1.04);
  }

  @media (max-width: 1000px) {
    height: 18rem;
  }

  @media (max-width: 600px) {
    flex-basis: 100%;
    max-width: 100%;
    width: 100%;
    height: 7rem;
  }
`;

const Image = styled.div`
  position: absolute;
  top: 0;
  overflow: hidden;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1;
  object-fit: cover;
  text-align: center;
  border-radius: ${props => props.theme.borderRadius.default};
  img {
    border-radius: ${props => props.theme.borderRadius.default};
    width: 50%;
    object-fit: fill;
  }
  > div {
    position: static !important;
  }
  > div > div {
    position: static !important;
  }
`;

const StyledLink = styled.a`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem;
  z-index: 3;
  border-radius: ${props => props.theme.borderRadius.default};
  &:after {
    content: '';
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 30%,
      rgba(0, 0, 0, 0.2) 60%,
      rgba(0, 0, 0, 0.3) 80%,
      rgba(0, 0, 0, 0.5) 100%
    );
    z-index: -10;
    border-radius: ${theme.borderRadius.default};
    transition: opacity ${theme.transitions.default.duration};
  }
`;

const Information = styled.div`
  color: ${props => props.theme.colors.white.light};
  margin: 0 1rem 1.25rem 1.25rem;
  position: absolute;
  bottom: 0;
  left: 0;
`;

const Title = styled.div`
  margin: 0;
  margin-bottom: 0.2rem;
  text-transform: capitalize;
  font-size: .8rem;
  color: #000;
  span {
    font-size: 0.8rem
  }

`;

const Price = styled.div`
  font-size: 0.6rem;
  margin: 0 0 0.25rem 0 !important;
  color: #000;
`;

const StyledDialog = styled(Dialog)`
@media (max-width: 600px) {
  width: 90vw;
}
.dialogTitle {
  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
}

.dialogImageDescription {
  display : flex;
  img {
    max-height: 300px;
    max-width: 50%;
    margin-right: 3%;
  }
  span {
    padding-left: 2rem;
  }

  @media (max-width: 600px) {
    display : block;
    img {
      max-width : 100%;
    }
    span {
      padding-left: 0rem;
    }
  }
}
`;

const AlgoliaProductItem = (props) => {
  const [showDialog, setShowDialog] = React.useState(false);
  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  //console.log("**** props", props)
  const { addProduct, cartItems, increase } = useContext(CartContext);
  const isInCart = product => {
    return !!cartItems.find(item => item.id === product.id);
  }
  const addToCartWrapper = hit => {
    const hitToProduct = {
        id: hit.objectID,
        name: hit.name,
        price: hit.price,
        photo: hit.imageURL,
        productURL: hit.productURL,
    }
    //increase the quantity if already present, if not add product to cart
    isInCart(hitToProduct) ? increase(hitToProduct) : addProduct(hitToProduct);
  }

  const convertToSelectList = (variants) => {
    if (variants == null) return;
    if (variants.toLowerCase() == "default title") return;
    const list = variants.split(",");
    return (
      <div>Options: <select>
        {list.map((item, index) => (
          <option key={index}>{item}</option>
        ))}
      </select>
      </div>
    )

  }

  console.log("**** hit",(props && props.hit))
  return (
    <Wrapper>
      {props && props.hit &&
        <>
          <Image>
            <a href={`/shops/${props.hit.emprezzoID}/`} title={props.hit.name} target="_blank">
              {props.hit.imageURL &&
                <img src={props.hit.imageURL} />
              }
            </a>
          </Image>
          <StyledLink href="javascript:void(0)" onClick={() => openDialog()} title={props.hit.shopName}>
            <Information>
              <Title>{(props.hit.name || "").substring(0,26)}</Title>
              {props.hit.price &&
                <Price>
                  {props.hit.maxPrice && props.hit.maxPrice>props.hit.price &&
                    <strike>${props.hit.maxPrice}</strike>
                  }
                  {` `}${props.hit.price}
                </Price>
              }
            </Information>
          </StyledLink>
          <StyledDialog isOpen={showDialog} onDismiss={closeDialog}>
            <button className="close-button" onClick={closeDialog} style={{ float: "right", cursor: "pointer" }}>
              <span aria-hidden>X</span>
            </button>
            <div className="dialogImageDescription">
              {props.hit.imageURL &&
                <img src={props.hit.imageURL} />
              }
              <div>
                <h3>{props.hit.name}</h3>
                <p><i>Available at <a href={`/shops/${props.hit.emprezzoID}/`}>{props.hit.shopName || props.hit.name}</a> from ${props.hit.price}</i></p>
                <p>{props.hit.description && props.hit.description.substring(0, 220)}</p>
                {convertToSelectList(props.hit.VariantTitle)}
              </div>
            </div>
            <br />
            <div>
              <a href={props.hit.productURL} target="_blank" className="button">Buy at {props.hit.shopName}</a>
              <a href="javascript:"  onClick={() => addToCartWrapper(props.hit)} className="button buttonalt">Save for later</a>
            </div>
            <br />
          </StyledDialog>
        </>
      }
    </Wrapper>
  );
}

export default AlgoliaProductItem;
