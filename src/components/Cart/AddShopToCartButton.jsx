import React, { useContext } from 'react';
import { CartContext } from './CartContext'

const AddShopToCartButton = ({ details }) => {
    const { addProduct, cartItems } = useContext(CartContext);
    const isInCart = shop => {
        return !!cartItems.find(item => item.id === shop.id);
    }
    const addShopToCartWrapper = () => {
        const hitToProduct = {
            id: details.emprezzoID,
            type: "shop",
            name: details.storeName,
            price: 0,
            photo: details.storeProfileImage,
            productURL: details.storeURL,
            emprezzoID: details.emprezzoID,
            shopName: details.storeName,
            description: details.description,
        }
        //Add shop to cart only if it is not already present
        if (!isInCart(hitToProduct)) addProduct(hitToProduct);
    }

    return (
        <button className="button" onClick={addShopToCartWrapper}>Save Shop</button>
    );
}

export default AddShopToCartButton;