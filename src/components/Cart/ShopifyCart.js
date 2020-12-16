import React from 'react'
import Products from './components/Products';
import Cart from './components/Cart';
import './ShopifyCart.css';
import useGlobal from "./CartState"

const ShopifyCart = (props) => {

    const [globalState, globalActions] = useGlobal();

    React.useEffect(() => {
        if (globalState.client == null) {
            globalActions.initializeStoreClient()
            globalActions.initializeCheckout();
            globalActions.initializeProducts();
            globalActions.initializeShops();
        }
    }, [globalState.client]);

    return (
        <div className="App">
            {/* {!globalState.isCartOpen &&
                <div className="App__view-cart-wrapper">
                    <button className="App__view-cart1" onClick={() => globalActions.handleCartOpen()}>Cart</button>
                </div>
            } */}
            {/* <Products
                products={globalState.products}
                client={globalState.client}
                addVariantToCart={globalActions.addVariantToCart}
            /> */}
            <button className="Product__buy button" onClick={() => globalActions.addVariantToCart(props.quantity, props.customAttributes)}>Add to Cart</button>
            <Cart
                checkout={globalState.checkout}
                isCartOpen={globalState.isCartOpen}
                handleCartClose={globalActions.handleCartClose}
                updateQuantityInCart={globalActions.updateQuantityInCart}
                removeLineItemInCart={globalActions.removeLineItemInCart}
            />
        </div>
    );
}

export default ShopifyCart;