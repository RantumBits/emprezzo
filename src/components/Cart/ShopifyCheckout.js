import React from 'react';
import Helmet from 'react-helmet';

const ShopifyCheckout = (props) => {
    const buttonText = props.buttonText || "BUY GIFT CARD"
    const uniqueComponentID = props.uniqueComponentID || "6127692185773"
    return (
        <React.Fragment>
            <Helmet>
                <script type="text/javascript">
                    {`(function () {
                        let scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
                        if (window.ShopifyBuy) {
                            if (window.ShopifyBuy.UI) {
                            ShopifyBuyInit();
                            } else {
                            loadScript();
                            }
                        } else {
                            loadScript();
                        }
                        function loadScript() {
                            let script = document.createElement('script');
                            script.async = true;
                            script.src = scriptURL;
                            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
                            script.onload = ShopifyBuyInit;
                        }
                        function ShopifyBuyInit() {
                            let client = ShopifyBuy.buildClient({
                            domain: 'ecomloop-com.myshopify.com',
                            storefrontAccessToken: 'df2587edeb636a70f1fcdbcf4ff2a8ed',
                            });
                            ShopifyBuy.UI.onReady(client).then(function (ui) {
                            //skipp if the component with same ID is already created
                            var products = ui.components.product || []
                            var found = false;
                            for(i=0;i<products.length;i++){
                                if(products[i].id=="${uniqueComponentID}"){
                                    found = true;
                                    break;
                                }
                            }
                            //if(found) {return;}

                            ui.createComponent('product', {
                                id: '${uniqueComponentID}',
                                node: document.getElementById('product-component-${uniqueComponentID}'),
                                moneyFormat: '%24%7B%7Bamount%7D%7D',
                                options: {
                                    "product": {
                                        "styles": {
                                        "product": {
                                            "@media (min-width: 601px)": {
                                            "margin-left": "20px",
                                            "margin-bottom": "50px"
                                            }
                                        },
                                        "button": {
                                            "font-family": "'Overpass Mono','Consolas','Open Sans',-apple-system,'BlinkMacSystemFont','Segoe UI','Roboto','Helvetica','Arial',sans-serif",
                                            "font-size": "1em",


                                            "padding-top": "10.5px",
                                            "padding-bottom": "14.5px",
                                            ":hover": {
                                            "background-color": "#ad44e4"
                                            },
                                            "background-color": "#C04CFD",
                                            ":focus": {
                                            "background-color": "#ad44e4"
                                            },
                                              "box-shadow": "inset 0 -0.6em 0 -0.25em rgba(0,0,0,0.17)",
                                            "border-radius": "0px",
                                            "padding-left": "31px",
                                            "padding-right": "31px"
                                        },
                                        "quantityInput": {
                                            "font-size": "13px",
                                            "padding-top": "14.5px",
                                            "padding-bottom": "14.5px"
                                        },
                                        "price": {
                                          "font-family": "'Overpass Mono','Consolas','Open Sans',-apple-system,'BlinkMacSystemFont','Segoe UI','Roboto','Helvetica','Arial',sans-serif",
                                        },
                                        "compareAt": {
                                          "font-family": "'Overpass Mono','Consolas','Open Sans',-apple-system,'BlinkMacSystemFont','Segoe UI','Roboto','Helvetica','Arial',sans-serif",
                                        },
                                        "unitPrice": {
                                          "font-family": "'Overpass Mono','Consolas','Open Sans',-apple-system,'BlinkMacSystemFont','Segoe UI','Roboto','Helvetica','Arial',sans-serif",
                                        }
                                        },
                                        "buttonDestination": "modal",
                                        "contents": {
                                            "img": false,
                                            "title": false,
                                            "price": false,
                                            "options": false
                                        },
                                        "text": {
                                            "button": "${buttonText}"
                                        },
                                        "googleFonts": [
                                            "Overpass Mono"
                                        ]
                                    },
                                    "productSet": {
                                        "styles": {
                                        "products": {
                                            "@media (min-width: 601px)": {
                                            "margin-left": "-20px"
                                            }
                                        }
                                        }
                                    },
                                    "modalProduct": {
                                        "contents": {
                                        "img": false,
                                        "imgWithCarousel": true,
                                        "button": false,
                                        "buttonWithQuantity": true
                                        },
                                        "styles": {
                                        "product": {
                                            "@media (min-width: 601px)": {
                                            "max-width": "100%",
                                            "margin-left": "0px",
                                            "margin-bottom": "0px"
                                            }
                                        },
                                        "button": {
                                          "font-family": "'Overpass Mono','Consolas','Open Sans',-apple-system,'BlinkMacSystemFont','Segoe UI','Roboto','Helvetica','Arial',sans-serif",
                                            "font-size": "13px",
                                            "padding-top": "14.5px",
                                            "padding-bottom": "14.5px",
                                            ":hover": {
                                            "background-color": "#ad44e4"
                                            },
                                            "background-color": "#c04cfd",
                                            ":focus": {
                                            "background-color": "#ad44e4"
                                            },
                                            "border-radius": "5px",
                                            "padding-left": "31px",
                                            "padding-right": "31px"
                                        },
                                        "quantityInput": {
                                            "font-size": "13px",
                                            "padding-top": "14.5px",
                                            "padding-bottom": "14.5px"
                                        },
                                        "title": {
                                            "font-family": "'Jost','Segoe UI','Roboto','Candal',-apple-system,'BlinkMacSystemFont','Segoe UI','Helvetica','Arial',sans-serif"
                                        },
                                        "price": {
                                            "font-family": "'Overpass Mono','Consolas','Open Sans',-apple-system,'BlinkMacSystemFont','Segoe UI','Roboto','Helvetica','Arial',sans-serif",
                                            "color": "#666"
                                        },
                                        "compareAt": {
                                          "font-family": "'Overpass Mono','Consolas','Open Sans',-apple-system,'BlinkMacSystemFont','Segoe UI','Roboto','Helvetica','Arial',sans-serif",
                                            "color": "#666"
                                        },
                                        "unitPrice": {
                                          "font-family": "'Overpass Mono','Consolas','Open Sans',-apple-system,'BlinkMacSystemFont','Segoe UI','Roboto','Helvetica','Arial',sans-serif",
                                            "color": "#666"
                                        },
                                        "description": {
                                            "font-family": "'Jost','Segoe UI','Roboto','Candal',-apple-system,'BlinkMacSystemFont','Segoe UI','Helvetica','Arial',sans-serif"
                                        }
                                        },
                                        "googleFonts": [
                                        "Montserrat",
                                        "Quantico"
                                        ],
                                        "text": {
                                        "button": "ADD TO CART"
                                        }
                                    },
                                    "option": {
                                        "styles": {
                                        "label": {
                                          "font-family": "'Overpass Mono','Consolas','Open Sans',-apple-system,'BlinkMacSystemFont','Segoe UI','Roboto','Helvetica','Arial',sans-serif",
                                        },
                                        "select": {
                                          "font-family": "'Overpass Mono','Consolas','Open Sans',-apple-system,'BlinkMacSystemFont','Segoe UI','Roboto','Helvetica','Arial',sans-serif",
                                        }
                                        },
                                        "googleFonts": [
                                        "Quantico"
                                        ]
                                    },
                                    "cart": {
                                        "styles": {
                                        "button": {
                                          "font-family": "'Overpass Mono','Consolas','Open Sans',-apple-system,'BlinkMacSystemFont','Segoe UI','Roboto','Helvetica','Arial',sans-serif",
                                            "font-size": "13px",
                                            "padding-top": "14.5px",
                                            "padding-bottom": "14.5px",
                                            ":hover": {
                                            "background-color": "#ad44e4"
                                            },
                                            "background-color": "#c04cfd",
                                            ":focus": {
                                            "background-color": "#ad44e4"
                                            },
                                            "border-radius": "5px"
                                        }
                                        },
                                        "text": {
                                        "total": "Subtotal",
                                        "notice": "",
                                        "button": "Checkout"
                                        },
                                        "contents": {
                                        "note": true
                                        },
                                        "googleFonts": [
                                        "Quantico"
                                        ]
                                    },
                                    "toggle": {
                                        "styles": {
                                        "toggle": {
                                          "font-family": "'Overpass Mono','Consolas','Open Sans',-apple-system,'BlinkMacSystemFont','Segoe UI','Roboto','Helvetica','Arial',sans-serif",
                                            "background-color": "#c04cfd",
                                            ":hover": {
                                            "background-color": "#ad44e4"
                                            },
                                            ":focus": {
                                            "background-color": "#ad44e4"
                                            }
                                        },
                                        "count": {
                                            "font-size": "13px"
                                        }
                                        },
                                        "googleFonts": [
                                        "Overpass Mono"
                                        ]
                                    }
                                },
                            });
                            });
                        }
                    })();
                `}
                </script>
            </Helmet>
            <span id={`product-component-${uniqueComponentID}`} />
        </React.Fragment>
    );
}

export default ShopifyCheckout;
