import React, {Component} from 'react';
import '../styling/TheZone.css';
import PostPopup from './ProfilePostPopup';
import Header from './Header';
import { AuthContext } from '../Context/AuthContext';

export default function TheZone() {

    

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