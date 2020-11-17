import React, {Component, useEffect, useState, useContext} from 'react';
import {AuthContext} from '../Context/AuthContext';
import '../styling/Analysis.css';
import AnalysisPost from "./AnalysisPost"
import { Pagination } from '@material-ui/lab';

export default function Analysis() {
  
  const [currentTierPosts, setCurrentTierPosts] = useState(0);
  const [otherTierPosts, setOtherTierPosts] = useState(0);
  const [pastTierPosts, setPastTierPosts] = useState(0);
  const[page, setPage] = useState(1);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    handlePageChange();
    setPage(page);

    fetch('/analysis/current/').then(res => res.json())
    .then(current => {
      setCurrentTierPosts(current.analyses.currentAcsTier);
      setOtherTierPosts(current.analyses.otherAcsTiers);
    })

    fetch('/analysis/past/'+ ((page-1)*10).toString() + '/10').then(res => res.json())
    .then(past => {
      setPastTierPosts(past.analyses)
    })

  },[page]);


  const handlePageChange = (event, value) => {
    setPage(value);
  };


  return(

    <body>
        <div className="analysis-page">

          <div className="analysis-container">

            <h1 className="analysis-title">Debates and Analysis</h1>

            <div className="analysis-category-div">
              <label className="analysis-category-label">In Progress (Open)</label>
            </div>

            {currentTierPosts.length > 0 && Array.from(Array(currentTierPosts.length)).map((x, index) => <AnalysisPost post={currentTierPosts[index]}/>)}

            <div className="analysis-category-div">
              <label className="analysis-category-label">In Progress (Locked)</label>
            </div>

            {otherTierPosts.length > 0 && Array.from(Array(otherTierPosts.length)).map((x, index) => <AnalysisPost post={otherTierPosts[index]}/>)}

            <div className="analysis-category-div">
              <label className="analysis-category-label">Past Debates and Analysis</label>
            </div>

            {pastTierPosts.length > 0 && Array.from(Array(pastTierPosts.length)).map((x, index) => <AnalysisPost post={pastTierPosts[index]}/>)}

            <div className="analysis-pagination">
              <Pagination count={10} color="primary" onChange={handlePageChange} />
            </div>
            

          </div>
      </div>
    </body>
    
  );
    
}