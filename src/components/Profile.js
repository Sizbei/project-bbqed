import React, {Component} from 'react';
import axios from 'axios';
import { PieChart } from 'react-minimal-pie-chart';
import '../styling/Profile.css'
import PostPopup from './ProfilePostPopup';
import ImageSelect from './ImageSelect';
import RLPopup from './ProfileRadarListPopup'; 

const defaultLabelStyle = {
    fontSize: '5px',
    fontFamily: 'sans-serif',
  };


export default class Profile extends Component {
    constructor(props) {
        super(props);
        //console.log(props.location.pathname); 
        
        this.state = { 
            path: props.location.pathname,
            username: '',
            status: '',
            about: '' ,
            interest: [],
            image: 'https://i.imgur.com/55sUslQ.png',
            acs: 0,  
            acsChart: [], 
            acsHistory: [],
            showPostPopup: false,
            showRLPopup: false, 
            radarList: [], 
            teams: [],
            imgSelect: null
        }
        this.handleEditProfile = this.handleEditProfile.bind(this);
        this.handleRadarList = this.handleRadarList.bind(this);
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
    handleRadarList(event) { 
        this.props.history.push("/settings/profile");
    }

    /************************GET REQUEST FOR USER INFRORMATION ***********************/
    componentDidMount(){ 

        axios.get('http://localhost:5000' + this.state.path)
        .then(response => {
   
            const tag = 10; 
            const aad = 15; 
            const pap = 20; 
            const pah = 5;
            console.log(response.data.interest);
            this.setState({
                username: response.data.username,
                status: response.data.status,
                interest: response.data.interest,
                about: response.data.about,  
                image: response.data.image, 
                acs: response.data.acs,
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
                teams: response.data.teams,
                /*
                radarList: [ 
                    {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user1",acs: 20},
                    {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user2",acs: 21},
                    {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user3",acs: 22},
                    {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user4",acs: 23},
                    {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user5",acs: 24},
                    {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user6",acs: 25},
                    {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user7",acs: 26},
                    {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user8",acs: 27},
                    {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user9",acs: 28},
                    {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user10",acs: 90},
                    {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user11",acs: 30},
                ]
                */
            }) 
        })
        .then(response => {
            console.log("interest: " + this.state.interest);
            const send = {
                params: {
                  teams: this.state.interest
                }
              }
            
            axios.get('http://localhost:5000' + this.state.path + '/teams', send)
            .then(response => { 
              const mapped = response.data.map(team => team.image).map((e) => {
                const obj = {
                  name: "",
                  image: e
                }

                return obj;
              })
              
              console.log(mapped);
              this.setState({
                imgSelect: <ImageSelect btntext="Submit!" data={mapped} width={3} noError={true} noSelect={true} noButton={true} />
              })
            })
            .catch((error) => {
                console.log(error);
            })

            }

        )
        /*.then (response => 
            axios.get('http://localhost:5000' + this.state.path + '/radarlist')
            .then(response => {

            })   
        )*/
        .catch((error) => {
          console.log(error);
        })

        
    }

    render(){
            /*
            FOR RADAR LIST IMPLEMENTATION 
            <table>
                <tbody>
                {this.state.radarList.map(data => {
                    return (
                        <tr>
                            <td><img className="prof-radar-list-img" src={data.pictureUrl}></img></td>
                            <td>{data.username}</td>
                            <td>{data.acs}</td>
                        </tr>
                    )
                })} 
            
                </tbody>
            </table>        
            */
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
                        <button className ="prof-create-post-button" onClick={this.togglePostPopup.bind(this)}>Create Post</button>                       
                    </div>
                    <div className="prof-edit-profile">
                        <button onClick={this.handleEditProfile}>Edit Profile</button>
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
                                To be implemented in the future              
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
                                        <tr>
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
                
            </div>
            </div>
        )
            
        
    }
    
    

}