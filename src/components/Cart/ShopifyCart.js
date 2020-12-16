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



//productID  "10651656584"

export const addItemToCart = (item) => {
    const client = getStoreClient();
    console.log("Cart Client = ", client)

    //Create checkout
    /*
    client.checkout.create().then((checkout) => {
        console.log(checkout);
    });
    */

    //Fetch product (to be added to cart) by id
    /*
    client.product.fetchAll().then((products) => {
        console.log("products", products);
        products.map((product) => {
            console.log("product.handle", product.handle);
        })
    });
    */

    // Adding Line Item to the cart
    /*
    const checkoutId = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0SW1hZ2UvMTgyMTc3ODc1OTI='; // ID of an existing checkout
    const lineItemsToAdd = [
        {
            variantId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8yOTEwNjAyMjc5Mg==',
            quantity: 5,
            customAttributes: [{ key: "MyKey", value: "MyValue" }]
        }
    ];
    // Add an item to the checkout
    client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
        console.log(checkout.lineItems); // Array with one additional line item
    });
    */
}