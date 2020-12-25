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

const BuyPledgeling = (props) => {

  const [globalState, globalActions] = useGlobal();

  React.useEffect(() => {
    if (globalState.client == null) {
      globalActions.initializeStoreClient()
      globalActions.initializeCheckout();
      globalActions.initializeProducts();
      globalActions.initializeShops();
    }
  }, [globalState.client]);

  const [selectedVariant, setSelectedVariant] = React.useState();
  const [selectedVariantImage, setSelectedVariantImage] = React.useState();

  let defaultOptionValues = {};
  globalState.pledgelingProduct && globalState.pledgelingProduct.options && globalState.pledgelingProduct.options.forEach((selector) => {
    defaultOptionValues[selector.name] = selector.values[0].value;
  });
  const [selectedOptions, setSelectedOptions] = React.useState(defaultOptionValues);
  const [selectedRadioOption, setSelectedRadioOption] = React.useState();

  React.useEffect(() => {
    if (globalState.pledgelingProduct && globalState.pledgelingProduct.options && globalState.pledgelingProduct.options[0].values && globalState.pledgelingProduct.options[0].values[0]) {
      setSelectedRadioOption(globalState.pledgelingProduct.options[0].values[0].value)
    }
    if(globalState.pledgelingProduct && globalState.pledgelingProduct.variants){
      setSelectedVariant(globalState.pledgelingProduct.variants[0])
    }
  }, [globalState.pledgelingProduct, selectedRadioOption]);

  let variantQuantity = 1

  function handleOptionChange(event) {
    const target = event.target
    let currentSelectedOptions = selectedOptions;
    currentSelectedOptions[target.name] = target.value;
    const selectedVariant = globalState.client.product.helpers.variantForOptions(globalState.pledgelingProduct, currentSelectedOptions)
    setSelectedVariant(selectedVariant)
    setSelectedVariantImage(selectedVariant.attrs.image)
  }

  function handleRadioChange(event) {
    setSelectedRadioOption(event.target.value)
    handleOptionChange(event)
  }

  return (
    <div className="GiftCard--BuyButton">

      {globalState.pledgelingProduct && !globalState.pledgelingAdded &&

        <>
          <b style={{ marginBottom: "0.75rem", fontSize: "1rem" }}>Help provide meals</b><br />
          <small>We're matching donations made through the end of 2020!</small>
          {globalState.pledgelingProduct.options && globalState.pledgelingProduct.options.map((option) => {
            return (
              <div style={{ display: "block" }}>
                {option.values.map((item, index) => {
                  return (
                    <div style={{ display: "flex" }}>
                      <input
                        style={{ margin: "0.5rem" }}
                        type="radio"
                        name={option.name}
                        value={item.value}
                        key={`${option.name}-${item.value}`}
                        checked={selectedRadioOption == item.value}
                        onChange={handleRadioChange}
                      />
                      <span>{`${item.value}`}</span>
                    </div>
                  )
                })}
              </div>
            )
          })}
          <button className="Product__buy button buttonalt" onClick={() => { globalActions.addPledgelingToCart(selectedVariant.id, variantQuantity); }}>Make a donation</button>
        </>
      }
    </div >
  );
}

export default BuyPledgeling;
