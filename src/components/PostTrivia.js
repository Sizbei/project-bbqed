import React, { useState } from 'react';
import axios from 'axios';
import  '../styling/PostTrivia.css';
import ProfilePicture from './ProfilePicture'

export default function InGameTrivia(props) {
    return (
        <div>
            <div className='popup'/>
            <div className='popup_inner'>
                {/* <div className='left'>
                    <div className='left-user'>
                        <ProfilePicture scale={1.5} username="user1" />
                    </div>
                
                    <span className="TSBG-header-username">
                        User1 &nbsp;
                        <span className="TSBG-header-acs">(1234)</span>
                    </span>

                </div>
                <div className ='right'>
                    <div className='right-user'>
                        <ProfilePicture scale={1.5} username="user3" />
                    </div>
                   
                    <span className="TSBG-header-username">
                        User3 &nbsp;
                        <span className="TSBG-header-acs">(914)</span>
                    </span>
                </div> */}
            </div>
        </div> 
    );
}