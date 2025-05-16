import React, {useEffect, useState} from "react";

//import * from '../../../../server/public/images';

const ProductCard = ({product}) => {

    const imgPath = `http://localhost:5000/images/${product.image_url}`; // file path for product image (must match port in server.js file)

    const [stockMessage, setStockMessage] = useState('In Stock'); // Message on product's stock
    const [stockState, setStockState]     = useState('stocked');  // used to define style for <div> holding stockMessage

    const checkStockState = () => { // function checks products stock and return message
        if(product.stock > 10) {
            setStockMessage('In Stock');
            setStockState('stocked');
        }
        else if (product.stock<=10 && product.stock>1) {
            setStockMessage(`Only ${product.stock} left`);
            setStockState('low');
        }
        else if (product.stock===0) {
            setStockMessage('Out of Stock');
            setStockState('none');
        }
        else { // throw error if stock value invalid/unavailable
            console.error(`Unable to retrieve stock of ${stock.display_name}`);
            throw error; 
        }
    }

    useEffect(() => {
        checkStockState();
    },[product, product.stock]); // function run on mount or when product (or product.stock) changes

    return (
      <>
        <div className="product-card">
            <div className="image-wrapper">
                <img src={imgPath} alt={product.display_name} className="product-image" />
            </div>
            <div className='description'>Click for Description</div>
            <div className="add-button-wrapper">
                <div className="add-button">
                    Add to Cart
                </div>
                <div className={`${stockState}`}>
                    {stockMessage}
                </div>
            </div>
        </div>
      </>
    );
};

export default ProductCard;

