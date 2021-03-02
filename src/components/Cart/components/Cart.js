import React, { Component } from 'react';
import LineItem from './LineItem';
import useGlobal from "../CartState"
import BuyPledgeling from "../BuyPledgeling"
import Helmet from "react-helmet"
import "./Cart.css"
import styled from '@emotion/styled';

const StickyIcon = styled.div`
  position: fixed;
  top: 50%;
  left: calc(100vw - 61px);
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    left: calc(100vw - 46px);
  }
`

const Cart = (props) => {
  const [globalState, globalActions] = useGlobal();

  const openCheckout = () => {
    window.open(globalState.checkout.webUrl, "_blank", "location=no,status=no,width=400,height=580,top=200,left=600");
  }

  let line_items = globalState.checkout.lineItems.map((line_item) => {
    return (
      <LineItem
        updateQuantityInCart={globalActions.updateQuantityInCart}
        removeLineItemInCart={globalActions.removeLineItemInCart}
        key={line_item.id.toString()}
        line_item={line_item}
      />
    );
  });

  return (
    <>
      <div className={`Cart ${globalState.isCartOpen ? 'Cart--open' : ''}`}>
        <header className="Cart__header">
          <h3>Saved items</h3>
          <button
            onClick={() => globalActions.handleCartClose()}
            className="Cart__close">
            ×
          </button>
        </header>
        <h4>Products</h4>
        <ul className="Cart__line-items">
          {line_items}
        </ul>

        <h4>Shops</h4>
        <ul className="Cart__line-items">
          {line_items}
        </ul>
      {/**
        <ul>
          <BuyPledgeling />
        </ul>

        <footer className="Cart__footer">

          <div className="Cart-info clearfix">
            <div className="Cart-info__total Cart-info__small">Subtotal</div>
            <div className="Cart-info__pricing">
              <span className="pricing">$ {globalState.checkout.subtotalPrice}</span>
            </div>
          </div>
          <div className="Cart-info clearfix">
            <div className="Cart-info__total Cart-info__small">Taxes</div>
            <div className="Cart-info__pricing">
              <span className="pricing">$ {globalState.checkout.totalTax}</span>
            </div>
          </div>
          <div className="Cart-info clearfix">
            <div className="Cart-info__total Cart-info__small">Total</div>
            <div className="Cart-info__pricing">
              <span className="pricing">$ {globalState.checkout.totalPrice}</span>
            </div>
          </div>
          <button className="Cart__checkout button" onClick={openCheckout}>Checkout</button>
        </footer>
        **/}
      </div>
      {globalState.checkout.lineItems.length > 0 &&
        <StickyIcon className="shopify-buy__cart-toggle" onClick={() => globalActions.handleCartOpen()}>
          <div className="shopify-buy__cart-toggle__count" data-element="toggle.count">{globalState.checkout.lineItems.length}</div><svg xmlns="http://www.w3.org/2000/svg" className="shopify-buy__icon-cart shopify-buy__icon-cart--side" data-element="toggle.icon" viewBox="0 0 25 25" enable-background="new 0 0 25 25"><g className="shopify-buy__icon-cart__group"><path d="M24.6 3.6c-.3-.4-.8-.6-1.3-.6h-18.4l-.1-.5c-.3-1.5-1.7-1.5-2.5-1.5h-1.3c-.6 0-1 .4-1 1s.4 1 1 1h1.8l3 13.6c.2 1.2 1.3 2.4 2.5 2.4h12.7c.6 0 1-.4 1-1s-.4-1-1-1h-12.7c-.2 0-.5-.4-.6-.8l-.2-1.2h12.6c1.3 0 2.3-1.4 2.5-2.4l2.4-7.4v-.2c.1-.5-.1-1-.4-1.4zm-4 8.5v.2c-.1.3-.4.8-.5.8h-13l-1.8-8.1h17.6l-2.3 7.1z"></path><circle cx="9" cy="22" r="2"></circle><circle cx="19" cy="22" r="2"></circle></g></svg>
          <p className="shopify-buy--visually-hidden">cart</p>
        </StickyIcon>
      }
    </>
  )
}

export default Cart;
