import React, {Component, useEffect, useState, useContext} from 'react';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import '../styling/Analysis.css';
import axios from 'axios';
import Header from './Header';

export default function AnalysisPost(props) {

  const type = props.type;

  const [tier, setTier] = useState("Expert Analyst");

  const [post, setPost] = useState(props.post);


  useEffect(() => {
    
    try {

      setTier(post.tier)

    } catch(err) {}


  }, [props.post]);

  return(
    <div className="analysis-post-container">
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