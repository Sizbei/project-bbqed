import React, {useEffect, useContext, useState} from 'react';
import Header from './Header';
import axios from 'axios';
import InGameTrivia from './InGameTrivia';
import {AuthContext} from '../Context/AuthContext';
import AuthService from '../Services/AuthService';
import TriviaSidebar from './TriviaSidebar';

export default function Trivia(props) {
  const authContext = useContext(AuthContext);
  const [state, setState] = useState({ mode:"nav", username:{user: authContext.user.username} });

  const handleModeSelect = mode => {
    const newState = {...state};

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
          setState(newState);
        }).catch(e => {
          console.log("some error", e);
        })
      })
    }
  }

  const handleOptionSelect = option => {
    console.log(option);

    if (state.mode === "singlePlayer" && !state.gameOver) {
      const next = {
        instance: state.instance,
        question: state.currentQuestion,
        answer: state.options[option]
      }
  
      console.log("SENT", next);
      
      axios.put("/trivia/solo/next", next).then (nextData => {
        console.log("TRIVIA NEXT", nextData.data);
        if ("questionCount" in nextData.data) {
          const correct = nextData.data.previous === "correct";
          const newState = {...state};
          Object.keys(nextData.data).forEach((name, val) => { // copy over
            newState[name] = nextData.data[name];
          }) 
          newState.list[newState.list.length - 1].userCorrect = correct;
          newState.list.push({
            questionNumber: nextData.data.questionCount,
            question: nextData.data.currentQuestion,
          })
          newState.gameOver = nextData.data.gameOver;
          newState.startTime = Date.parse(nextData.data.time);
          newState.score = {"user": nextData.data.score};
          setState(newState);
        } else { // Game over
          const newState = {...state};
          const correct = nextData.data.previous === "correct";
          newState.list[newState.list.length - 1].userCorrect = correct;
          newState.score = {"user": nextData.data.score};
          newState.gameOver = true;
          setState(newState);
        }
      }).catch(e => {
        console.log("some error", e);
      })
    }
  }

  const [triviaPage, setTriviaPage] = useState(null);
  
  useEffect(() => {
    let nextTriviaPage = <InGameTrivia {...state} handleModeSelect={handleModeSelect} handleOptionSelect={handleOptionSelect}/>;
    setTriviaPage(nextTriviaPage);
  }, [state]);

  useEffect(() => {
    fetch("/profile/" + authContext.user.username).then(res => res.json())
          .then(data => {
            const newState = {...state};
            if ("ppurl" in newState) {
              newState.ppurl.user = data.image;
            } else {
              newState.ppurl = {
                user: data.image,
                enemy: ""
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