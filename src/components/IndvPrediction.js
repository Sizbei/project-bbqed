import React, {useState,  useEffect, useContext} from "react"
import {AuthContext} from '../Context/AuthContext';

const dummyDate = [
  {date: "01/02/2019" ,team1: 'teamA', team2: 'teamB' },
  {date: "01/02/2019" ,team1: 'teamC', team2: 'teamD' },
  {date: "01/02/2019" ,team1: 'teamE', team2: 'teamF' },
  {date: "01/02/2019" ,team1: 'teamG', team2: 'teamH' },
]
export default function PredictionsView() { 
  const currentDate = new Date(); 
  const firstDayofWeek = curr.getDate() - curr.getDay(); 
  const lastDayofWeek = firstDayofWeek + 6; 
  const [selectedWeek, setCurrentWeek] = useState(currentDate); 
  const authContext = useContext(AuthContext); 

  useEffect(() => {
    
  },[])
  return (
    <div>
      
    </div> 
  )

}