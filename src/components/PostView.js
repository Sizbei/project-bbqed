import React, {useState,  useEffect, Component} from "react"
import ProfilePicture from './ProfilePicture'
import '../styling/PostView.css'

function Post(props) {
  
  return (
    <div className="tzpv-post-container">
        <div className="tzpv-user-info">
            <ProfilePicture username ={'user3'}/>
            <label> user3 (0) </label>

        </div>
        <div className="tzpv-post-info"> 
        <p> </p>
        </div>
        
    </div>
  )
}
export default function View() {
  
    useEffect(() => {
    
    console.log('mount it!');
  }, []);
  
  return (
  <div className="tzpv-background">
      <div className="tzpv-container">
        <Post/>

      </div>
  </div>
  )
}