import React from "react";
import useGlobalHook from "use-global-hook";
import Client from 'shopify-buy';
import _ from 'lodash';
import { isBrowser } from './utils'
import fetch from 'node-fetch';
import regeneratorRuntime from "regenerator-runtime";
import * as contentful from 'contentful-management';

const setLocalStorage = (value) => {
    if (isBrowser()) {
        window.localStorage.setItem('shopifycart', JSON.stringify(value));
    }
}

const getLocalStorage = () => {
    return ((isBrowser() && window.localStorage.getItem('shopifycart')) ? JSON.parse(window.localStorage.getItem('shopifycart')) : []);
}

const setUserToLocalStorage = (value) => {
    if (isBrowser()) {
        window.localStorage.setItem('shopifyuser', JSON.stringify(value));
    }
}

const getUserFromLocalStorage = () => {
    return ((isBrowser() && window.localStorage.getItem('shopifyuser')) ? JSON.parse(window.localStorage.getItem('shopifyuser')) : null);
}

const removeItemFromLocalStorage = (cart) => {
    if (isBrowser() && cart && cart.lineItems) {
        const newList = [];
        cart.lineItems.map((lineitem) => {
            newList.push({
                variantId: lineitem.variant.id,
                quantity: lineitem.quantity,
                customAttributes: lineitem.customAttributes
            })
        });
        setLocalStorage(newList)
    }
}

const createCustomerQuery = `mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }`;
const findCustomerQuery = `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }`;

const initialState = {
    isCartOpen: false,
    client: null,
    checkout: { lineItems: [] },
    products: [],
    giftcardExchangeProduct: {},
    giftcardProduct: {},
    pledgelingProduct: {},
    pledgelingAdded: false,
    shop: {},
    shopUrl: "emprezzo.myshopify.com",
    accessToken: "0c291ce7693710e4baf0db2cf74576ca",
    cfAccessToken: 'CF'+'PAT'+'-UjglQTu0UcIGgRtK9i44'+'_Lvh481GA7DAeGwNY32MKMA',
    cfSpaceID: 'lz0damvofaeg',
    cfClient: null,
    cfSavedStoresList: [],
    cfSavedProductsList: [],
    visibility: false,
    user: (getUserFromLocalStorage() !== null ? getUserFromLocalStorage() : {}),
    authenticated: (getUserFromLocalStorage() !== null),
    authMessage: "",
    isAuthDialogOpen: false,
    isRegisterDialogOpen: false
};

