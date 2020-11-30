import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { CartContext } from './CartContext';
import CartItem from './CartItem';
import { formatNumber } from './utils';

const Wrapper = styled.div`
  text-align: center;
`;
const CartWrapper = styled.div`
  display: flex;
  justify-content: center;
  @media (max-width: 700px) {
    display: block;
  }
`;
const CartItems = styled.div`
  padding: 1rem;
  width: 80%;
`;
const CartSummary = styled.div`
    padding: 1rem 0 1rem 0;
    width: 20%;
`;
const CartSummaryBody = styled.div`
    text-align: left;
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 1px solid rgba(0,0,0,.125);
    flex: 1 1 auto;
    min-height: 1px;
    padding: 1.25rem;

    p {
        font-size: .875rem;
        font-weight: 200;
        margin-bottom: .25rem;
        margin-top: 0;
    }    
`;

const DisplayCart = () => {
    const { total, cartItems, itemCount, clearCart, checkout, handleCheckout } = useContext(CartContext);

    return (
        <Wrapper>
            {cartItems.length <= 0 &&
                <div>Your cart is empty</div>
            }
            {cartItems.length > 0 &&
                <CartWrapper>
                    <CartItems>
                        {cartItems.map(product => <CartItem key={product.id} product={product} />)}
                    </CartItems>
                    <CartSummary>
                        <CartSummaryBody>
                            <p>Total Items</p>
                            <h4>{itemCount}</h4>
                            <p>Total Payment</p>
                            <h3>{formatNumber(total)}</h3>
                            <hr />
                            <div>
                                <button type="button" className="button" onClick={clearCart}>CLEAR</button>
                            </div>
                        </CartSummaryBody>
                    </CartSummary>
                </CartWrapper>
            }
        </Wrapper>
    );
}

export default DisplayCart;