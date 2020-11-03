import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import Header from './Header';
import {AuthContext} from '../Context/AuthContext';
import AuthService from '../Services/AuthService';

export default function Queue() {
  const [inQueue, setInQueue] = useState(false);
  const [waitConfirm, setWaitConfirm] = useState(false);
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
        if (data.data === "not found") {
          
        } else {  
          console.log("data", data);
          console.log("done", data.data.user);
          setInQueue(false);
          setWaitConfirm(true)
        }
      }).catch(() => {
        console.log("error");
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

    setInQueue(false);
    setWaitConfirm(false);

    axios.delete('http://localhost:5000/trivia/leaveQueue/' + authContext.user.username)
      .then(data => {
        console.log("Left the queue.");
      }).catch(() => {
        console.log("error leaving queue.");
      })
  }
  
  const confirmMatch = () => {
    console.log("CLICKLED CONFIRMED!", waitConfirm);

    axios.post("http://localhost:5000/trivia/createGame", { username: authContext.user.username, acs: 1 })
      .then(data => {
        console.log("GOT", data);
        if (data.data == "Match Declined" || data.data == "not found") {
          console.log("resume queue");
          setInQueue(true);
          setWaitConfirm(false);
        } else {
          setInQueue(false);
          setWaitConfirm(false);
        }
      }).catch(data => {
        console.log("ERROR in confirming", data);
        setInQueue(false);
        setWaitConfirm(false);
      })
  }

  return(
  <div>
    <button onClick={joinQueue}>join queue</button>
    <br></br>
    <button onClick={leaveQueue}>leave queue</button>
    <br></br>
    <span>{inQueue ? "QUEUE TIME" : "no"}</span>
    <br></br>
    <br></br>
    {waitConfirm ? <button onClick={confirmMatch}>{waitConfirm ? "CONFIRM" : ""} </button> : null}
  </div>
  );
}