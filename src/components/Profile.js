import React, {Component, useDebugValue} from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import '../styling/Profile.css'
import PostPopup from './ProfilePostPopup';
import RLPopup from './ProfileRLPopup'; 
import ImageSelect from './ImageSelect';
import {AuthContext} from '../Context/AuthContext';
import Axios from 'axios';

const defaultLabelStyle = {
    fontSize: '5px',
    fontFamily: 'sans-serif',
  };
export default class Profile extends Component {
    
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        //console.log(props.location.pathname); 
        
        this.state = { 
            path: props.location.pathname,
            username: '',
            status: '',
            about: '' ,
            interest: [],
            image: '',
            acs: 0,  
            acsChart: [], 
            acsHistory: [],
            showPostPopup: false,
            showRLPopup: false, 
            following: false, 
            teams: [],
            imgSelect: null
        }
        this.handleEditProfile = this.handleEditProfile.bind(this);
    }
    
    //******************* CREATING POST FUNCTIONS ****************************/
    togglePostPopup() {  
        this.setState({  
             showPostPopup: !this.state.showPostPopup  
        });  
    }
    toggleRLPopup() {  
        this.setState({  
            showRLPopup: !this.state.showRLPopup  
        });  
    }
    
    handleEditProfile(event) { 
        // alert('Will send to edit profile page');
        event.preventDefault();
        this.props.history.push("/settings/profile");
    }
    handleAddFollower(event) {
        alert('add follower'); 
    }

    handleDeleteFollower(event) { 

    }
    /************************GET REQUEST FOR USER INFRORMATION ***********************/
    componentDidMount(){
        //defualt method in fetch is get so no need to put that as param
        fetch(this.state.path).then(res => res.json())
        //axios.get('http://localhost:5000' + this.state.path)
        .then(data => {
            //console.log("Path: " + this.state.path + "\n users:  profile/" + this.context.user.username); 
            const tag = 10; 
            const aad = 15; 
            const pap = 20; 
            const pah = 5;
            //console.log(response.data.interest);
            this.setState({
                username: data.username,
                status: data.status,
                interest: data.interest,
                about: data.about,  
                image: data.image, 
                acsChart: [
                    { title: 'Trivia & Games', value: tag, color: '#61b305' },
                    { title: 'Analysis & Debate', value: aad, color: '#f8e871' },
                    { title: 'Picks & Prediction', value: pap, color: '#d30909' },
                    { title: 'Participation & History', value: pah, color: ' #ff7e1f'},
                ],  
                acsHistory: [
                    {point: 10 , category: 'Picks', time: '1 hour ago'}, 
                    {point: 7 , category: 'Debate', time: '7 hours ago'}, 
                    {point: -10 , category: 'Trivia', time: '10 hours ago'}, 
                    {point: 13 , category: 'Debate', time: '13 hours ago'}, 
                    {point: -3 , category: 'Picks', time: '20 hours ago'}, 
                ],
                teams: data.teams
            }) 
        })
        .then(data => {
            //console.log("interest: " + this.state.interest);
            const params = {
                teams: this.state.interest
              }

            fetch(this.state.path + '/teams?' + new URLSearchParams(params)).then(res => res.json())
            //axios.get('http://localhost:5000' + this.state.path + '/teams', send)
            .then(data => { 
              const mapped = data.map(team => team.image).map((e) => {
                const obj = {
                  name: "",
                  image: e
                }

                return obj;
              })
              
              //console.log(mapped);
              this.setState({
                imgSelect: <ImageSelect btntext="Submit!" data={mapped} width={3} noError={true} noSelect={true} noButton={true} />
              })
            })
            .catch((error) => {
                console.log(error);
            })

            }

        )
        .catch((error) => {
          console.log(error);
        })
        
        const body = {
            authUser: this.context.user.username,
            targetUser: this.state.username
        }
        Axios.post('http://localhost:5000/profile/following', body).then(res => res.json())
        .then(data => {
            this.setState ({
                following: data.following, 
            })
        })
        .catch((error) => {
            console.log(error); 
        })
        
    }


    render(){
            
        return (
            <div>
            
            <div className="prof-background">
                <div className="prof-container-profile"> 
                    <div className="prof-profile-preview">
                        <div className="prof-profile-photo">
                            <img src={this.state.image} className="prof-profile-user-given-photo"/>  
                            <label className="prof-profile-user-score">{this.state.acs}</label>   
                                            
                        </div>
                    </div>
                    <div className="prof-profile-info">
                        <h1>{this.state.username}</h1>
                        <p>{this.state.status}</p>
                        {this.state.path === "/profile/" + this.context.user.username ? 
                        <button className ="prof-create-post-button" onClick={this.togglePostPopup.bind(this)}>Create Post</button> : 
                        null
                      
                        }                      

                    </div>
                    <div className="prof-edit-profile">
                         {this.state.path === "/profile/" + this.context.user.username ? 
                         <button onClick={this.handleEditProfile}>Edit Profile</button> : 
                        null
                      
                        }
                       
                    </div>
                    
                    
                    
                </div>
                
                <div className="prof-container-middle-section"> 
                    {this.state.showPostPopup ?  
                            <PostPopup closePopup={this.togglePostPopup.bind(this)} />  
                            : null  
                    }
                    {this.state.showRLPopup ?  
                            <RLPopup closePopup={this.toggleRLPopup.bind(this)} />  
                            : null  
                    }
                    <div className="prof-left-content">
                        <div className="prof-about">
                            <h2 className="prof-title"> About</h2>
                            <p className="prof-about-content">{this.state.about}</p>
                        </div>
                        
                        <div className="prof-radar-list">
                            <h2 className="prof-title"> Radar List</h2>
                            <div className="prof-radar-list-content">
                                
                                To be implemented 
                                
                                
                                <button onClick={this.toggleRLPopup.bind(this)}> View all</button>
                            </div>
                        </div>
                        
                        
                        
                    </div>
                                 
                    <div className="prof-right-content">
                        <div className="prof-cs">
                            <h2 className="prof-title"> ACS History </h2>
                            
                            <div className="prof-acs-content"> 
                            <PieChart className="prof-piechart"
                            data={this.state.acsChart}
                            label={({ dataEntry }) => Math.round(dataEntry.percentage) + '%'}
                            labelStyle={defaultLabelStyle}                
                            raidus={42}
                            reveal ={({dataEntry}) => Math.round(dataEntry.percentage) + '%'}
                            />

                            <table>
                                <thead> 
                                    <tr>
                                        <th> Point </th>
                                        <th> Category </th>
                                        <th> Time </th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.state.acsHistory.map(data => {
                                    return (
                                        <tr key={data.time}>
                                            <td className={data.point>= 0? "prof-score-content-pos" : "prof-score-content-neg"}>{data.point}</td>
                                            <td>{data.category}</td>
                                            <td>{data.time}</td>
                                        </tr>
                                    )
                                })} 
                            
                                </tbody>
                            </table>
                        </div>
                        </div>
                        <div className="prof-bottom-right-content">
                            
                            <div className="prof-interest">
                                <h2>Interest</h2>
                                <div className="prof-interest-content">
                                  {this.state.imgSelect}
                                </div>
                            </div>
                            
                            <div className="prof-picks">
                                <h2> Current Picks </h2>
                                <div className="prof-picks-content">
                                    To be implemented in future sprint
                                </div>
                            </div>

                        </div>
                        
                    </div>
                    
                  
                </div>
                
                <div className="prof-container-middle-section"> 
                
                </div>
            </div>
            </div>
        )
            
        
    }
    
    

}