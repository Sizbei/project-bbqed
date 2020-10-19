import React, {Component} from 'react';
import axios from 'axios';
import '../styling/EditProfile.css'
import Header from './Header';

function ErrorMessage(props) {
  const flag = props.flag;
  const text = props.text;

  if (flag) {
    return <span className="error-message"> {text} </span>;
  } else {
    return null;
  }
} 

export default class Example extends Component {
    constructor(props) {
        super(props);

        //Binds to methods that listen for events
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleImageLoad = this.handleImageLoad.bind(this);
        this.handleImageError = this.handleImageError.bind(this);
        this.urlChangeHandler = this.urlChangeHandler.bind(this);

        //variables
        this.state = {
          status: '',
          about: '' ,
          interest: '',
          prevImage: 'https://i.imgur.com/55sUslQ.png',
          image: 'https://i.imgur.com/55sUslQ.png',
          imageLoaded: true,
          showImageSubmit: false
        }
    }
      
    //One of react's lifecycle methods - method is called before displaying this component
    componentDidMount() {
        axios.get('http://localhost:5000/settings/profile')
        .then(response => {
          if (response.data.length > 0) {
            this.setState({
              prevImage: response.data.image,
              image: response.data.image,
              status: response.data.status,
              about: response.data.about,
              interest: response.data.interest,
            })
          }
        })
        .catch((error) => {
          console.log(error);
        })
    }

    //Listens for an event and sets the username state
    onChangeUsername(e) {
      this.setState({
        username: e.target.value
      })
    }

    onSubmit(e) {
      //prevents default html form submit from taking place
      e.preventDefault();
      //Creates a body for a db call with the current variables
      const exampleBody = {
        username: this.state.username
      }

      //Can check console - browser (inspect)
      console.log(exampleBody);

      //Connects the backend with the frontend
      axios.put('http://localhost:5000/settings/profile/update', exampleBody)
        .then(res => console.log(res.data));
      window.location = '/';

        this.setState({
            username: ''
        })
    }

    urlChangeHandler = (e) => {
      const url = e.target.value;
      
      this.setState({
        image: url
      })
    }

    handleImageLoad = () => {
      this.setState({imageLoaded: true})

      if (this.state.image != this.state.prevImage) {
        this.setState({ 
          showImageSubmit: true,
        })
      }
    }

    handleImageError = () => {
      this.setState({
        imageLoaded: false,
        showImageSubmit: false,
        image: this.state.prevImage
      })
    }
    
    render(){
      let imgSubmitBtn;
      // if (this.state.imageLoaded && (this.state.image != this.state.prevImage)) {
      //   imgSubmitBtn = <button className="image-submit">Update</button>
      // } else {
      //   imgSubmitBtn = null;
      // }
      if (this.state.showImageSubmit) {
        imgSubmitBtn = <button className="image-submit">Update</button>
      } else {
        imgSubmitBtn = null;
      }

      return (
        <div className="editprofile-container">
          <Header />
          
          <div className="container-middle-section"> 
              <h1> {'Profile Settings'} </h1> 
              <div className="information"> 
                  <div className="editPP-container">
                    <h2 className="title">Profile Picture</h2>
                    <div className="editPP-photo-container">
                      <div className="preview">
                        <div className="registration-photo">
                          <img src={this.state.image} key={this.state.image} className="registration-user-given-photo" alt="" onError={this.handleImageError} onLoad={this.handleImageLoad} />
                        </div>
                      </div>
                    </div>

                    <label>Profile Picture URL: </label>
                    <div className="editPP-input-container">
                      <input className="input-field" type="text" name="url" onChange={this.urlChangeHandler}/>
                      {imgSubmitBtn}
                    </div>
                    <ErrorMessage flag={!this.state.imageLoaded} text="Improper url." />
                  </div>

                  <h2 className="title">Status (optional)</h2>
                  <p className="content">{this.state.status}</p>
              
                  <h2 className="title"> About (optional)</h2>
                  <p className="content">{this.state.about}</p>
              
                  <h2 className="title">Interest (optional)</h2>
                  <p className="content">{this.state.interest}</p>
              </div>
               
          </div>

          <div className="save-changes">
            
          </div>


          </div>

      )
  }
}