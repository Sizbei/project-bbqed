import React, {Component, useDebugValue} from 'react';
import axios from 'axios';
import { PieChart } from 'react-minimal-pie-chart';
import '../styling/Profile.css'
import Header from './Header';


export default class Profile extends Component {
    constructor(props) {
        super(props);
        //console.log(props.location.pathname); 
        this.state = { 
            path: props.location.pathname,
            username: '',
            status: '',
            about: '' ,
            interest: '',
            image: 'https://i.imgur.com/55sUslQ.png',
            asc: 0,  
            new_post: '', 
        }
    }

    handleChangePost(event) {
        this.setState({new_post: event.target.value});
    }

    handleSubmit(event) {
        alert('A new post has been created ' + this.state.value);
        event.preventDefault();
      }
    componentDidMount(){ 

        axios.get('http://localhost:5000' + this.state.path)
        .then(response => {   
            this.setState({
                username: response.data.username,
                status: response.data.status,
                about: response.data.about,
                interest: response.data.interest,     
            }) 
        })
        .catch((error) => {
          console.log(error);
        })
        
    }
    
    render(){
        
        return (
            <div className="background">
                <Header/>
                <div className="container-profile"> 
                    <div className="profile-photo">
                        <img src={this.state.image} className="profile-user-given-photo"/>  
                        <label className="profile-user-score">{this.state.asc}</label>   
                        
                    </div>
                    
                </div>
                <div className="container-top-section">
                    <h1>{this.state.username}</h1>
                    <p>{this.state.status}</p>
                </div>
                <div className="container-middle-section"> 
                    <div className="left-content">

                        <h2 className="title"> About</h2>
                        <p className="content">{this.state.about}</p>

                        <div className="interest">
                        <h2 className="title">Interest</h2>
                        <p className="interest-content">
                            {this.state.interest}
                        </p>

                        <h2 className="title"> Radar List</h2>
                        <p className="content"> To be implemented </p>
                </div>
                    </div>

                    <div className="middle-content">
                        <form onSubmit={this.handleSubmit}>
                            <h2>
                            How are you Feeling Today? 
                            <input type="text" value={this.state.value} onChange={this.handleChangePost} />
                            </h2>
                            <input type="submit" value="Submit" />
                        </form>
                    </div>
                    
                                 
                    <div className="right-content">
                        <h2 className="title"> ACS History </h2>
                        <PieChart className="piechart"
                      data={[
                          { title: 'One', value: 10, color: '#61b305' },
                          { title: 'Two', value: 15, color: '#f8e871' },
                          { title: 'Three', value: 20, color: '#d30909' },
                          { title: 'Four', value: 5, color: ' #ff7e1f'}
                        ]}/>
                        <div className="asc-content"> 
                        
                            <table>
                                <tbody>
                                <tr>
                                    <td answer="pos" className="score-content">+10</td>
                                    <td>Picks</td>
                                    <td> 10 hours ago </td>
                                </tr>
                                <tr>
                                    <td answer="pos" className="score-content">+7</td>
                                    <td>Trivia</td>
                                    <td> 10 hours ago </td>
                                </tr>
                                <tr>
                                    
                                    <td answer="neg" className="score-content">-10</td>
                                    <td>Picks</td>
                                    <td> 10 hours ago </td>
                                </tr>
                                <tr>
                                    <td answer="pos" className="score-content">+13</td>
                                    <td>Debate</td>
                                    <td> 10 hours ago </td>
                                </tr>
                                </tbody>
                            </table>
                            
                        </div>
                    
                        <h2 className="title"> Pick History </h2>
                        <p className="content"> To be implemented </p>
                    </div>
                    
                  
                </div>
                
                <div className="container-middle-section"> 
                
                </div>
            </div>
            
        )
            
        
    }
    
    

}