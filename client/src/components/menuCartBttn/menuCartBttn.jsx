import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // used to import FontAwesomeIcons
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

import './menuCartBttn.css';

const CartButton = () => {

    return (
      <>
        <div className='cart-bttn-container'>
          <FontAwesomeIcon icon={faCartShopping} className='cart-icon' />
        </div>
      </>
    );
}

export default CartButton;