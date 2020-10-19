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
            acshistory: [],
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
                ],  
                acshistory: [
                    {point: 10 , category: 'Picks', time: '1 hour ago'}, 
                    {point: 7 , category: 'Debate', time: '7 hours ago'}, 
                    {point: -10 , category: 'Trivia', time: '10 hours ago'}, 
                    {point: 13 , category: 'Debate', time: '13 hours ago'}, 
                    {point: -3 , category: 'Picks', time: '20 hours ago'}, 
                ]
            }) 
        })
        .catch((error) => {
          console.log(error);
        })
        
    }
/*
<tr>
                                    <td className={10>= 0? "score-content-pos" : "score-content-neg"}> 10 </td>
                                    <td>Picks</td>
                                    <td> 10 hours ago </td>
                                </tr>
*/
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
                            To be implemented 
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
                                <thead> 
                                    <tr>
                                        <th>Points </th>
                                        <th> Category </th>
                                        <th> Time </th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.state.acshistory.map(data => {
                                    return (
                                        <tr>
                                            <td className={data.point>= 0? "score-content-pos" : "score-content-neg"}>{data.point}</td>
                                            <td>{data.category}</td>
                                            <td>{data.time}</td>
                                        </tr>
                                    )
                                })} 
                            
                                </tbody>
                            </table>

                            <button> View all history</button>
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