import React, { useContext } from 'react';
import styled from '@emotion/styled';
import _ from 'lodash';
import { CartContext } from './Cart/CartContext'
import ShopifyCart from './Cart/ShopifyCart';
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
  height: 14rem;

  &:hover {
    box-shadow: ${props => props.theme.shadow.feature.small.hover};
    transform: scale(1.04);
    > div {
      display: block;
    }
    }
  }

  @media (max-width: 1000px) {
    height: 10rem;
  }

  @media (max-width: 600px) {
    flex-basis: 100%;
    max-width: 100%;
    width: 100%;
    height: 10rem;
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
    text-align: center;
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
      rgba(0, 0, 0, 0.5) 80%,
      rgba(0, 0, 0, 0.7) 100%
    );
    z-index: -10;
    border-radius: ${theme.borderRadius.default};
    transition: opacity ${theme.transitions.default.duration};
  }
`;

const Information = styled.div`
  color: ${props => props.theme.colors.white.light};
  margin: 0.5rem;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 90%;
  overflow: hidden;
  white-space: nowrap;
`;

const Title = styled.div`

  text-transform: capitalize;
  font-size: .8rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  color: #ccc;
  span {
    font-size: 0.8rem
  }

`;

const ShopName = styled.div`
  margin: 0;
  margin-bottom: 0.2rem;
  text-transform: capitalize;
  font-size: .6rem;
  color: #ccc;
  span {
    font-size: 0.8rem
  }

`;

const Price = styled.div`
  font-size: 0.6rem;
  margin: 0 0 0.25rem 0 !important;
  color: #ccc;
  float: right;
`;

const StyledDialog = styled(Dialog)`
@media (max-width: 600px) {
  width: 90vw;
  padding: 1.5rem;
  margin: 11vh auto 5vh auto;
}
.dialogTitle {
  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
}

.shopname {
    display: none;
}

.dialogDescription {
height: 9rem;
overflow: auto;
border-bottom: 1px dotted #ccc;
margin-top: 0.5rem;
}

[data-reach-dialog-content] {
  @media (max-width: 600px) {

  }
}
.dialogImage{
  text-align:center;
  min-width: 40%;
}

.dialogImageDescription {
  display : flex;
  img {
    max-height : 14rem;
    max-width: 80%;
    margin-right: 3%;
  }
  span {
    padding-left: 0rem;
  }

  @media (max-width: 600px) {
    display : block;
    img {
      max-height : 12rem;
      margin: auto;

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

  //console.log("**** props=AlgoliaProductItem=", props)
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
      emprezzoID: hit.emprezzoID,
      shopName: hit.shopName,
      description: hit.description,
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

  return (
    <Wrapper>
      {props && props.hit &&
        <>
          <Image>
            <a href={`/shops/${props.hit.emprezzoID}/`} title={props.hit.name && props.hit.name.toLowerCase()} target="_blank">
              {props.hit.imageURL &&
                <img src={props.hit.imageURL} />
              }
            </a>
          </Image>

          <StyledLink href="javascript:void(0)" onClick={() => openDialog()} title={props.hit.shopName}>
            <Information>
              <ShopName>{(props.hit.shopName || "").substring(0, 22)}   {props.hit.maxPrice > props.hit.price &&
                <strike>${props.hit.maxPrice}</strike>
              }
                {` `}${props.hit.price}</ShopName>
              <Title>{props.hit.name && props.hit.name.toLowerCase().substring(0, 24)}</Title>

              {props.hit.price &&
                <Price>

                </Price>
              }
            </Information>
          </StyledLink>



          <StyledDialog isOpen={showDialog} onDismiss={closeDialog}>
            <button className="close-button" onClick={closeDialog} style={{ float: "right", cursor: "pointer" }}>
              <span aria-hidden>X</span>
            </button>
            <div className="dialogImageDescription">
              <div className="dialogImage">
                {props.hit.imageURL &&
                  <img src={props.hit.imageURL} />
                }
              </div>
              <div className="dialogRight">
                <h3 style={{ 'font-size': '1.1rem', 'margin-bottom': '9px' }}>{props.hit.name}</h3>
                <span style={{ 'margin-bottom': '12px', 'font-style': 'italic' }}><a href={`/shops/${props.hit.emprezzoID}/`}>{props.hit.shopName || props.hit.name}</a> ${props.hit.price}</span>
                <div className="dialogDescription">{props.hit.description && props.hit.description}</div>
                {convertToSelectList(props.hit.VariantTitle)}
              </div>
            </div>
            <br />
            <div>
              <a href={props.hit.productURL} target="_blank" className="button">Shop at {props.hit.shopName}</a>
              <a href="javascript:" onClick={() => addToCartWrapper(props.hit)} className="button buttonalt">Save for later</a>
              {(props.hit.name || "").toLowerCase().indexOf("gift card") >= 0 &&
                <ShopifyCart
                  quantity={1}
                  customAttributes={[
                    {
                      key: "productName",
                      value: props.hit.name
                    }, {
                      key: "price",
                      value: "" + props.hit.price
                    }, {
                      key: "imageURL",
                      value: props.hit.imageURL
                    }, {
                      key: "productURL",
                      value: props.hit.productURL
                    }, {
                      key: "productID",
                      value: "" + props.hit.productID
                    }, {
                      key: "shopName",
                      value: "" + props.hit.shopName
                    }
                  ]}
                />
              }
            </div>

          </StyledDialog>
        </>
      }
    </Wrapper>
  );
}

export default AlgoliaProductItem;
