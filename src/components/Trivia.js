import React, {useEffect, useContext, useState} from 'react';
import Header from './Header';
import axios from 'axios';
import InGameTrivia from './InGameTrivia';
import {AuthContext} from '../Context/AuthContext';
import AuthService from '../Services/AuthService';
import TriviaSidebar from './TriviaSidebar';

export default function Trivia(props) {
  const authContext = useContext(AuthContext);
  const [state, setState] = useState({ 
    mode:"nav", 
    username:{user: authContext.user.username} ,
    ppurl: {user: "", enemy: ""},
    stop: "nostop",
  });

  const handleModeSelect = mode => {
    const newState = {...state};

    console.log("mode select", mode);
    if (mode == "singlePlayer") {
      newState.mode = mode;
      newState.lists = [];
      newState.score = {"user": 0};
      newState.gameOver = false;

      axios.post('/trivia/solo/create', { username: authContext.user.username }).then(data => {
        console.log("START GOT", data.data);
  
        const next = {
          instance: data.data.instance,
          question: "",
          answer: ""
        }
  
        newState.instance = data.data.instance;
        newState.initialACS = {"user": data.data.acs};
        
        axios.put("/trivia/solo/next", next).then (nextData => {
          console.log("got next data", nextData.data);
          Object.keys(nextData.data).forEach((name, val) => { // copy over
            newState[name] = nextData.data[name];
          })
          newState.list = [{
            questionNumber: 1,
            question: nextData.data.currentQuestion,
          }];
          
          console.log("NEXT INITIAL", newState);
          newState.score = {user: 0};
          setState(newState);
        }).catch(e => {
          console.log("some error", e);
        })
      })
    }
  }

  const handleOptionSelect = option => {
    console.log(option);

    if (state.mode === "singlePlayer" && !state.gameOver && state.stop === "nostop") {
      const newState = {...state};
      newState.stop = "transition-immediate"
      newState.chosenOption = option;
      newState.chosenOptions = {user: state.options[option], enemy: ""};
      setState(newState);
    }
  }

  const [triviaPage, setTriviaPage] = useState(null);
  
  /*------------State Transitions----------------*/
  // A transition from state-immediate to fetching for next data
  useEffect(() => { 
    if (!("stop" in state) || state.stop !== "transition-immediate") {
      return;
    }

    console.log("TRANSITION 1");

    const next = {
      instance: state.instance,
      question: state.currentQuestion,
      answer: state.options[state.chosenOption],
    }

    axios.put("/trivia/solo/next", next).then (nextData => {
      console.log("TRIVIA NEXT", nextData.data);

      const newState = {...state};
      newState.score = {"user": nextData.data.score}; // needs to overwrite the copy
      newState.list[newState.list.length - 1].userCorrect = nextData.data.previous === "correct";
      newState.previousAnswer = nextData.data.previousAnswer;

      if ("questionCount" in nextData.data) { // Game goes on
        newState.nextData = nextData; // Store nextData for next transition
      } else {
        newState.finalACS = {user: nextData.data.acs};
        newState.acsChange = {user: nextData.data.points};
        newState.nextData = {data: {}}; // no next data
      }
      
      newState.gameOver = nextData.data.gameOver;
      newState.stop = "transition-showsolution"
      setState(newState);
    }).catch(e => {
      console.log("some error", e);
    })
  }, [state])

  // A transition from transition-showsolution to displaying the next question
  useEffect(() => { 
    if (!("stop" in state) || state.stop !== "transition-showsolution") {
      return;
    }

    console.log("TRANSITION 2");

    const showNextQuestion = () => {
      const newState = {...state};
      const nextData = state.nextData;

      // Remove transition state
      newState.previousAnswer = "";
      newState.previousAnswer = {};

      if ("questionCount" in nextData.data) { // Game goes on
        Object.keys(nextData.data).forEach((name, val) => { // copy over from nextData.data
          if (name === "score") {
            return;
          }
          newState[name] = nextData.data[name];
        }) 
        newState.list.push({
          questionNumber: nextData.data.questionCount,
          question: nextData.data.currentQuestion,
        })
        newState.startTime = Date.parse(nextData.data.time);
      }

      newState.stop = "nostop";
      setState(newState);
    }

    setTimeout(showNextQuestion, 2000);
  }, [state])

  // Render on change of state
  useEffect(() => {
    let nextTriviaPage = <InGameTrivia {...state} handleModeSelect={handleModeSelect} handleOptionSelect={handleOptionSelect}/>;
    setTriviaPage(nextTriviaPage);
  }, [state]);

  // Initial fetch of user image
  useEffect(() => {
    fetch("/profile/" + authContext.user.username).then(res => res.json())
      .then(data => {
        const newState = {...state};
        if ("ppurl" in newState) {
          newState.ppurl.user = data.image;
        } else {
          newState.ppurl = {
            user: data.image
          }
        }
        setState(newState);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [])

  return(
    <div>
      {triviaPage}
    </div>
  );
}