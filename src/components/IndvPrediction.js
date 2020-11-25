import React, {useState,  useEffect, useContext} from "react"
import {AuthContext} from '../Context/AuthContext';
import "../styling/IndvPrediction.css"

export default function PredictionsView() { 
  const currentDate = new Date(); 
  const firstDayofWeek = currentDate.getDate() - currentDate.getDay(); 
  const lastDayofWeek = firstDayofWeek + 6; 
  const [selectedWeek, setCurrentWeek] = useState(currentDate); 
  const authContext = useContext(AuthContext); 
  const dummyData = [
    {date: "01/02/2019" ,team1: 'teamA', team2: 'teamB' },
    {date: "01/02/2019" ,team1: 'teamC', team2: 'teamD' },
    {date: "01/02/2019" ,team1: 'teamE', team2: 'teamF' },
    {date: "01/02/2019" ,team1: 'teamG', team2: 'teamH' },
  ]
  useEffect(() => {
    
  },[])
  return (
    <div className="ip-background">
      <div className="ip-header-section">
        
      </div>
      <div className="ip-matches-container">
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
      </div>
    </div> 
  )

}