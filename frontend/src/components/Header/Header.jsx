import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Order your favourite food here!</h2>
        <p>From menu browsing to doorstep delivery, your delicious journey starts here.</p>
        <button>View menu</button>
      </div>
    </div>
  ) 
}

export default Header