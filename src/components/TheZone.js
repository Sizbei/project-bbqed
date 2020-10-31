import React, {Component} from 'react';
import '../styling/TheZone.css';
import PostPopup from './ProfilePostPopup';
import Header from './Header';
import { AuthContext } from '../Context/AuthContext';

export default function TheZone() {
    //Listens for an event and creates content for a post
    const onCreatePost = (e) => {
        
        document.getElementById('post').style.borderColor = "transparent";
    }

    //Listens for an event and sets the username state
    const onComment =  (e) => {
        document.getElementById('comment').style.borderColor = "transparent";
    }
    const onLogin = () => {

    }
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
                  
                    <button className="createPostBtn" onClick={onLogin()}>Create Post</button>
                    <br></br>
                   
                </div>
            </div>
    )
}