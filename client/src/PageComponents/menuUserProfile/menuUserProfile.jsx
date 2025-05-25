import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // used to import FontAwesomeIcons
//import { faUserLarge } from '@fortawesome/free-solid-svg-icons';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

// <FontAwesomeIcon icon={faUserLarge} className='user-icon' />  for profile (logged in)
// <FontAwesomeIcon icon={faRightFromBracket} /> for signout

import './menuUserProfile.css';

const ProfileButton = () => {

    return (
      <>
        <div className='profile-bttn-container'>
          <FontAwesomeIcon icon={faRightToBracket} className='user-icon'/>
        </div>
      </>
    );
}

export default ProfileButton;