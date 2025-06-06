import Product from "../productCard/productCard";
import './products.css';

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