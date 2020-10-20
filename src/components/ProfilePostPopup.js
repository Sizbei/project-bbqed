import { render } from "@testing-library/react";
import React from 'react';  
import '../styling/ProfilePopup.css'  

class Popup extends React.Component {  
  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    const data = {
      user: 'something'

    }
    alert('You have created post!')
  }
  render() {  
  return (  
  <div className='profile-popup'>  
    <div className='profile-popup-popup-content'>  
      <div>
        <button className="profile-popup-close-button" onClick={this.props.closePopup}> X </button>  
      </div>
      
      <div className="profile-popup-content">
        <h1> Create a Post </h1>
        <input className="profile-popup-input" name="post-content"/>
        <button className="profile-popup-submit-button" onClick={this.handleSubmit}> Post </button>
      </div>
      

    </div>  
  </div>  
  );  
  }  
}  

export default Popup;