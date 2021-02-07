import React, { useContext } from 'react';
import useGlobal from "./CartState";
import ShopifyAuthentication from "./ShopifyAuthentication"
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

const AddShopToCartButton = ({ details }) => {
    const [globalState, globalActions] = useGlobal();
    const [showDialog, setShowDialog] = React.useState(false);
    const openDialog = () => {
        setShowDialog(true);
    }
    const closeDialog = () => setShowDialog(false);

    const saveShop = () => {
        const shopToSave = {
            emprezzoID: details.emprezzoID,
            shopName: details.storeName,
            photo: details.storeProfileImage,
            productURL: details.storeURL,
            description: details.description,
        }
        globalActions.addToSavedStores(shopToSave);
        openDialog();
    }

    return (
        <>
            <button className="button" onClick={globalState.authenticated ? saveShop : globalActions.openAuthDialog}>Save Shop</button>
            <ShopifyAuthentication />
            <Dialog isOpen={showDialog} onDismiss={closeDialog}>
                <button className="close-button" onClick={closeDialog} style={{ float: "right", cursor: "pointer" }}>
                    <span aria-hidden>X</span>
                </button>
                <div>Store saved Successfully. <br /><a href="/savedstores">Click Here</a> to see the saved store list</div>
                <br />
                <div>
                    <button className="button" onClick={() => { closeDialog(); }}>Close</button>
                </div>
            </Dialog>
        </>
    );
}

export default AddShopToCartButton;