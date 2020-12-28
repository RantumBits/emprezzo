import React, { useCallback, useContext } from 'react';
import { useBlockstack, didConnect, useConnectOptions, useFile } from 'react-blockstack';
import { showBlockstackConnect } from '@blockstack/connect'
import { isBrowser } from '../Cart/utils'
import { CartContext } from '../Cart/CartContext'
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import styled from '@emotion/styled';

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

// Authentication button adapting to status
const Authentication = (props) => {

    const { signOut, authenticated } = useBlockstack();
    const authOptions = useConnectOptions(connectOptions);
    const signIn = useCallback(() => {
        showBlockstackConnect(authOptions)
    }, [authOptions])

    const { refreshCart } = useContext(CartContext);
    const cartPersistPath = "emprezzocart"
    const [cartContent, setCartContent] = useFile(cartPersistPath);
    const [cartName, setCartName] = React.useState("");

    const allCarts = cartContent ? JSON.parse(cartContent || []) : []

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
        <div>
            <button
                className="button"
                disabled={!signIn && !signOut}
                onClick={!authenticated ? signIn : signOut}
            >
                {!authenticated ? 'Sign In' : authenticated ? 'Log Out' : '...'}
            </button>
            {authenticated &&
                <>
                    <button className="button" onClick={openDialog}>Persist(Save) Current Cart</button>                    
                    {allCarts && allCarts.length > 0 && <Title>Existing Cart(s) List</Title>}
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
        </div>
    );
}

export default Authentication;