import React, {useState,  useEffect, useContext} from "react"
import {AuthContext} from '../Context/AuthContext';
import "../styling/IndvPrediction.css";
import TeamBox from './TeamBox'; 

export default function PredictionsView() { 
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [currentMatches, setCurrentMatches] = useState([]); 
  const [finishedMatches, setFinishedMatches] = useState([]); 
  const authContext = useContext(AuthContext); 
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
  useEffect(() => {
    fetch("/prediction/season/current").then(res => res.json())
    .then (data=> {
      setCurrentMatches(data.currentSeasonals); 
      console.log(currentMatches);

    })
    .catch((error) => { 
      console.log(error); 
    })

    fetch("/prediction/season/past").then(res => res.json()) 
    .then (data=> {
      setFinishedMatches(data.pastSeasonals); 
    })
    .catch((error) => {
      console.log(error); 
    })
  },[])

  const handleSelection= (teamName) => { 
    fetch().then(res => res.json())
    .then (data=> {
      
    })
    .catch((error) => { 
      console.log(error); 
    })
  }

  return (
    <div className="ip-background">
      <div className="ip-full-container">
        <div className="ip-header-section">
          <button className="ip-navigation-buttons"> {"<"}</button>
          <button className="ip-navigation-buttons"> {">"}</button>
        </div>
        <div className="ip-matches-container">
          {currentMatches.map(data=> { 
            return(
              <div className="ip-match-row-container">
                <label> {data.gameDay.substring(0,10)} </label>
                <div className="ip-teams-versus">
                  <button><TeamBox name={data.team1Name} image={data.team1Image}/></button>
                  <label> VS </label>
                  <button><TeamBox name={data.team2Name} image={data.team2Image}/></button>
                </div>
              </div>
          
          )})}
        </div>
      </div>
    </div> 
  )

}