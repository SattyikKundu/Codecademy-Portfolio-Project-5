import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // used to import FontAwesomeIcons
import { faUserLarge } from '@fortawesome/free-solid-svg-icons';

import './menuUserProfile.css';

const ProfileButton = () => {

    return (
      <>
        <div className='profile-bttn-container'>
          <FontAwesomeIcon icon={faUserLarge} className='user-icon' />
        </div>
      </>
    );
}

export default ProfileButton;