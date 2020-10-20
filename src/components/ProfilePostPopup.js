import { render } from "@testing-library/react";
import React from 'react';  
import '../styling/ProfilePopup.css'  

class Popup extends React.Component {  
  render() {  
  return (  
  <div className='popup'>  
    <div className='popup-inner'>  
    <h1>{this.props.text}</h1>  
    <button onClick={this.props.closePopup}>close me</button>  
    </div>  
  </div>  
  );  
  }  
}  

export default Popup;