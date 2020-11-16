import React, {Component, useEffect, useState, useContext} from 'react';
import { useHistory } from 'react-router-dom';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import '../styling/Analysis.css';
import axios from 'axios';
import Header from './Header';

export default function AnalysisPost(props) {

  const type = props.type;
  const [tier, setTier] = useState("");
  const [post, setPost] = useState(props.post);
  const [endTime, setEndTime] = useState("")
  let history = useHistory(); 

  useEffect(() => {
    
    try {

      setPost(props.post);
      setTier(post.tier);
      setEndTime(post.closesIn);

    } catch(err) {
    }


  }, [props.post, endTime]);


  const handlePostClick = (event, value) => {
    history.push("/analysis/" + post._id)
  };


  return(
    <div className="analysis-post-container" onClick={handlePostClick}>
      <div className="analysis-post-front">
        <div className={`${tier === 'Expert Analyst' ? 'expert-analyst-div' : 
                          (tier === 'Pro Analyst' ? 'pro-analyst-div' : 
                          (tier === 'Analyst' ? 'analyst-div' : 
                          (tier === 'Fanalyst' ? 'fanalyst-div' : '')))} tier-div`} >{tier}</div>
        <div className="analysis-question">{post.question}</div>
      </div>

      
      {post.closesIn ? <div className="time-left">
        <AccessTimeIcon />
        <div className="time">
          Closes in: &ensp; 14h 28m
        </div>
      </div> : null}

      

    </div>
  );
    
}