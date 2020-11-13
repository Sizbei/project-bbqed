import React, {useEffect, useContext, useState} from 'react';
import axios from 'axios';
import Header from './Header';
import {AuthContext} from '../Context/AuthContext';
import '../styling/Analysis.css'
import Slider from './Slider';
import Histogram from './Histogram';

export default function Analysis(props) {
   
  const authContext = useContext(AuthContext);
  const [formState, setFormState] = useState("discussion");
  const [tier, setTier] = useState("Analyst");
  const [response, setResponse] = useState("");
  const [question, setQuestion] = useState("Sample Question to be Answered");
  const [debates, setDebates] = useState([]);

  useEffect(() => {
    //Find out if the user had already answered the question and set new form state
    setFormState("discussion");

    //Get user's tier and set tier
    //setTier();
    //setDebates();
  })

  const sampleHistogramData = Array(101).fill(0).map((el, i) => i*i + (100-i)*(100-i));
  sampleHistogramData[55] = 50*50*30;

  if (formState === "discussion") {
    return(
    <div className='analysis-background'>
      <div className="analysis-header">
        <span>
          <label className="analysis-question-header">Daily Question </label>
          <label className="analysis-question-difficulty">{tier}</label>
        </span>
        <label className="analysis-question-text">Sample question to be answered</label>
        </div>
        <div className="analysis-question-image">
          {/* Insert image here; div used as a placeholder  */}
          <div className="sample-div"/>
        </div>
        <div className="analysis-comments"> 
      
        <div>
            <div className="analysis-slider">
              <Slider scale={0.7}/>
            </div>
            <div className="analysis-user">
              <div className="left-user-info">
                <label className="analysis-username">Username</label>
                <div className="analysis-ACS-div">
                  <label className="analysis-ACS">(543)</label>
                </div>
                <div className="analysis-histogram">
                  <Histogram data={sampleHistogramData} xScale={0.4} yScale={0.2}/>
                </div>
                <label className="analysis-time-ago">6 hours ago</label>
              </div>
              <label className="analysis-additional-comment">Sample additional comment</label>
            </div>
          
          
        </div>
       
        {debates.map((data, index) => {
          return (
              <div>
              </div>
          )
      })}
      </div>
  </div>
    );
  } 
  else if (formState === "dailyQuestion") {
    return(
      <div className='analysis-background'>
        <div className="analysis-header">
        <span>
          <label className="analysis-question-header">Daily Question </label>
          <label className="analysis-question-difficulty">{tier}</label>
        </span>
        <label className="analysis-question-text">{question}</label>
        </div>
        <div className="analysis-question-image">
          {/* Insert image here; div used as a placeholder  */}
          <div className="sample-div"/>
        </div>
        <div className='analysis-response'>
          <label className='analysis-response-header'>Your Response</label>
          <textarea type="text" className="analysis-response-input" maxLength="1000"></textarea>
          <button className='analysis-response-submit'>Submit</button>
        </div>
      </div>
      );
  }
} 
