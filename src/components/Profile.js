import React, {Component, useDebugValue} from 'react';
import axios from 'axios';
import { PieChart } from 'react-minimal-pie-chart';
import {TableSimple} from 'react-pagination-table'; 
import '../styling/Profile.css'
import Header from './Header';

const defaultLabelStyle = {
    fontSize: '5px',
    fontFamily: 'sans-serif',
  };
export default class Profile extends Component {
    constructor(props) {
        super(props);
        //console.log(props.location.pathname); 
        this.onSubmit = this.onSubmit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = { 
            path: props.location.pathname,
            username: '',
            status: '',
            about: '' ,
            interest: '',
            image: 'https://i.imgur.com/55sUslQ.png',
            asc: 0,  
            acschart: [], 
        }
    }
    
    //******************* CREATING POST FUNCTIONS ****************************/
    onSubmit(event) {
        this.setState({new_post: event.target.value});
    }

    handleSubmit(event) {
        alert('A new post has been created ' + this.state.value);
        event.preventDefault();
    }
    
    /************************GET REQUEST FOR USER INFRORMATION ***********************/
    componentDidMount(){ 

        axios.get('http://localhost:5000' + this.state.path)
        .then(response => {   
            const tag = 10; 
            const aad = 15; 
            const pap = 20; 
            const pah = 5;
            this.setState({
                username: response.data.username,
                status: response.data.status,
                about: response.data.about,
                interest: response.data.interest,   
                ascchart: [
                    { title: 'Trivia & Games', value: tag, color: '#61b305' },
                    { title: 'Analysis & Debate', value: aad, color: '#f8e871' },
                    { title: 'Picks & Prediction', value: pap, color: '#d30909' },
                    { title: 'Participation & History', value: pah, color: ' #ff7e1f'},
                ]  
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
                    <div className="profile-info">
                        <h1>{this.state.username}</h1>
                        <p>{this.state.status}</p>
                        <div className="form-group">
                            <input type="submit" value="Create Post" className="btn btn-primary"/>
                        </div>
                    </div>
                    <div className="edit-profile">
                        <input type="submit" value="Edit Profile" className="btn btn-primary"/>
                    </div>
                    
                    
                    
                </div>
                <div className="container-middle-section"> 
                    <div className="left-content">

                        <h2 className="title"> About</h2>
                        <p className="content">{this.state.about}</p>

                        <div className="radar-list">
                            <h2> Radar List</h2>
                            <p>
                            
                            </p>
                        </div>
                        
                        
                    </div>
                                 
                    <div className="right-content">
                        

                        <h2 className="title"> ACS History </h2>
                        
                        <div className="acs-content"> 
                            <PieChart className="piechart"
                            data={this.state.ascchart}
                            label={({ dataEntry }) => Math.round(dataEntry.percentage) + '%'}
                            labelStyle={defaultLabelStyle}                
                            raidus={42}
                            reveal ={({dataEntry}) => Math.round(dataEntry.percentage) + '%'}
                        />
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
                                    <td> 2 hours ago </td>
                                </tr>
                                <tr>
                                    
                                    <td answer="neg" className="score-content">-10</td>
                                    <td>Picks</td>
                                    <td> 5 hours ago </td>
                                </tr>
                                <tr>
                                    <td answer="pos" className="score-content">+13</td>
                                    <td>Debate</td>
                                    <td> 10 hours ago </td>
                                </tr>
                                </tbody>
                                <td answer="neg" className="score-content">-3</td>
                                    <td>Trivia</td>
                                <td> 20 hours ago </td>
                            </table>

                            
                        </div>
                        <div className="bottom-right-content">
                            <div className="interest">
                                <h2>Interest</h2>
                                <p>{this.state.interest}</p>
                            </div>
                            <div className="picks">
                                <h2> Current Picks </h2>
                                <p> To be implemented in future sprint</p>
                            </div>

                        </div>
                        
                    </div>
                    
                  
                </div>
                
                <div className="container-middle-section"> 
                
                </div>
            </div>
            
        )
            
        
    }
    
    

}