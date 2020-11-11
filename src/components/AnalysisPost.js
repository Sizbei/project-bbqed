import React, {Component, useEffect, useState, useContext} from 'react';
import '../styling/Analysis.css';
import axios from 'axios';
import Header from './Header';

export default function AnalysisPost(props) {

  const type = props.type;

  return(
    <div className="analysis-post-container">
      <div className="analysis-post-front">
        <div className="tier-div pro-analyst-div">Expert Analysis</div>
        <div className="analysis-question">Insert the debate and analysis question here</div>
      </div>
      {type !== "past" ? <div className="time-left">Closes in: &ensp; 5h 3m</div> : null}

    </div>
  );
    
}