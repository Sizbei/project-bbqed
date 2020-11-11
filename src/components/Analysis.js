import React, {Component, useEffect, useState, useContext} from 'react';
import ReactPaginate from 'react-paginate';
import '../styling/Analysis.css';
import axios from 'axios';
import Header from './Header';
import AnalysisPost from "./AnalysisPost"
import { Pagination } from '@material-ui/lab';

export default function Analysis() {
  
  const [currentTierPosts, setCurrentTierPosts] = useState(1);
  const [otherTierPosts, setOtherTierPosts] = useState(5);
  const [page, setPage] = useState(1);

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

            {Array.from(Array(currentTierPosts)).map((x, index) => <AnalysisPost key={index} type={"current"}/>)}

            <div className="analysis-category-div">
              <label className="analysis-category-label">In Progress (Other ACS tiers)</label>
            </div>

            {Array.from(Array(otherTierPosts)).map((x, index) => <AnalysisPost key={index} type={"other"}/>)}

            <div className="analysis-category-div">
              <label className="analysis-category-label">Past Debates and Analysis</label>
            </div>

            {Array.from(Array(10)).map((x, index) => <AnalysisPost key={index + (page-1) * 10} type={"past"}/>)}

            <div className="analysis-pagination">
              <Pagination count={10} color="primary" onChange={handlePageChange} />
            </div>
            

          </div>
      </div>
    </body>
    
  );
    
}