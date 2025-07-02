import FooterBottom from '../../PageComponents/footerBottom/footerBottom';
import { useNavigate, NavLink } from 'react-router-dom';

import './AboutPage.css';

const AboutPage = () => {

  const navigate = useNavigate();

  return (
    <div className="about-page-full" data-bg-var-repaint>
       <div className='about-container' >
        <h1 id='about-header'>About Us</h1>
        <div className='about-body'>
          <div className='about-body-block-1'>
            <div className='about-img-container-1'>
              <img 
                src="/images/Fish_tank_an_Exotic_life_in_Chatsworth.jpg" 
                alt="Fish tank — Exotic Life in Chatsworth" 
                className='about-image'
              />
            </div>
            <p>
              Welcome to <span id='about-store-name'>Reef Budz</span> — your one-stop destination for beautiful sea creatures and corals for your saltwater reef tank. As enthusiasts who love the beauty and biodiversity of coral reefs, we aim to bring vibrant marine animals and healthy, aquacultured corals directly to you.
            </p>
          </div>
          <div className='about-body-block-2'>
            <p>
              From colorful fishes and branching corals to detritivorous crabs and cleaner shrimp, our focus is on responsibly sourced, tank-raised specimens that are reef-safe and full of personality. Our goal is to help you build your own thriving ecosystem that reflects the living reefs of the Florda coast and beyond.
            </p>
          </div>
          <div className='about-body-block-3'>
            <div className='about-img-container-2'>
              <img 
                src="/images/Reef_tank_at_Monterey_Bay_Aquarium.jpg" 
                alt="Reef tank — Monterey Bay Aquarium" 
                className='about-image'
              />
            </div>
            <p>
              Every coral and creature we ship is hand-inspected, ensuring health, coloration, and acclimation readiness. Whether you're starting your first nano reef or curating a large mixed reef display, we're here to help your tank come to life with motion and color. Come see our diverse selection!
            </p>
          </div>
        </div>
        <div className='about-disclaimer'>
          <h2>DISCLAIMER:</h2>
          <div>
            <p>This is a demo site built for portfolio purposes to showcase my full stack development skills.</p>
            <p>While it includes real E-commerce features like account registration, cart, and checkout flows, no actual products are for sale and no payments are processed.</p>
            <p>To test the checkout, you can register a fake account and use Stripe's test cards from this <a href="https://docs.stripe.com/testing#cards" target="_blank" rel="noopener noreferrer"><em>link</em></a>.</p>
          </div>
        </div>
        {/* NOTE: While '/' does lead to the products page, the acutal products page url is '/products/all'. 
          *       Using '/' causes redirect to '/products/all' in App.jsx, and redirectss cause navigation history to wipe out;
          *       this means the browser's 'back' button can't be used to go back to 'About' page from 'Products' page.
          *       Hence, the actual url path, '/products/all', needs to be used to enable backwards navigation.
          */}
        <button className='about-continue-shopping-button' onClick={() => navigate('/products/all')}>Continue Shopping</button>
      </div>
      <FooterBottom />
    </div>
  );
}

export default AboutPage;
