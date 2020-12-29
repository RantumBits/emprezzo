import React, { useCallback, useContext } from 'react';
import { useBlockstack, didConnect, useConnectOptions, useFile } from 'react-blockstack';
import { showBlockstackConnect } from '@blockstack/connect'
import styled from '@emotion/styled';
import { CartContext } from './CartContext';
import CartItem from './CartItem';
import { formatNumber, isBrowser } from './utils';
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

const StyledList = styled.ul`
    list-style: none;
    padding-top: 1rem;
    border-top: 1px solid black;
    span {
        padding-right: 2rem;
    }
`;
const Title = styled.h2`
  margin: 1rem;
  width: -webkit-fill-available;
`;
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
    flex: 0 0 33%;
    max-width: 33%;
    @media (max-width: 600px) {
        flex: 0 0 99%;
        max-width: 99%;
    }
`;

const connectOptions = isBrowser() ? {
    redirectTo: '/',
    finished: ({ userSession }) => {
        didConnect({ userSession })
    },
    appDetails: {
        name: "Emprezzo",
        icon: "https://emprezzo.com/logo/logo.png"
    }
} : {};

const DisplayCart = () => {
    const { signOut, authenticated } = useBlockstack();
    const authOptions = useConnectOptions(connectOptions);
    const signIn = useCallback(() => {
        showBlockstackConnect(authOptions)
    }, [authOptions])
    const cartPersistPath = "emprezzocart"
    const [cartContent, setCartContent] = useFile(cartPersistPath);
    const [cartName, setCartName] = React.useState("");
    const allCarts = cartContent ? JSON.parse(cartContent || []) : []

    const { total, cartItems, itemCount, clearCart, refreshCart, checkout, handleCheckout } = useContext(CartContext);

    const [loaded, setLoaded] = React.useState(false)
    React.useEffect(() => {
        if (!loaded) {
            setLoaded(true);
            refreshCart();
        }
    }, [loaded]);

    const persistCart = () => {
        const newItem = {
            name: cartName,
            cart: (isBrowser() && window.localStorage.getItem('cart')) ? window.localStorage.getItem('cart') : null
        }
        allCarts.push(newItem)
        console.log("allCarts", allCarts)
        setCartContent(JSON.stringify(allCarts))
    }
    const loadCart = (name) => {
        if (isBrowser()) {
            const foundCart = _.filter(allCarts, item => item.name === name)
            if (foundCart && foundCart.length > 0) {
                window.localStorage.setItem('cart', foundCart[0].cart);
                refreshCart();
            }
        }
    }

    const [showDialog, setShowDialog] = React.useState(false);
    const openDialog = () => {
        setCartName("");
        setShowDialog(true);
    }
    const closeDialog = () => setShowDialog(false);

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
                            <CartSummaryElement>
                                <div>Total Items: </div><h4>{itemCount}</h4>
                            </CartSummaryElement>
                            <CartSummaryElement>
                                <div>Total Payment: </div><h3>{formatNumber(total)}</h3>
                            </CartSummaryElement>
                            <CartSummaryElement>
                                <div>
                                    <button
                                        className="button"
                                        disabled={!signIn && !signOut}
                                        onClick={!authenticated ? signIn : openDialog}
                                    >
                                        Save Current Cart
                                    </button>
                                    <button type="button" className="button" onClick={clearCart}>CLEAR</button>
                                </div>
                            </CartSummaryElement>
                        </CartSummaryBody>
                    </CartSummary>
                </CartWrapper>
            }
            {authenticated &&
                <>
                    <div style={{display: "flex"}}>
                        <div><button className="button" disabled={!signIn && !signOut} onClick={signOut}>Logout</button></div>
                        {allCarts && allCarts.length > 0 && <Title>Existing Cart(s) List</Title>}
                    </div>                    
                    {allCarts && allCarts.map((thisCart) => (
                        <StyledList>
                            <li>
                                <span>{thisCart.name}</span>
                                <button className="button" onClick={() => loadCart(thisCart.name)}>Load Cart</button>
                            </li>
                        </StyledList>
                    ))}
                    <Dialog isOpen={showDialog} onDismiss={closeDialog}>
                        <button className="close-button" onClick={closeDialog} style={{ float: "right", cursor: "pointer" }}>
                            <span aria-hidden>X</span>
                        </button>
                        <div>
                            <label>Cart Name : </label>
                            <input value={cartName} onChange={e => setCartName(e.target.value)} />
                        </div>
                        <br />
                        <div>
                            <button className="button" onClick={() => { persistCart(); closeDialog(); }}>Persist(Save) Cart</button>
                        </div>
                    </Dialog>
                </>
            }
        </Wrapper>
    );
}

export default DisplayCart;