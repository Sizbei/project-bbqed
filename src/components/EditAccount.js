import React, {Component} from 'react';
import toastr from 'toastr'
import '../styling/EditProfile.css'
import '../styling/toastr.min.css'
import {AuthContext} from '../Context/AuthContext';

export default class EditAccount extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);

        //Binds to methods that listen for events
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onChangeAbout = this.onChangeAbout.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        //variables
        this.state = {
          //username: '',
          status: '',
          about: '' ,
          interest: [],
          image: '',
          nextImage: '',
          imageNoError: true,
          showImageSubmit: false,
          imgInputValue: '',
          imageSelect: null,
          statusCharacters: 30,
          aboutCharacters: 300,
        }
    }
      
    //One of react's lifecycle methods - method is called before displaying this component

    
    componentDidMount() {
      fetch('/settings/profile/' + this.context.user.username).then(res => res.json())
      //axios.get('http://localhost:5000/settings/profile', send)
      .then(data => {
        console.log(data);
        console.log(data.length);
        this.setState({
          status: data.status,
          about: data.about,
          interest: data.interest,
          image: data.image,
          statusCharacters: 30 - data.status.length,
          aboutCharacters: 300 - data.about.length,
          nextImage: data.image
        })

      })
      .catch((error) => {
        console.log(error);
      })

      
    }

    onChangeStatus(e) {;

      this.setState({
        status: e.target.value,
        statusCharacters: 30 - e.target.value.length
      }, () => this.onSubmit(e));

      

    }

    onChangeAbout(e) {
      this.setState({
        about: e.target.value,
        aboutCharacters: 300 - e.target.value.length
      }, () => this.onSubmit(e))
    }

    
    onBlur = () => {      
      toastr.options = {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: "toast-bottom-full-width",
        preventDuplicates: true,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "2000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
      }
      toastr.clear()
      setTimeout(() => toastr.success('Profile Updated'), 300)
    }

    onSubmit() {
      //Creates a body for a db call with the current variables

      const updatedInfo = {
        username: this.context.user.username,
        status: this.state.status,
        about: this.state.about,
        image: this.state.image,
        interest: this.state.interest
      }
      console.log("submit ", updatedInfo)

      //Connects the backend with the frontend
      fetch('/settings/profile/update', {
        method :  "post",
        body : JSON.stringify(updatedInfo),
        headers: {
            'Content-Type' : 'application/json'
        }
      }).then(res => res.json())
      //axios.post('http://localhost:5000/settings/profile/update', updatedInfo)
      .then(data => {console.log(data)
      })
      .catch((error) => {
        console.log(error);
      })

    }
    
    render(){
      
      return (
        <div className="editprofile-container">
          <div className="editprofile-container-mid"> 
              
              <div className="info"> 
              <h1 className="editProfile-h1"> {'Profile Settings'} </h1> 

                  <hr className="settings-hr"></hr>
                  <h2 className="editProfile-h2">Email</h2>
                  <input type="text" placeholder="Status (optional)" id="timer" className="status-edit" maxLength="30" onBlur={this.onBlur} onChange={this.onChangeStatus} value={this.state.status}></input>
                  <label className="characters">Characters remaining: {this.state.statusCharacters}</label>
                  
                  <hr className="settings-hr"></hr>
                  <h2 className="editProfile-h2"> Password</h2>
                  <textarea type="text" placeholder="About (optional)" id="timer" className="about-edit" maxLength="300" onBlur={this.onBlur} onChange={this.onChangeAbout} value={this.state.about}></textarea>
                  <label className="characters">Characters remaining: {this.state.aboutCharacters}</label>

              </div>
          </div>
          
          </div>

      )
  }
}