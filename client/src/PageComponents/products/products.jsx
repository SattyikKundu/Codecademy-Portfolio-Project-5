import React from "react";
import Product from "../productDetails/productDetails";

const Products = ({products}) => { /* Presents products in grid format (like in actual E-commerece sites) */

    return (
      <>
        <div className="products-wrapper">
            <div className="products-grid">
                {
                products.map((product) => (<Product key={product.id} product={product} />))
                }
            </div>
        </div>
      </>
    );
}

export default Products;

