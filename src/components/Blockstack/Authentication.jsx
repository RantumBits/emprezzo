import React, { useCallback, useContext } from 'react';
import { useBlockstack, didConnect, useConnectOptions, useFile } from 'react-blockstack';
import { showBlockstackConnect } from '@blockstack/connect'
import { isBrowser } from '../Cart/utils'
import { CartContext } from '../Cart/CartContext'

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
    const persistCart = () => {
        setCartContent((isBrowser() && window.localStorage.getItem('cart')) ? JSON.stringify(window.localStorage.getItem('cart')) : null)
    }
    const loadCart = () => {
        if (isBrowser()) {
            window.localStorage.setItem('cart', JSON.parse(cartContent || []));
            refreshCart();
        }
    }

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
                    <button className="button" onClick={persistCart}>Persist(Save) Cart</button>
                    <button className="button" onClick={loadCart}>Load Cart</button>
                    <div>{cartContent}</div>
                </>
            }
        </div>
    );
}

export default Authentication;