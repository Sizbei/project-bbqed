import React, {Component, useEffect, useState, useContext} from 'react';
import { useHistory } from 'react-router-dom';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import '../styling/Analysis.css';


export default function AnalysisPost(props) {

  const [tier, setTier] = useState("");
  const [post, setPost] = useState(props.post);
  const [timeLeft, setTimeLeft] = useState([0,0])
  let history = useHistory(); 

  useEffect(() => {
    
    try {

      setPost(props.post);
      setTier(post.tier);

      const endTime = Date.parse(post.endTime);
      const curTime = new Date();

      const timeDiff = endTime - curTime;

      if(timeDiff > 0){
        const hours = Math.floor(Math.abs(timeDiff / 36e5));
        const minutes = Math.floor(Math.abs((timeDiff.getHours() - hours) /  60000))
        setTimeLeft([hours, minutes]);
      } else {
        setTimeLeft([0,0]);
      }

    } catch(err) {}


  }, [props.post]);


  const handlePostClick = (event, value) => {
    history.push("/analysis/post/" + post._id)
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

      
      {post.status === "open" ? <div className="time-left">
        <div className="clockIcon">
          <AccessTimeIcon />
        </div>
        <div className="time">
          Closes in: &ensp; {timeLeft[0]}h {timeLeft[1]}m
        </div>
      </div> : null}

      

    </div>
  );
    
}