import React, { Component } from 'react';

class LineItem extends Component {
  constructor(props) {
    super(props);

    this.decrementQuantity = this.decrementQuantity.bind(this);
    this.incrementQuantity = this.incrementQuantity.bind(this);
  }

  decrementQuantity(lineItemId) {
    const updatedQuantity = this.props.line_item.quantity - 1
    this.props.updateQuantityInCart(lineItemId, updatedQuantity);
  }

  incrementQuantity(lineItemId) {
    const updatedQuantity = this.props.line_item.quantity + 1
    this.props.updateQuantityInCart(lineItemId, updatedQuantity);
  }

  getCustomAttribute(key) {
    const allCustAttrs = this.props.line_item.customAttributes || []
    let value = "";
    allCustAttrs.map((attr) => {
      //console.log(attr.key, attr.value)
      if (attr.key == key)
        value = attr.value
    })
    return value;
  }

  render() {
    const itemTitle = (this.getCustomAttribute("shopName")+" Gift Card") || this.props.line_item.title
    const itemPrice = this.getCustomAttribute("price") || this.props.line_item.variant.price || 0
    return (
      <li className="Line-item">
        <div className="Line-item__img">
          <img  src={this.getCustomAttribute("imageURL") || this.props.line_item.variant.image.src} alt={`${this.props.line_item.title} product shot`} />
        </div>
        <div className="Line-item__content">
          <div className="Line-item__content-row">
            {/* <div className="Line-item__variant-title">
              {this.props.line_item.variant.title}
            </div> */}
            <span className="Line-item__title">
              {itemTitle}
            </span>
          </div>
          <div className="Line-item__content-row">
            <div className="Line-item__quantity-container">
              <button className="Line-item__quantity-update" onClick={() => this.decrementQuantity(this.props.line_item.id)}>-</button>
              <span className="Line-item__quantity">{this.props.line_item.quantity}</span>
              <button className="Line-item__quantity-update" onClick={() => this.incrementQuantity(this.props.line_item.id)}>+</button>
            </div>
            <span className="Line-item__price">
              $ {(this.props.line_item.quantity * itemPrice).toFixed(2)}
            </span>
            <button className="Line-item__remove" onClick={() => this.props.removeLineItemInCart(this.props.line_item.id)}>×</button>
          </div>
        </div>
      </li>
    );
  }
}

export default LineItem;
