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

  let history = useHistory(); 

  useEffect(() => {
    
    try {

      setTier(post.tier)
      setPost(props.post);

    } catch(err) {
      console.log("pepega")
    }


  }, [props.post]);


  const handlePostClick = (event, value) => {
    console.log(post)
    history.push("/analysis/" + post._id)
  };


  return(
    <div className="analysis-post-container" onClick={handlePostClick}>
      <div className="analysis-post-front">
        <div className={`${tier === 'Expert Analyst' ? 'expert-analyst-div' : 
                          (tier === 'Pro Analyst' ? 'pro-analyst-div' : 
                          (tier === 'Analyst' ? 'analyst-div' : 
                          (tier === 'Fanalyst' ? 'fanalyst-div' : '')))} tier-div`} >{tier}</div>
        <div className="analysis-question">Insert the debate and analysis question here</div>
      </div>

      
      {type !== "past" ? <div className="time-left">
        <AccessTimeIcon />
        <div className="time">
          Closes in: &ensp; 14h 28m
        </div>
      </div> : null}

      

    </div>
  );
    
}