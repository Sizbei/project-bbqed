import React from 'react';  
import '../styling/TheZoneReportPopup.css';
import {AuthContext} from '../Context/AuthContext';

class ReportPopup extends React.Component {  
  static contextType = AuthContext;

  constructor(props){
    super(props);
    this.state = {
      //user: 'user1',
      totalReports: 0,
      reported: false,

    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeBody = this.onChangeBody.bind(this);
  
  }
  
  onChangeBody(e) {
    //console.log("Post: " + e.target.value)
    
    this.setState ({
      totalReports: this.totalReports + 1,
      reported: true,
      
    }, () => this.onSubmit(e))
    
  }
  
  onSubmit() {

  }
  handleSubmit(event) {
    if (/^\s+$/.test(this.state.reported) || !this.state.reported) {
      this.setState({
        showError: true,
      })
      console.log("popup-error:" + this.state.showError);
    }
    else {
      fetch('/zone/reportPost', {
        reportedTotal: this.reportedTotal + 1,
        reported: true,

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
        <h1> Would you like to report this post? </h1>
        <div className="tzone-post-buttons">
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