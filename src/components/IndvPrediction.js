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
  const [type, setType] = useState("current"); 
  const [currentSelection, setCurrentSelection] = useState([]); 
  const [waitingLoad, setWaitingLoad] = useState(true); 
  const [currentLoad, setCurrentLoad] = useState(true); 
  const [pastLoad, setPastLoad] = useState(true); 
  const getSeasonals = async (page, list, initialLoad) => { 
    if (initialLoad) {
      await fetch("/prediction/season/current").then(res => res.json())
      .then (data=> {
        setTotal(data.currentSeasonals.length); 
        setCurrentMatches(data.currentSeasonals);
        //console.log(page); 
        setCurrentSelection(data.currentSeasonals.slice(page*10 - 10, page*10 )); 
        setCurrentLoad(false);
        setWaitingLoad(false); 
        console.log(list);
        
      })
      .catch((error) => { 
        console.log(error); 
      })
    }
    else {
      getCurrent(page, list);   
      setWaitingLoad(false); 
    }
    
  }
  const getPast = async (page, list, initialLoad) => {
    
    if (initialLoad) {
      await fetch("/prediction/season/past").then(res => res.json()) 
      .then (data=> {
        setTotal(data.pastSeasonals.length); 
        setFinishedMatches(data.pastSeasonals); 
        setCurrentSelection(data.pastSeasonals.slice(page*10 - 10, page*10)); 
        console.log(data.pastSeasonals);
        setPastLoad(false);
        setWaitingLoad(false); 
      })
      .catch((error) => {
        console.log(error); 
      })
    }
    else {
      getCurrent(page, list); 
      setWaitingLoad(false); 
      
    }
  }
  
  const getCurrent = (page, list) => {
    const indexOfLastPost = page * 10; 
    const indexOfFirstPost = indexOfLastPost - 10; 
    const selection = list.slice(indexOfFirstPost, indexOfLastPost);
    setCurrentSelection(selection); 
  }
  useEffect(() => {
    if (type === "current") {
      getSeasonals(currentPage, currentMatches ,currentLoad); 
    }
    else if (type === "past") {
      getPast(currentPage, finishedMatches, pastLoad)
    }
    
  }, [currentPage, type, currentLoad, pastLoad])

/*
  useEffect(() => {
    setIsLoading(true);
    getSeasonals(currentPage); 
    getPast(currentPage);
    
  },[type])
*/
  const handleSelection= (teamName, matchId) => { 
    console.log("match: " + matchId + "\nteamname:" + teamName);
    const body = {
      _id: matchId,
      pick: teamName, 
    }
    fetch('/prediction/addPrediction', {
      method :  "PUT",
      body : JSON.stringify(body),
      headers: {
          'Content-Type' : 'application/json'
      }
    }).then(res => res.json())
    .then (data=> {
      setCurrentLoad(true); 
    })
    .catch((error) => { 
      console.log(error); 
    })
    
  }
  
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage); 
  }
  const onChangeSelect = (e) => {
    if (e.target.value === "Completed Matches") { 
      setCurrentPage(1); 
      setType("past"); 
      setPastLoad(true); 
      setWaitingLoad(true); 
    }
    
    else if (e.target.value === "Upcoming Matches") {
      setCurrentPage(1); 
      setType("current"); 
      setCurrentLoad(true); 
      setWaitingLoad(true); 
    }
    
  }

  return (
     waitingLoad ? 
     <div> <h1>Loading ...</h1>  </div>
    : 
    <div className="ip-background">
      <div className="ip-full-container">
        <div className="ip-header-section">
            <select onChange={onChangeSelect} value={type === "past" ? "Completed Matches" : "Upcoming Matches"}>
              <option>  Upcoming Matches </option>
              <option> Completed Matches</option>
            </select>
          <button className="ip-navigation-buttons"> {"<"}</button>
          <button className="ip-navigation-buttons"> {">"}</button>
        </div>
        <div className="ip-matches-container">
          {currentSelection.map(data=> { 
            return(
              <div className="ip-match-row-container">
                <label className="ip-date-label"> {data.gameDay.substring(0,10)} </label>
                <div className="ip-matches-info">
                  <button className={data.pick === null?  "ip-matches-info-button" 
                                    : (type === "current" ? (1? "ip-matches-info-button-selected" : "ip-matches-info-button")
                                    : null )} onClick={()=>handleSelection(data.team1Name, data._id)}><TeamBox name={data.team1Name} image={data.team1Image}/></button>
                  <label className="ip-vs-label"> VS </label>
                  <button className="ip-matches-info-button" onClick={()=>handleSelection(data.team2Name, data._id)}><TeamBox name={data.team2Name} image={data.team2Image}/></button>
                </div>
              </div>
          
          )})}
        </div>
        <Pagination className="MuiPagination-ul" color="primary" count={Math.ceil(total/10)} onChange={handlePageChange} />
      </div>
    </div> 
  )

}