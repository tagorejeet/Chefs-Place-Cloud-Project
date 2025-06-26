import React from 'react';
import './Header.css';

const Header = () => {
  const scrollToMenu = () => {
    const section = document.getElementById('explore-menu');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn('Element with id "explore-menu" not found');
    }
  };

  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Order your favourite food here!</h2>
        <p>From menu browsing to doorstep delivery, your delicious journey starts here.</p>
        <button onClick={scrollToMenu}>View menu</button>
      </div>
    </div>
  );
};

export default Header;
