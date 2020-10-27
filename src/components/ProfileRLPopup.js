import React, { Component, useEffect, useState } from 'react';
import RadarList from './RadarList'
import '../styling/ProfilePopup.css';  


export default function PopUp(props) {
  const closePopup = props.closePopup;

  return (
    <div className='profile-popup'>  
    <div className='profile-popup-popup-content'>  
      <div>
        <button className="profile-popup-close-button" onClick={closePopup}> X </button>        
      </div>
      <RadarList/>
      
    </div>  
  </div>  
  )
}