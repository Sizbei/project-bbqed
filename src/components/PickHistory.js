import React, {useState,  useEffect, useContext} from "react"
import {AuthContext} from '../Context/AuthContext';
import Pagination from "@material-ui/lab/Pagination";
import "../styling/IndvPrediction.css";
import TeamBox from './TeamBox'; 

export default function View() {
  const [pastLoad, setPastLoad] = useState(true); 
  const [weekSelected, setWeekSelected] = useState(0); 
  const [finishedMatches, setFinishedMatches] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [total, setTotal] = useState(0);
  const authContext = useContext(AuthContext); 
  
  const getPastHistory = async (page , list, initialLoad, week) => {
    if (initialLoad) {
      await fetch("/prediction/season/week/" + week).then(res => res.json()) 
      .then (data=> {
        setCurrentPage(1); 
        setTotal(data.Seasonals.length); 
        setFinishedMatches(data.Seasonals); 
        setCurrentSelection(data.Seasonals.slice(page*10 - 10, page*10)); 
        //console.log(data.Seasonals);
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
      getPastHistory(currentPage, finishedMatches, pastLoad, weekSelected);
    
  }, [currentPage, weekSelected])

  const handleWeekChange = ( type) => {
    if (type === "forward") {
      if (weekSelected < 0 ) { 
        setWeekSelected(weekSelected + 1);  
        setPastLoad(true);  
        setWaitingLoad(true);     
      }
    }
    else {
      setWeekSelected(weekSelected - 1);     
      setPastLoad(true); 
      setWaitingLoad(true); 
    }
  } 
  return (
    <div>
      <div className="ip-header-section">
        <button onClick={()=>handleWeekChange("forward")}className="ip-navigation-buttons"> {"<"}</button>
        <label>{weekSelected === 0? "This Week" : -1 * weekSelected + " week(s) ago"}</label>
        <button onClick={()=>handleWeekChange("back")} className="ip-navigation-buttons"> {">"}</button>        
      </div>
     
      <div className="ip-matches-container">
            {currentSelection.map((data,index) => { 
              return(
                <div className="ip-match-row-container">
                  <label className="ip-date-label"> {data.gameDay.substring(0,10)} </label>
                  <div className="ip-matches-info">
                    <button className={data.pick === null?  "ip-matches-info-button"
                                      :data.pick === data.team1Name? (type === "current" ? "ip-matches-info-button-selected" : (data.pick === data.result ? "ip-matches-info-button-correct" : "ip-matches-info-button-incorrect")) 
                                      : "ip-matches-info-button" } 
                            onClick={()=>handleSelection(data, data.team1Name, index)}><TeamBox name={data.team1Name} image={data.team1Image}/></button>
                    <label className="ip-vs-label"> VS </label>
                    <button className={data.pick === null?  "ip-matches-info-button"
                                      :data.pick === data.team2Name? (type === "current" ? "ip-matches-info-button-selected" : (data.pick === data.result ? "ip-matches-info-button-correct" : "ip-matches-info-button-incorrect")) 
                                      : "ip-matches-info-button" }  
                            onClick={()=>handleSelection(data, data.team2Name, index)}><TeamBox name={data.team2Name} image={data.team2Image}/></button>
                  </div>
                </div>
            
            )})}
          </div>
          <Pagination className="MuiPagination-ul" color="primary" count={Math.ceil(total/10)} onChange={handlePageChange} />
    </div>
  )
}