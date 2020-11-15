import React, {Component, useEffect, useState, useContext} from 'react';
import {AuthContext} from '../Context/AuthContext';
import ReactPaginate from 'react-paginate';
import '../styling/Analysis.css';
import axios from 'axios';
import Header from './Header';
import AnalysisPost from "./AnalysisPost"
import { Pagination } from '@material-ui/lab';

export default function Analysis() {
  
  const [currentTierPosts, setCurrentTierPosts] = useState(0);
  const [otherTierPosts, setOtherTierPosts] = useState(0);
  const [pastTierPosts, setPastTierPosts] = useState(0);
  const[page, setPage] = useState(1);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    handlePageChange()

    fetch('/analysis/current/' + authContext.user.username).then(res => res.json())
    .then(current => {
      setCurrentTierPosts(current.analyses.currentAcsTier);
      setOtherTierPosts(current.analyses.otherAcsTiers);
    })

    fetch('/analysis/past/10').then(res => res.json())
    .then(past => {
      console.log(past)
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
              <label className="analysis-category-label">In Progress (Current ACS tier)</label>
            </div>

            {Array.from(Array(currentTierPosts.length)).map((x, index) => <AnalysisPost post={currentTierPosts[index]}/>)}

            <div className="analysis-category-div">
              <label className="analysis-category-label">In Progress (Other ACS tiers)</label>
            </div>

            {Array.from(Array(otherTierPosts.length)).map((x, index) => <AnalysisPost post={otherTierPosts[index]}/>)}

            <div className="analysis-category-div">
              <label className="analysis-category-label">Past Debates and Analysis</label>
            </div>

            {Array.from(Array(pastTierPosts.length)).map((x, index) => <AnalysisPost post={pastTierPosts[index]}/>)}

            <div className="analysis-pagination">
              <Pagination count={10} color="primary" onChange={handlePageChange} />
            </div>
            

          </div>
      </div>
    </body>
    
  );
    
}