import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" />
            <p></p>
             
        </div>
        <div className="footer-content-center">
        <h2>Chef's Place: Good Food</h2> 
        <ul>
            <li>Home</li>
            <li>About-us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
        </ul>
        </div>
        <div className="footer-content-right">
            <h2>Get In Touch</h2>
            <ul>
                <li>+91 9419087054</li>
                <li>contact@chefsplace.com</li>
            </ul>
        </div>
      </div>
      <hr/>
      <p className='footer-copyright'>© 2024 Chef's Place. All rights reserved. </p>
    </div>
  )
}

export default Footer