const actions = {
    addToCounter: (store, amount) => {
        const newCounterValue = store.state.counter + amount;
        store.setState({ counter: newCounterValue });
    },
    show: (store, change) => {
        store.setState({ visibility: change });
    },
    initializeContentfulClient: (store) => {
        if (store.state.cfClient == null) {
            const localClient = contentful.createClient({
                accessToken: store.state.cfAccessToken
            });
            store.setState({ cfClient: localClient });
        }
    },
    initializeStoreClient: (store) => {
        if (store.state.client == null) {
            const localClient = Client.buildClient({
                storefrontAccessToken: store.state.accessToken,
                domain: store.state.shopUrl
            });
            store.setState({ client: localClient });
        }
    },
    initializeCheckout: (store) => {
        store.state.client.checkout.create().then((res) => {
            store.setState({ checkout: res });

            //getting from localstorage if it exists
            const lineItemsToAdd = getLocalStorage();
            if (lineItemsToAdd) {
                const checkoutId = store.state.checkout.id
                return store.state.client.checkout.addLineItems(checkoutId, lineItemsToAdd).then(response => {
                    store.setState({ checkout: response });
                });
            }
        });
    },
    initializeProducts: (store) => {
        store.state.client.product.fetchAll().then((res) => {
            // res.map((item) => {
            //     console.log(item.id, item.title, item.id, item.variants.length, item.variants[0].id)
            // })
            store.setState({ products: res });
            //Gift card exchange
            const giftCardPlaceholder = _.filter(res, (item) => item.id == "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzYxNTU3NjU1NDcxODM=")
            store.setState({ giftcardExchangeProduct: giftCardPlaceholder[0] });
            //emprezzo gift card
            const gcProduct = _.filter(res, (item) => item.id == "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzYxNTU3NzE1NzY0OTU=")
            store.setState({ giftcardProduct: gcProduct[0] });
            //pledgeling 
            const pledgeProduct = _.filter(res, (item) => item.id == "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzYxNTU3OTg4Mzk0NzE=")
            store.setState({ pledgelingProduct: pledgeProduct[0] });
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
        const variantId = store.state.giftcardExchangeProduct.variants[0].id;
        customAttributes = customAttributes || [];
        customAttributes.push({
            key: "uniqueID",
            value: "" + (new Date().getTime())
        })
        const lineItemsToAdd = [{ variantId, quantity: parseInt(quantity, 10), customAttributes }]
        setLocalStorage(_.concat(getLocalStorage(), lineItemsToAdd)); //add item to localstorage
        const checkoutId = store.state.checkout.id
        return store.state.client.checkout.addLineItems(checkoutId, lineItemsToAdd).then(res => {
            store.setState({ checkout: res });
        });
    },
    addGiftCardToCart: (store, variantId, quantity, customAttributes) => {
        store.setState({
            isCartOpen: true,
        });
        customAttributes = customAttributes || [];
        customAttributes.push({
            key: "uniqueID",
            value: "" + (new Date().getTime())
        })
        const lineItemsToAdd = [{ variantId, quantity: parseInt(quantity, 10), customAttributes }]
        setLocalStorage(_.concat(getLocalStorage(), lineItemsToAdd)); //add item to localstorage
        const checkoutId = store.state.checkout.id
        return store.state.client.checkout.addLineItems(checkoutId, lineItemsToAdd).then(res => {
            store.setState({ checkout: res });
        });
    },
    addPledgelingToCart: (store, variantId, quantity, customAttributes) => {
        store.setState({
            isCartOpen: true,
        });
        customAttributes = customAttributes || [];
        customAttributes.push({
            key: "uniqueID",
            value: "" + (new Date().getTime())
        })
        const lineItemsToAdd = [{ variantId, quantity: parseInt(quantity, 10), customAttributes }]
        const checkoutId = store.state.checkout.id
        return store.state.client.checkout.addLineItems(checkoutId, lineItemsToAdd).then(res => {
            store.setState({
                checkout: res,
                pledgelingAdded: true
            });
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
        const itemBeingRemoved = _.filter(store.state.checkout.lineItems, (item) => item.id == lineItemId)
        return store.state.client.checkout.removeLineItems(checkoutId, [lineItemId]).then(res => {
            removeItemFromLocalStorage(res);
            store.setState({
                checkout: res
            });
            //checking if the pledgeling item is remove then show the buy pledgeling button
            if (itemBeingRemoved[0].variant.product.id == store.state.pledgelingProduct.id) {
                store.setState({
                    pledgelingAdded: false
                });
            }
        });
    },
    handleCartOpen: (store) => {
        store.setState({ isCartOpen: true });
    },
    handleCartClose: (store) => {
        store.setState({ isCartOpen: false });
    },
    openRegisterDialog: (store) => {
        store.setState({ isRegisterDialogOpen: true, authMessage: "" });
    },
    closeRegisterDialog: (store) => {
        store.setState({ isRegisterDialogOpen: false });
    },
    openAuthDialog: (store) => {
        store.setState({ isAuthDialogOpen: true, authMessage: "" });
    },
    closeAuthDialog: (store) => {
        store.setState({ isAuthDialogOpen: false });
    },    
    registerUser: (store, user) => {
        store.setState({ authMessage: "" });
        const params = {
            query: createCustomerQuery,
            variables: {
                input: {
                    "email": user.email,
                    "password": user.password
                }
            }
        }
        const optionsQuery = {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-Shopify-Storefront-Access-Token": store.state.accessToken
            },
            body: JSON.stringify(params)
        };

        fetch(`https://` + store.state.shopUrl + `/api/graphql`, optionsQuery)
            .then(res => res.json())
            .then(response => {
                console.log("=============== Response from Create Customer Call ===============", response);
                console.log(JSON.stringify(response, null, 4))
                if (response.data && response.data.customerCreate) {
                    if (response.data.customerCreate.customer) {
                        const localUser = {
                            email: user.email
                        }
                        setUserToLocalStorage(localUser)
                        console.log("***** getuser", getUserFromLocalStorage())
                        store.setState({ authMessage: "User registered and Logged in Successfully", user: localUser, authenticated: (getUserFromLocalStorage() !== null) });
                    }
                    if (!!response.data.customerCreate.customerUserErrors.length) {
                        setUserToLocalStorage(null)
                        store.setState({ authMessage: response.data.customerCreate.customerUserErrors[0].message, authenticated: false });
                    }
                }
                if (response.errors) {
                    setUserToLocalStorage(null)
                    store.setState({ authMessage: response.errors[0].message, authenticated: false });
                }
            });
    },
    signinUser: (store, user) => {
        store.setState({ authMessage: "" });
        const params = {
            query: findCustomerQuery,
            variables: {
                input: {
                    "email": user.email,
                    "password": user.password
                }
            }
        }
        const optionsQuery = {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-Shopify-Storefront-Access-Token": store.state.accessToken
            },
            body: JSON.stringify(params)
        };

        fetch(`https://` + store.state.shopUrl + `/api/graphql`, optionsQuery)
            .then(res => res.json())
            .then(response => {
                console.log("=============== Response from Find Customer Call ===============", response);
                // console.log(JSON.stringify(response, null, 4))
                if (response.data && response.data.customerAccessTokenCreate) {
                    if (response.data.customerAccessTokenCreate.customerAccessToken) {
                        const localUser = {
                            email: user.email
                        }
                        setUserToLocalStorage(localUser)
                        console.log("***** getuser", getUserFromLocalStorage())
                        store.setState({ authMessage: "Login Successful", user: localUser, authenticated: (getUserFromLocalStorage() !== null) });
                    }
                    if (!!response.data.customerAccessTokenCreate.customerUserErrors.length) {
                        setUserToLocalStorage(null)
                        store.setState({ authMessage: response.data.customerAccessTokenCreate.customerUserErrors[0].message, authenticated: false });
                    }
                }
                if (response.errors) {
                    setUserToLocalStorage(null)
                    store.setState({ authMessage: response.errors[0].message, authenticated: false });
                }
            });
    },
    signoutUser: (store) => {
        setUserToLocalStorage(null)
        store.setState({ authMessage: "Logged Out Successfully", user: {}, authenticated: false });
    },
    getSavedStores: (store) => {
        console.log("*** About to GET SavedStores", store.state.user)
        if (store.state.user.email) {
            actions.initializeContentfulClient(store);
            store.state.cfClient.getSpace(store.state.cfSpaceID).then((space) => {
                space.getEnvironment('master').then((environment) => {
                    environment.getEntries({ 'content_type': 'customerSavedStores', 'fields.customerEmail': store.state.user.email }).then((entries) => {
                        if (entries.items && entries.items.length > 0) {
                            const savedStores = entries.items[0].fields['savedStores']['en-US'];
                            store.setState({ cfSavedStoresList: savedStores });
                        }
                    })
                })
            })
        }
    },
    findInSavedStores: (store, shop) => {
        console.log("*** About to FIND in SavedStores", store.state.user, store.state.cfSavedStoresList)
        if (store.state.user.email) {
            const filteredStores = store.state.cfSavedStoresList && store.state.cfSavedStoresList.stores && _.filter(store.state.cfSavedStoresList.stores, item => item.emprezzoID == shop.emprezzoID)
            return filteredStores && filteredStores.length > 0;
        }
    },
    addToSavedStores: (store, shop) => {
        console.log("*** About to add SavedStores", store.state.user)
        if (store.state.user.email) {
            actions.initializeContentfulClient(store);
            store.state.cfClient.getSpace(store.state.cfSpaceID).then((space) => {
                space.getEnvironment('master').then((environment) => {
                    environment.getEntries({ 'content_type': 'customerSavedStores', 'fields.customerEmail': store.state.user.email }).then((entries) => {
                        if (entries.items && entries.items.length > 0) {
                            const existingStores = entries.items[0].fields['savedStores']['en-US']['stores'];
                            //add the store to list if it doesnot already exist
                            if (!!!existingStores.find(item => item.emprezzoID === shop.emprezzoID)) {
                                existingStores.push(shop)
                                entries.items[0].update()
                                store.setState({ cfSavedStoresList: existingStores });
                            }
                        }
                        else { // if this is first item for the customer then create content in contentful
                            environment.createEntry('customerSavedStores', {
                                fields: {
                                    customerEmail: { 'en-US': store.state.user.email },
                                    savedStores: { 'en-US': { title: "Default", stores: [shop] } }
                                }
                            }).then((entry) => {console.log("New entry created successfully",entry); getSavedStores(store)})
                                .catch(console.error)
                        }
                    })
                })
            })
        }
    },
    getSavedProducts: (store) => {
        console.log("*** About to GET SavedProducts", store.state.user)
        if (store.state.user.email) {
            actions.initializeContentfulClient(store);
            store.state.cfClient.getSpace(store.state.cfSpaceID).then((space) => {
                space.getEnvironment('master').then((environment) => {
                    environment.getEntries({ 'content_type': 'customerSavedProducts', 'fields.customerEmail': store.state.user.email }).then((entries) => {
                        if (entries.items && entries.items.length > 0) {
                            const savedProducts = entries.items[0].fields['savedProducts']['en-US'];
                            store.setState({ cfSavedProductsList: savedProducts });
                        }
                    })
                })
            })
        }
    },
    addToSavedProducts: (store, product) => {
        console.log("*** About to add SavedProducts", store.state.user)
        if (store.state.user.email) {
            actions.initializeContentfulClient(store);
            store.state.cfClient.getSpace(store.state.cfSpaceID).then((space) => {
                space.getEnvironment('master').then((environment) => {
                    environment.getEntries({ 'content_type': 'customerSavedProducts', 'fields.customerEmail': store.state.user.email }).then((entries) => {
                        if (entries.items && entries.items.length > 0) {
                            const existingProducts = entries.items[0].fields['savedProducts']['en-US']['products'];
                            //add the store to list if it doesnot already exist
                            if (!!!existingProducts.find(item => item.id === product.id)) {
                                existingProducts.push(product)
                                entries.items[0].update()
                                store.setState({ cfSavedProductsList: existingProducts });
                            }
                        }
                        else { // if this is first item for the customer then create content in contentful
                            environment.createEntry('customerSavedProducts', {
                                fields: {
                                    customerEmail: { 'en-US': store.state.user.email },
                                    savedProducts: { 'en-US': { title: "Default", products: [product] } }
                                }
                            }).then((entry) => console.log("New entry created successfully",entry))
                                .catch(console.error)
                        }
                    })
                })
            })
        }
    },
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
