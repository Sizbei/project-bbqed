import React, {Component} from 'react';
import '../styling/TheZone.css';
import PostPopup from './ProfilePostPopup';
import Header from './Header';
import { AuthContext } from '../Context/AuthContext';

export default function TheZone() {
    
    

    return (
        <div className="page">
                <Header />
                <div className="login">
                   
                <input type="text" class="zgT5MfUrDMC54cpiCpZFu" placeholder="Create Post"></input>
                  
               
                   
                </div>
            </div>
    )
}