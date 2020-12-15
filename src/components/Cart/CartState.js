import React from "react";
import useGlobalHook from "use-global-hook";
import Client from 'shopify-buy';
import _ from 'lodash';

const initialState = {
    isCartOpen: false,
    client: null,
    checkout: { lineItems: [] },
    products: [],
    shop: {},
    visibility: false
};

const actions = {
    addToCounter: (store, amount) => {
        const newCounterValue = store.state.counter + amount;
        store.setState({ counter: newCounterValue });
    },
    show: (store, change) => {
        store.setState({ visibility: change });
    },
    initializeStoreClient: (store) => {
        if (store.state.client == null) {
            const localClient = Client.buildClient({
                storefrontAccessToken: 'df2587edeb636a70f1fcdbcf4ff2a8ed',
                domain: 'ecomloop-com.myshopify.com'
            });
            store.setState({ client: localClient });
        }
    },
    initializeCheckout: (store) => {
        store.state.client.checkout.create().then((res) => {
            store.setState({ checkout: res });
        });
    },
    initializeProducts: (store) => {
        store.state.client.product.fetchAll().then((res) => {
            const giftCardPlaceholder = _.filter(res, (item) => item.id == "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzYxMjgxNzk0NDU5MzM=")
            //console.log("**** giftCardPlaceholder",giftCardPlaceholder)
            //Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzYxMjgxNzk0NDU5MzM=
            store.setState({ products: giftCardPlaceholder });
        });
    },
    initializeShops: (store) => {
        store.state.client.shop.fetchInfo().then((res) => {
            store.setState({ shop: res });
        });
    },
    addVariantToCart: (store, variantId, quantity, customAttributes) => {
        store.setState({
            isCartOpen: true,
        });
        customAttributes = customAttributes || [];
        const lineItemsToAdd = [{ variantId, quantity: parseInt(quantity, 10), customAttributes }]
        const checkoutId = store.state.checkout.id
        return store.state.client.checkout.addLineItems(checkoutId, lineItemsToAdd).then(res => {
            store.setState({ checkout: res });
        });
    },
    updateQuantityInCart: (store, lineItemId, quantity) => {
        const checkoutId = store.state.checkout.id
        const lineItemsToUpdate = [{ id: lineItemId, quantity: parseInt(quantity, 10) }]
        return store.state.client.checkout.updateLineItems(checkoutId, lineItemsToUpdate).then(res => {
            store.setState({ checkout: res });
        });
    },
    removeLineItemInCart: (store, lineItemId) => {
        const checkoutId = store.state.checkout.id

        return store.state.client.checkout.removeLineItems(checkoutId, [lineItemId]).then(res => {
            store.setState({ checkout: res });
        });
    },
    handleCartOpen: (store) => {
        store.setState({ isCartOpen: true });
    },
    handleCartClose: (store) => {
        store.setState({ isCartOpen: false });
    }
};

const useGlobal = useGlobalHook(React, initialState, actions);
export const connect = Component => {
    return props => {
        let [state, actions] = useGlobal();
        let _props = { ...props, state, actions };
        return <Component {..._props} />;
    };
};

export default useGlobal;
