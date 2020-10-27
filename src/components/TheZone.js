import React, {Component} from 'react';
import axios from 'axios';
import '../styling/TheZone.css';
import PostPopup from './ProfilePostPopup';
import Header from './Header';
import { AuthContext } from '../Context/AuthContext';

export default class TheZone extends Component {
    //example of using authContext in class
    //define contextType in the class using AuthContext
    //so that we are able to access it through this.context
    static contextType = AuthContext;

    constructor(props) {
        super(props);

    }

    //Listens for an event and creates content for a post
    onCreatePost(e) {
        
        document.getElementById('post').style.borderColor = "transparent";
    }

    //Listens for an event and sets the username state
    onComment(e) {
        document.getElementById('comment').style.borderColor = "transparent";
    }

    //onReportPost(e){}

    //onDeletePost(e) {}


    render() {
        return (
            <div className="page">
                <Header />
                <div className="login">
                   
                    <div className="post">
                        <label className="text">Create Post</label>
                        <input className="input"
                            id="post"
                            type="string"
                            
                             />
                    </div>
                  
                    <button className="createPostBtn" onClick={this.onLogin}>Create Post</button>
                    <br></br>
                   
                </div>
            </div>
        );
    }
}