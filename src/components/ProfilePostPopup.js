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
  <div className='popup'>  
    <div className='popup-content'>  
      <div>
        <button className="close-button" onClick={this.props.closePopup}> X </button>  
      </div>
      
      <div className="post-content">
        <h1> Create a Post </h1>
        <input className="input" name="post-content"/>
        <button className="submit-button" onClick={this.handleSubmit}> Post </button>
      </div>
      

    </div>  
  </div>  
  );  
  }  
}  

export default Popup;