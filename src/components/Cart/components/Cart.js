import React, { Component } from 'react';
import LineItem from './LineItem';
import useGlobal from "../CartState"
import Helmet from "react-helmet"

const Cart = (props) => {
  const [globalState, globalActions] = useGlobal();

  const openCheckout = () => {
    window.open(props.checkout.webUrl);
  }

  let line_items = props.checkout.lineItems.map((line_item) => {
    return (
      <LineItem
        updateQuantityInCart={props.updateQuantityInCart}
        removeLineItemInCart={props.removeLineItemInCart}
        key={line_item.id.toString()}
        line_item={line_item}
      />
    );
  });

  return (
    <div className={`Cart ${globalState.isCartOpen ? 'Cart--open' : ''}`}>
      <Helmet>
        <script id="plg-round-up" src="https://hello.pledgeling.com/assets/shop/round-up.js" async></script>
      </Helmet>
      <header className="Cart__header">
        <h2>Your cart</h2>
        <button
          onClick={() => globalActions.handleCartClose()}
          className="Cart__close">
          ×
          </button>
      </header>
      <ul className="Cart__line-items">
        {line_items}
      </ul>
      <footer className="Cart__footer">
        <div data-round-up-via-pledgeling="6132710932653"></div>
        <div className="Cart-info clearfix">
          <div className="Cart-info__total Cart-info__small">Subtotal</div>
          <div className="Cart-info__pricing">
            <span className="pricing">$ {props.checkout.subtotalPrice}</span>
          </div>
        </div>
        <div className="Cart-info clearfix">
          <div className="Cart-info__total Cart-info__small">Taxes</div>
          <div className="Cart-info__pricing">
            <span className="pricing">$ {props.checkout.totalTax}</span>
          </div>
        </div>
        <div className="Cart-info clearfix">
          <div className="Cart-info__total Cart-info__small">Total</div>
          <div className="Cart-info__pricing">
            <span className="pricing">$ {props.checkout.totalPrice}</span>
          </div>
        </div>
        <button className="Cart__checkout button" onClick={openCheckout}>Checkout</button>
      </footer>
    </div>
  )
}

export default Cart;
