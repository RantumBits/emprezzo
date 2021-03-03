import React, { useContext } from 'react';
import useGlobal from "./CartState";
import ShopifyAuthentication from "./ShopifyAuthentication"
import _ from 'lodash'
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import {
    FaRegStar,
    FaStar,
} from 'react-icons/fa';

const AddShopToCartButton = ({ details }) => {
    const [globalState, globalActions] = useGlobal();
    const [showDialog, setShowDialog] = React.useState(false);
    const openDialog = () => {
        setShowDialog(true);
    }
    const closeDialog = () => setShowDialog(false);

    React.useEffect(() => {
        const allStores = globalState.cfSavedStoresList['stores'];
        if (globalState.authenticated && !allStores) {
            globalActions.getSavedStores();
        }
    }, [globalState.cfSavedStoresList['stores'], globalState.authenticated]);

    const saveShop = () => {
        if (globalActions.findInSavedStores(details)) return;
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
        <div style={{display: "inline", fontSize: "x-large"}}>
            <button onClick={globalState.authenticated ? saveShop : globalActions.openAuthDialog} style={{cursor: "pointer", backgroundColor: "white", color:"#C04CFD", border: "white", outline: "none"}}>
                {globalActions.findInSavedStores(details) && <FaStar />}
                {!globalActions.findInSavedStores(details) && <FaRegStar />}
            </button>
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
        </div>
    );
}

export default AddShopToCartButton;