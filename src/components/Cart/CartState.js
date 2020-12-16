import React from "react";
import useGlobalHook from "use-global-hook";
import Client from 'shopify-buy';
import _ from 'lodash';

const initialState = {
    isCartOpen: false,
    client: null,
    checkout: { lineItems: [] },
    products: [],
    giftcardProduct: {},
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
                storefrontAccessToken: '0c291ce7693710e4baf0db2cf74576ca',
                domain: 'emprezzo.myshopify.com'
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
            res.map((item) => {
                console.log(item.id, item.title, item.id, item.variants[0].id)
            })
            //Gift card exchange
            const giftCardPlaceholder = _.filter(res, (item) => item.id == "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzYxNTU3NjU1NDcxODM=")
            store.setState({ products: giftCardPlaceholder });
            //emprezzo gift card
            const gcProduct = _.filter(res, (item) => item.id == "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzYxNTU3NzE1NzY0OTU=")
            store.setState({ giftcardProduct: gcProduct[0] });
        });
    },
    initializeShops: (store) => {
        store.state.client.shop.fetchInfo().then((res) => {
            store.setState({ shop: res });
        });
    },
    addVariantToCart: (store, quantity, customAttributes) => {
        store.setState({
            isCartOpen: true,
        });
        const variantId = "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zNzg0ODk5MTAwNjg5NQ==";
        customAttributes = customAttributes || [];
        const lineItemsToAdd = [{ variantId, quantity: parseInt(quantity, 10), customAttributes }]
        const checkoutId = store.state.checkout.id
        return store.state.client.checkout.addLineItems(checkoutId, lineItemsToAdd).then(res => {
            store.setState({ checkout: res });
        });
    },
    addGiftCardToCart: (store, variantId, quantity, customAttributes) => {
        store.setState({
            isCartOpen: true,
        });
        //const variantId = "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zNzg0OTAwMTAzMzkwMw==";
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
