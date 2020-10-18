import React, {Component} from 'react';
import axios from 'axios';
import Header from './Header';

export default class Example extends Component {
    constructor(props) {
        super(props);

        //Binds to methods that listen for events
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        //variables
        this.state = {
          status: '',
          about: '' ,
          interest: '',
          image: '',
        }
    }
      
    //One of react's lifecycle methods - method is called before displaying this component
    componentDidMount() {
        axios.get('http://localhost:5000/settings/profile')
        .then(response => {
          if (response.data.length > 0) {
            this.setState({
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
      axios.put('http://localhost:5000/example/add', exampleBody)
        .then(res => console.log(res.data));
      window.location = '/';

        this.setState({
            username: ''
        })
    }
    
    render(){
        
      return (
        <div className="container">
          <Header />
          


          <div className="container-middle-section"> 
              <h1> {'Profile Settings'} </h1> 
              <div className="information"> 
                  <h2 className="title">Status (optional)</h2>
                  <p className="content">{this.state.status}</p>
              
                  <h2 className="title"> About (optional)</h2>
                  <p className="content">{this.state.about}</p>
              
                  <h2 className="title">Interest (optional)</h2>
                  <p className="content">{this.state.interest}</p>

              </div>
               
          </div>         
          </div>
          
      )
  }
}

