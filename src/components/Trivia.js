import React, {useEffect, useContext, useState} from 'react';
import Header from './Header';
import axios from 'axios';
import InGameTrivia from './InGameTrivia';
import {AuthContext} from '../Context/AuthContext';
import AuthService from '../Services/AuthService';
import TriviaSidebar from './TriviaSidebar';

export default function Trivia(props) {
  const [state, setState] = useState({ mode:"nav" });
  const authContext = useContext(AuthContext);

  const handleModeSelect = mode => {
    const newState = {...state};

    if (mode == "singlePlayer") {
      newState.mode = mode;
      newState.lists = [];
      newState.score = {"user": 0};
      axios.post('/trivia/solo/create', { username: authContext.user.username }).then(data => {
        console.log("TRIVIA GOT", data.data);
  
        const next = {
          instance: data.data.instance,
          question: "",
          answer: ""
        }
  
        newState.instance = data.data.instance;
        newState.initialACS = data.data.acs;
        
        axios.put("/trivia/solo/next", next).then (nextData => {
          console.log("TRIVIA NEXT", nextData.data);
          newState.triviaProps = nextData.data;
          newState.list = [{
            questionNumber: 1,
            question: nextData.data.currentQuestion,
          }];
          console.log("NEWTTATE", newState);
          setState(newState);
        }).catch(e => {
          console.log("some error", e);
        })
      })
    }
  }

  const handleOptionSelect = option => {
    console.log(option);

    if (state.mode === "singlePlayer") {
      const next = {
        instance: state.instance,
        question: state.triviaProps.currentQuestion,
        answer: state.triviaProps.options[option]
      }
  
      console.log("SENT", next);
      
      axios.put("/trivia/solo/next", next).then (nextData => {
        console.log("TRIVIA NEXT", nextData.data);
        if ("questionCount" in nextData.data) {
          const newState = {...state};
          newState.triviaProps = nextData.data;
          newState.list[newState.list.length - 1].userCorrect = nextData.data.previous === "correct";
          newState.list.push({
            questionNumber: nextData.data.questionCount,
            question: nextData.data.currentQuestion,
          })
          setState(newState);
        } else { // Game over
          const newState = {...state};
          
        }
      }).catch(e => {
        console.log("some error", e);
      })
    }
  }

  const [triviaPage, setTriviaPage] = useState(null);
  
  useEffect(() => {
    let nextTriviaPage = <InGameTrivia {...state.triviaProps} 
      mode={state.mode} handleModeSelect={handleModeSelect} handleOptionSelect={handleOptionSelect} list={state.list} score={state.score}/>;
    setTriviaPage(nextTriviaPage);
  }, [state]);

  return(
    <div>
      {triviaPage}
    </div>
  );
}