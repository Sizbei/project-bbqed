import React, {useEffect, useContext, useState} from 'react';
import Header from './Header';
import axios from 'axios';
import InGameTrivia from './InGameTrivia';
import {AuthContext} from '../Context/AuthContext';
import AuthService from '../Services/AuthService';
import TriviaSidebar from './TriviaSidebar';

export default function Trivia(props) {
  const [state, setState] = useState({});
  // const initialTriviaProps = {
  //   mode: mode,
  //   ourUsername: "user1",
  //   enemyUsername: "user3",
  //   gameOver: false,

  //   questionNumber: 5,
  //   currentQuestion: "If A eats B and B eats C, then can A eat C?",
  //   options: ["happy feet", "wombo combo", "**incoherent screaming", "..."],
  // }

  const [triviaProps, setTriviaProps] = useState(null);
  const authContext = useContext(AuthContext);

  const handleModeSelect = mode => {
    const newState = {}
    newState.mode = mode;

    if (mode == "singlePlayer") {
      axios.post('/trivia/solo/create', { username: authContext.user.username }).then(data => {
        console.log("TRIVIA GOT", data.data);
  
        const next = {
          instance: data.data,
          question: "",
          answer: ""
        }
  
        newState.instance = data.data;
        
        axios.put("/trivia/solo/next", next).then (nextData => {
          console.log("TRIVIA NEXT", nextData.data);
          newState.triviaProps = nextData.data;
          setState(newState);
        }).catch(e => {
          console.log("some error", e);
        })
      })
    }
  }

  const handleOptionSelect = option => {
    console.log(option);

    const next = {
      instance: state.instance,
      question: state.triviaProps.currentQuestion,
      answer: state.triviaProps.options[option]
    }

    console.log("SENT", next);

    axios.put("/trivia/solo/next", next).then (nextData => {
      console.log("TRIVIA NEXT", nextData.data);
      const newState = {...state};
      newState.triviaProps = nextData.data;
      setState(newState);
    }).catch(e => {
      console.log("some error", e);
    })
  }

  // const triviaPage = "triviaProps" in state ? <InGameTrivia {...state.triviaProps} 
  // handleOptionSelect={handleOptionSelect} /> : null;

  const [triviaPage, setTriviaPage] = useState(null);
  
  useEffect(() => {
    // console.log("NOTHING IS HAPPENING", JSON.stringify(state));
    let nextTriviaPage = "triviaProps" in state ? <InGameTrivia {...state.triviaProps} 
      handleOptionSelect={handleOptionSelect} /> : null;
    setTriviaPage(nextTriviaPage);
  }, [state]);

  return(
    <div>
      {triviaPage}
      {/* <TriviaSidebar /> */}
      <button onClick={() => handleModeSelect("singlePlayer")}> Single Player</button>
    </div>
  );
}