import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // used to import FontAwesomeIcons
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

import './menuCartBttn.css';

const CartButton = ({toggleCart}) => {
    return (
      <>
        <div className='cart-bttn-container'
        onClick={toggleCart}
        >
          <FontAwesomeIcon icon={faCartShopping} className='cart-icon'/>
        </div>
      </>
    );
}

export default CartButton;