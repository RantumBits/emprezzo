import React, { useContext } from 'react';
import { PlusCircleIcon, MinusCircleIcon, TrashIcon } from './icons'
import { CartContext } from './CartContext';
import { formatNumber } from './utils';
import styled from '@emotion/styled';

const CartItemWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0.5rem 0 0.5rem 0;
  @media (max-width: 700px) {
    display: block;
  }
`;
const CartElementSmall = styled.div`
    padding: .5rem;    
    flex: 0 0 16.6666666667%;
    max-width: 16.6666666667%;
`;
const CartElementBig = styled.div`
    padding: .5rem;    
    flex: 0 0 50%;
    max-width: 50%;
`;
const ProductName = styled.h5`
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: .25rem;
`;
const Price = styled.p`
    font-size: .875rem;
    font-weight: 200;
    margin-bottom: .25rem;
    margin-top: 0;
`;
const Quantity = styled.p`
    margin-bottom: 0;
`;
const ButtonsWrapper = styled.span`
    .btn {
        cursor: pointer;
        font-size: 10px;
        margin-right: .5rem;
        margin-bottom: .25rem;
        text-align: center;
        vertical-align: middle;  
        color: #fff;
        background-color: #1a1a1a;
        border-color: #1a1a1a;
    }
    .btn-alt {
        background-color: #d9534f;
        border-color: #d9534f;
    }
`;

const CartItem = ({ product }) => {

    const { increase, decrease, removeProduct } = useContext(CartContext);

    return (
        <CartItemWrapper>
            <CartElementSmall>
                <img
                    alt={product.name}
                    style={{ margin: "0 auto", maxHeight: "50px" }}
                    src={product.photo} className="img-fluid d-block" />
            </CartElementSmall>
            <CartElementBig>
                <ProductName>{product.name}</ProductName>
                <Price>Price: {formatNumber(product.price)} </Price>
            </CartElementBig>
            <CartElementSmall>
                <Quantity>Qty: {product.quantity}</Quantity>
            </CartElementSmall>
            <CartElementSmall>
                <ButtonsWrapper>
                    <button className="btn" onClick={() => increase(product)}>
                        <PlusCircleIcon width={"20px"} />
                    </button>
                    {product.quantity > 1 &&
                        <button className="btn btn-alt"  onClick={() => decrease(product)}>
                            <MinusCircleIcon width={"20px"} />
                        </button>
                    }

                    {product.quantity === 1 &&
                        <button className="btn btn-alt"  onClick={() => removeProduct(product)}>
                            <TrashIcon width={"20px"} />
                        </button>
                    }
                </ButtonsWrapper>
            </CartElementSmall>
        </CartItemWrapper>
    );
}

export default CartItem;