import React, { useCallback, useContext } from 'react';
import styled from '@emotion/styled';
import CartItemShop from './Cart/CartItemShop';
import _ from 'lodash';
import useGlobal from "../components/Cart/CartState";

const Title = styled.h2`
  margin: 1rem;
  width: -webkit-fill-available;
`;
const Wrapper = styled.div`
  text-align: left;
  width: 100%;
`;
const CartWrapper = styled.div`
  justify-content: left;
  padding: 1rem;
  @media (max-width: 600px) {
    display: block;
    padding: 1rem;
  }
`;
const CartSection = styled.div`
  display: flex;
  @media (max-width: 600px) {
    display: block;
  }
`;
const CartItems = styled.div`
  padding-top: 1rem;
  width: 100%;
`;
const CartItem = styled.div`
    border-top: 1px solid rgba(0,0,0,.125);
`;

const DisplaySavedStores = () => {

    const [globalState, globalActions] = useGlobal();

    const [loaded, setLoaded] = React.useState(false)

    React.useEffect(() => {
        if (globalState.authenticated && !loaded) {
            setLoaded(true);
            globalActions.getSavedStores();
        }
    }, [loaded, globalState.authenticated]);
    const allStores = globalState.cfSavedStoresList['stores'];

    return (
        <Wrapper>            
            <CartWrapper>
                <CartSection>
                    <CartItems>
                        <h3>Saved Shops</h3>
                        {globalState.authenticated && !allStores &&
                            <div>Loading...</div>
                        }
                        {globalState.authenticated && allStores && allStores.length <= 0 &&
                            <CartItemWrapper>Your list is empty</CartItemWrapper>
                        }
                        {globalState.authenticated && allStores && allStores.length > 0 &&
                            allStores.map((shop, index) => {
                                const storeDetail = {
                                    ...shop,
                                    name: shop.shopName
                                }
                                return (
                                    <CartItem key={index}>
                                        <CartItemShop shop={storeDetail} />
                                    </CartItem>
                                );
                            })
                        }
                    </CartItems>
                </CartSection>
            </CartWrapper>
        </Wrapper>
    );
}

export default DisplaySavedStores;