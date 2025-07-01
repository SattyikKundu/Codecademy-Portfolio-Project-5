import { useLocation, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // used to import FontAwesomeIcons
import { faInfo, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import './menuAbout.css';

const AboutPageButton = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const isAbout = location.pathname.includes('/about'); // returns true if url path has '/about'

    return (
      <>
        <div 
            className={isAbout ? 'about-bttn-selected' : 'about-bttn-container'}
            onClick = {() => {navigate('/about');}}
        >
          <FontAwesomeIcon icon={faCircleInfo} className='about-icon'/>
        </div>
      </>
    );
}

export default AboutPageButton;

