import React, { useEffect, useState, useContext } from 'react';
import '../styling/TheZone.css';
import PostPopup from './ProfilePostPopup';
import Header from './Header';
import { AuthContext } from '../Context/AuthContext';
import AuthService from '../Services/AuthService';

export default function TheZone() {

    const authContext = useContext(AuthContext);

    return (
        <div className="page">
        <Header />
            <div class= "all_posts"> 
                <div class="post_body">   
                    <input type="text" class="post" placeholder="Create Post"></input>

                </div>

            </div>
        </div>
    )
}

function togglePostPopup() {
    this.setState({
        showPostPopup: !this.state.showPostPopup
    });
}

function handleRadarList() {
    alert('Will send to pop up of all friends ??');
}