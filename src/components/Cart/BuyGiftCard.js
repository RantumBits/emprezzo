import React from 'react'
import Cart from './components/Cart';
import VariantSelector from './components/VariantSelector';
import useGlobal from "./CartState"
import styled from '@emotion/styled';
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

const StyledDialog = styled(Dialog)`
@media (max-width: 600px) {
  width: 90vw;
}
.dialogTitle {
  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
}

.shopname {
    display: none;
}

.dialogDescription {
height: 9rem;
overflow: auto;
border-bottom: 1px dotted #ccc;
margin-top: 0.5rem;
}

[data-reach-dialog-content] {
  @media (max-width: 600px) {

  }
}
.dialogImage{
  text-align:center;
  min-width: 40%;
}

.dialogImageDescription {
  display : flex;
  img {
    max-height : 14rem;
    max-width: 80%;
    margin-right: 3%;
  }
  span {
    padding-left: 0rem;
  }

  @media (max-width: 600px) {
    display : block;
    img {
      max-height : 12rem;
      margin: auto;

    }
    span {
      padding-left: 0rem;
    }
  }
}
`;

const BuyGiftCard = (props) => {

    const [globalState, globalActions] = useGlobal();

    const [selectedVariant, setSelectedVariant] = React.useState((globalState.giftcardProduct && globalState.giftcardProduct.variants && globalState.giftcardProduct.variants[0]));
    const [selectedVariantImage, setSelectedVariantImage] = React.useState();

    let defaultOptionValues = {};
    globalState.giftcardProduct && globalState.giftcardProduct.options && globalState.giftcardProduct.options.forEach((selector) => {
        defaultOptionValues[selector.name] = selector.values[0].value;
    });
    const [selectedOptions, setSelectedOptions] = React.useState(defaultOptionValues);

    const [showDialog, setShowDialog] = React.useState(false);
    const openDialog = () => {
        setSelectedVariant(globalState.giftcardProduct && globalState.giftcardProduct.variants && globalState.giftcardProduct.variants[0])
        setShowDialog(true);
    }
    const closeDialog = () => setShowDialog(false);

    React.useEffect(() => {
        if (globalState.client == null) {
            globalActions.initializeStoreClient()
            globalActions.initializeCheckout();
            globalActions.initializeProducts();
            globalActions.initializeShops();
        }
    }, [globalState.client]);

    let variantImage = selectedVariantImage || (globalState.giftcardProduct && globalState.giftcardProduct.images && globalState.giftcardProduct.images[0])
    let variantQuantity = 1
    let variantSelectors = globalState.giftcardProduct.options && globalState.giftcardProduct.options.map((option) => {
        return (
            <VariantSelector
                key={option.id.toString()}
                option={option}
                handleOptionChange={handleOptionChange}
            />
        );
    });

    function handleOptionChange(event) {
        const target = event.target
        let currentSelectedOptions = selectedOptions;
        currentSelectedOptions[target.name] = target.value;
        const selectedVariant = globalState.client.product.helpers.variantForOptions(globalState.giftcardProduct, currentSelectedOptions)
        setSelectedVariant(selectedVariant)
        setSelectedVariantImage(selectedVariant.attrs.image)
    }

    return (
        <div className="GiftCard--BuyButton">
            {globalState.giftcardProduct &&
                <>
                    <button className="Product__buy button" onClick={() => openDialog()}>Buy Emprezzo Gift Card</button>
                    <br/><small>a single card for hundreds of amazing stores </small>
                    <Cart
                        checkout={globalState.checkout}
                        isCartOpen={globalState.isCartOpen}
                        handleCartClose={globalActions.handleCartClose}
                        updateQuantityInCart={globalActions.updateQuantityInCart}
                        removeLineItemInCart={globalActions.removeLineItemInCart}
                    />
                    <StyledDialog isOpen={showDialog} onDismiss={closeDialog}>
                        <button className="close-button" onClick={closeDialog} style={{ float: "right", cursor: "pointer" }}>
                            <span aria-hidden>X</span>
                        </button>
                        <div className="dialogImageDescription">
                            <div className="dialogImage">
                            {variantImage &&
                                <img src={variantImage.src} />
                            }
                            </div>
                            <div className="dialogRight">
                                <h3>{globalState.giftcardProduct.title}</h3>
                                <p><i>${selectedVariant && selectedVariant.price}</i></p>
                                <p>{variantSelectors}</p>
                                  <div className="dialogDescription">{globalState.giftcardProduct.description && globalState.giftcardProduct.description}</div>
                            </div>
                        </div>
                        <br />
                        <div>
                            <button className="Product__buy button" onClick={() => { globalActions.addGiftCardToCart(selectedVariant.id,variantQuantity); closeDialog(); }}>Add to cart</button>
                        </div>
                    </StyledDialog>
                </>
            }
        </div >
    );
}

export default BuyGiftCard;
