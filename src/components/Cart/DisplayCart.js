import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { CartContext } from './CartContext';
import CartItem from './CartItem';
import { formatNumber } from './utils';

const Wrapper = styled.div`
  text-align: center;
`;
const CartWrapper = styled.div`
  justify-content: center;
  @media (max-width: 600px) {
    display: block;
  }
`;
const CartItems = styled.div`
  padding-top: 1rem;
  width: 100%;
`;
const CartSummary = styled.div`
    padding: 1rem 0 1rem 0;
`;
const CartSummaryBody = styled.div`
    display: flex;
    flex-direction: row;
    background-clip: border-box;
    border: 1px solid rgba(0,0,0,.125);
    flex: 1 1 auto;
    min-height: 1px;
    padding: 1.25rem;
    @media (max-width: 600px) {
        flex-direction: column;
    }
`;
const CartSummaryElement = styled.div`
    padding: .5rem;    
    flex: 0 0 25%;
    max-width: 25%;
    @media (max-width: 600px) {
        flex: 0 0 99%;
        max-width: 99%;
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
                            <CartSummaryElement></CartSummaryElement>
                            <CartSummaryElement>
                                <div>Total Items: </div><h4>{itemCount}</h4>
                            </CartSummaryElement>
                            <CartSummaryElement>
                                <div>Total Payment: </div><h3>{formatNumber(total)}</h3>
                            </CartSummaryElement>
                            <CartSummaryElement>
                                <div>
                                    <button type="button" className="button" onClick={clearCart}>CLEAR</button>
                                </div>
                            </CartSummaryElement>
                        </CartSummaryBody>
                    </CartSummary>
                </CartWrapper>
            }
        </Wrapper>
    );
}

export default DisplayCart;