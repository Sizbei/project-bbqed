import React, {Component} from 'react';
import axios from 'axios';
import '../styling/EditProfile.css'
import Header from './Header';

export default class Example extends Component {
    constructor(props) {
        super(props);

        //Binds to methods that listen for events
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onChangeAbout = this.onChangeAbout.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        //variables
        this.state = {
          username: 'user3',
          status: '',
          about: '' ,
          interest: '',
          image: ''
        }
    }
      
    //One of react's lifecycle methods - method is called before displaying this component

    
    componentDidMount() {

        const send = {
          params: {
            username: this.state.username
          }
        }

        axios.get('http://localhost:5000/settings/profile', send)
        .then(response => {
          console.log(response.data);
          console.log(response.data.length);
          this.setState({
            image: response.data.image,
            status: response.data.status,
            about: response.data.about,
            interest: response.data.interest,
            image: response.data.image
          })
          
        })
        .catch((error) => {
          console.log(error);
        })
    }

    onChangeStatus(e) {
      this.setState({
        status: e.target.value
      })
    }

    onChangeAbout(e) {
      this.setState({
        about: e.target.value
      })
    }

    onSubmit(e) {
      //prevents default html form submit from taking place
      e.preventDefault();
      //Creates a body for a db call with the current variables

      const updatedInfo = {
        username: this.state.username,
        status: this.state.status,
        about: this.state.about,
        image: this.state.image
      }

      //Connects the backend with the frontend
      axios.post('http://localhost:5000/settings/profile/update', updatedInfo)
      .then(response => {   
          
      })
      .catch((error) => {
        console.log(error);
      })

    }
    
    render(){
        
      return (
        
        <div className="editprofile-container">
          <Header />

          <form onSubmit={this.onSubmit}>
          <div className="container-middle-section"> 
              <h1> {'Profile Settings'} </h1> 
              <div className="information"> 
                  <h2 className="title">Status (optional)</h2>
                  <input type="text" className="content" onChange={this.onChangeStatus} value={this.state.status}></input>
                  <h2 className="title"> About (optional)</h2>
                  <input type="text" className="content" onChange={this.onChangeAbout} value={this.state.about}></input>
                  <button type="submit" className="saveButton">Save</button>
              </div>
          </div>
          </form>
          
          </div>

      )
  }
  
}

