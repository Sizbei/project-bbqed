import React, {useState,  useEffect, useContext} from "react"
import {AuthContext} from '../Context/AuthContext';
import Pagination from "@material-ui/lab/Pagination";
import "../styling/IndvPrediction.css";
import TeamBox from './TeamBox'; 

export default function PredictProfile() { 
  const [weekSelected, setWeekSelected] = useState(0); 
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
      await fetch("/prediction/season/profile/" + authContext.user.username).then(res => res.json())
      .then (data=> {
        setTotal(data.Seasonals.length); 
        setCurrentMatches(data.Seasonals);
        //console.log(page); 
        setCurrentSelection(data.Seasonals.slice(page*5 - 5, page*5 )); 
        setCurrentLoad(false);
        setWaitingLoad(false); 
        //console.log(list);
        
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
    const indexOfLastPost = page * 5; 
    const indexOfFirstPost = indexOfLastPost - 5; 
    const selection = list.slice(indexOfFirstPost, indexOfLastPost);
    setCurrentSelection(selection); 
  }
  useEffect(() => {
    
      getSeasonals(currentPage, currentMatches ,currentLoad); 
    
  }, [currentPage])

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

  const handleWeekChange = ( type) => {
    console.log(type); 
    if (type === "forward") {
      if (weekSelected < 0 ) { 
        setWeekSelected(weekSelected + 1);      
      }
      if (weekSelected === 0)  { 
        setType("current"); 
        setCurrentPage(1);
        setCurrentLoad(true); 
        setWaitingLoad(true); 
      }
      else {
      setType("history"); 
      setCurrentPage(1); 
      setPastLoad(true); 
      setWaitingLoad(true); 
      }
    }
    else {
      setWeekSelected(weekSelected - 1);     
      setType("history"); 
      setCurrentPage(1); 
      setPastLoad(true); 
      setWaitingLoad(true); 
    }
      

    
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
      <div className="pp-background">
        <div className="pp-full-container">

          <div>
            <div className="ip-matches-container">
              {currentSelection.map((data, index) => {
                return (
                  <div className="ip-match-row-container">
                    <label className="ip-date-label"> {data.gameDay.substring(0, 10)} </label>
                    <div className="ip-matches-info">
                      <button className={data.pick === null ? "ip-matches-info-button"
                        : data.pick === data.team1Name ? (type === "current" ? "ip-matches-info-button-selected" : (data.pick === data.result ? "ip-matches-info-button-correct" : "ip-matches-info-button-incorrect"))
                          : "ip-matches-info-button"}
                        ><TeamBox name={data.team1Name} image={data.team1Image} /></button>
                      <label className="ip-vs-label"> VS </label>
                      <button className={data.pick === null ? "ip-matches-info-button"
                        : data.pick === data.team2Name ? (type === "current" ? "ip-matches-info-button-selected" : (data.pick === data.result ? "ip-matches-info-button-correct" : "ip-matches-info-button-incorrect"))
                          : "ip-matches-info-button"}
                       ><TeamBox name={data.team2Name} image={data.team2Image} /></button>
                    </div>
                  </div>

                )
              })}
            </div>
            <Pagination className="MuiPagination-ul" color="primary" count={Math.ceil(total / 5)} onChange={handlePageChange} />
          </div>
        </div>
      </div>
  )

}