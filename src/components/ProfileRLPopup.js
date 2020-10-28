import React, { Component, useEffect, useState } from 'react';
import RadarList from './RadarList'
import '../styling/ProfilePopup.css';  


export default function PopUp(props) {
  const closePopup = props.closePopup;
  const radarList = props.radarList;

  return (
    <div className='profile-popup' onClick={closePopup}>  
    <div className='profile-popup-popup-content' onClick = {(e) => { e.stopPropagation(); }}>  
      <RadarList RadarList={radarList}/>
      
    </div>  
  </div>  
  )
}