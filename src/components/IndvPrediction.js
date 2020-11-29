import React, {useState,  useEffect, useContext} from "react"
import {AuthContext} from '../Context/AuthContext';
import Pagination from "@material-ui/lab/Pagination";
import "../styling/IndvPrediction.css";
import TeamBox from './TeamBox'; 

export default function PredictionsView() { 
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [currentMatches, setCurrentMatches] = useState([]); 
  const [finishedMatches, setFinishedMatches] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [total, setTotal] = useState(0); 
  const authContext = useContext(AuthContext); 
  const [currentSelection, setCurrentSelection] = useState([]); 
  /*
  const dummyData = [
    {date: "01/02/2019" ,team1: 'teamA', team2: 'teamB' },
    {date: "01/02/2019" ,team1: 'teamC', team2: 'teamD' },
    {date: "01/02/2019" ,team1: 'teamE', team2: 'teamF' },
    {date: "01/02/2019" ,team1: 'teamG', team2: 'teamH' },
  ]

  {dummyData.map((data) => {
            return (
              <div className="ip-match-row-container"> 
                <label>{data.date}</label>  
                <button> {data.team1} </button>
                <label> vs </label>
                <button>{data.team2} </button>
              </div>
            )
            
          })}
  */
  const getSeasonals = (page) => { 
    fetch("/prediction/season/current").then(res => res.json())
    .then (data=> {
      setTotal(data.currentSeasonals.length); 
      setCurrentMatches(data.currentSeasonals); 
      //console.log(currentMatches);
      getCurrent(page, currentMatches); 
    })
    .catch((error) => { 
      console.log(error); 
    })
  }
  const getCurrent = (page, list) => {
    const indexOfLastPost = page * 10; 
    const indexOfFirstPost = indexOfLastPost - 10; 
    const selection = list.slice(indexOfFirstPost, indexOfLastPost);
    setCurrentSelection(selection); 
    //console.log(currentMatches);
  }
  const getPast = () => {
    fetch("/prediction/season/past").then(res => res.json()) 
    .then (data=> {
      setFinishedMatches(data.pastSeasonals); 
    })
    .catch((error) => {
      console.log(error); 
    })
  }
  useEffect(() => {
    getSeasonals(currentPage); 
    getPast(); 
  }, [])

  useEffect(() => {
    getCurrent(currentPage, currentMatches);   
  },[currentPage])

  const handleSelection= (teamName) => { 
    alert("I choose you! " + teamName);
    /* 
    fetch().then(res => res.json())
    .then (data=> {
      
    })
    .catch((error) => { 
      console.log(error); 
    })
    */
  }
  
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage); 
  }
  
  
  return (
    <div className="ip-background">
      <div className="ip-full-container">
        <div className="ip-header-section">
          <button className="ip-navigation-buttons"> {"<"}</button>
          <button className="ip-navigation-buttons"> {">"}</button>
        </div>
        <div className="ip-matches-container">
          {currentSelection.map(data=> { 
            return(
              <div className="ip-match-row-container">
                <label className="ip-date-label"> {data.gameDay.substring(0,10)} </label>
                <div className="ip-matches-info">
                  <button onClick={()=>handleSelection(data.team1Name)}><TeamBox name={data.team1Name} image={data.team1Image}/></button>
                  <label className="ip-vs-label"> VS </label>
                  <button  onClick={()=>handleSelection(data.team2Name)}><TeamBox name={data.team2Name} image={data.team2Image}/></button>
                </div>
              </div>
          
          )})}
        </div>
        <Pagination className="MuiPagination-ul" color="primary" count={Math.ceil(total/10)} onChange={handlePageChange} />
      </div>
    </div> 
  )

}