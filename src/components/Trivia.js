import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import Header from './Header';
import {AuthContext} from '../Context/AuthContext';
import AuthService from '../Services/AuthService';

export default function Trivia() {

  const [inQueue, setInQueue] = useState(false);
  const authContext = useContext(AuthContext);

  const joinQueue = (e) => {
    axios.post("http://localhost:5000/trivia/joinQueue", { username: authContext.user.username, acs: 1 })
      .then(data => {
        console.log("GOT", data);
        console.log("joining queue");
        setInQueue(true);
      }).catch(data => {
        console.log("ERROR in joining", data);
      })
  }

  const findMatch = () => {
    if (!inQueue) {
      return;
    }

    axios.put("http://localhost:5000/trivia/findMatch", { username: authContext.user.username, acs: 1 })
      .then(data => {
        if (data.data.user === "not found") {
          // findMatch();
        } else {  
          console.log("done", data.data.user);
          setInQueue(false);
        }
      }).catch(() => {
        console.log("error");
        // findMatch();
      })
  }

  useEffect(() => {
    if (inQueue) {
      const interval = setInterval(() => {
        findMatch();
      }, 200);
      return () => clearInterval(interval);
    }
  }, [inQueue])

  const leaveQueue = (e) => {
    console.log("Toggle off.");
    
    const body = {
      data: {
        username: authContext.user.username,
        acs: 1
      }
    }

    setInQueue(false);
    axios.delete('http://localhost:5000/trivia/leaveQueue/' + authContext.user.username)
      .then(data => {
        console.log(data);
        console.log(inQueue);
        console.log("Left the queue.");
      }).catch(() => {
        console.log("error leaving queue.");
      })
  }

  return(
  <div>
    <button onClick={joinQueue}>join queue</button>
    <br></br>
    <button onClick={leaveQueue}>leave queue</button>
    <br></br>
    <span>{inQueue ? "QUEUE TIME" : "no"}</span>
  </div>
  );
}