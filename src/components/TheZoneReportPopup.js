import React from 'react';  
import '../styling/TheZoneReportPopup.css';
import {AuthContext} from '../Context/AuthContext';

class ReportPopup extends React.Component {  
  static contextType = AuthContext;
  

  constructor(props){
    super(props);
    this.state = {
      //user: 'user1',
      

      rId: props.postId,
      showError: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  
  }
  
 

  handleSubmit(event) {

    if(this.props.type === "post"){

    const body = {
      user: this.context.user.username,
      post: this.props.rId,
    }
    fetch('/zone/reportPost', {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
      }).then(res => res.json())
        //axios.post('http://localhost:5000/post/add', body)
        .then(data => {
          this.setState({
            
            done: true,
            showError: false,
          })
        })
        .catch((error) => {
          console.log(error);
    })
  }else if (this.props.type === "comment"){
      const body = {
        user: this.context.user.username,
        _id: this.props.rId
      }
      fetch('/reportComment', {
        method: "post",
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
        //axios.post('http://localhost:5000/post/add', body)
        .then(data => {
          this.setState({
            done: true,
            showError: false,
          })
        })
        .catch((error) => {
          console.log(error);
        })
  }


  }
  
  render() {  
  return (  
  <div className='tzrp-popup' onClick={this.props.closePopup}>
      <div className='tzrp-post-popup-content' onClick = {(e) => { e.stopPropagation(); }}>
    
      {this.state.done ? 
        <div className="tzrp-popup-content"> 
          <h1> Post Reported! </h1>
        </div>
      :
      <div className="tzrp-popup-content"> 
        <h1> Would you like to report? </h1>
        <div className="tzrp-report-buttons"> 
        <button className="tzrp-popup-close-button" onClick={this.props.closePopup}> Cancel </button>
        <button className="tzrp-popup-submit-button" onClick={this.handleSubmit}> Report </button>
        </div>
      </div>
      
      }
    </div>  
  </div>  
  );  
  }  
}  

export default ReportPopup;