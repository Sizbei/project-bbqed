import React, {useEffect, useContext, useState} from 'react';
import Header from './Header';
import axios from 'axios';
import InGameTrivia from './InGameTrivia';
import {AuthContext} from '../Context/AuthContext';
import AuthService from '../Services/AuthService';
import TriviaSidebar from './TriviaSidebar';

/* State.
  state = {
    mode: nav | singlePlayer | online | practice
    username: {user:, enemy:}
    ppurl: {user:, enemy:}
    stop: nostop | transition-immediate | transition-showSolution | toNav  // a state
    showPostScreen: bool
    lists = [{questionNumber:, question:, enemyCorrect:, userCorrect:}];
    score = {user:, enemy: };
    acsChange = {user:, enemy:}
    instance: // a matchId
    initialACS {user:, enemy:}
  }
*/

export default function Trivia(props) {
  const authContext = useContext(AuthContext);
  const [initialState, setInitialState] = useState({  // still gets modified by one useEffect() to get urls
    mode:"nav", 
    username:{user: authContext.user.username},
    ppurl: {user: "", enemy: ""},
    stop: "nostop",
    showPostScreen: false,
    list: [],
    score: {},
    acsChange: {},
    instance: null,
  });

  const [state, setState] = useState(deepcopy(initialState));

  const handleModeSelect = req => {
    const newState = deepcopy(initialState);

    let mode = req;
    if (req === "playAgain") {
      mode = state.mode;
    }
    console.log("mode select", req, mode);

    /*-----handle navigation--------*/
    if (mode === "nav") {
      newState.stop = "toNav";
      setState(newState);
    } else if (mode === "singlePlayer") {
      newState.mode = mode;
      newState.lists = [];
      newState.score = {"user": 0};
      newState.acsChange = {}
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
    } else if (mode === "online") {
      initOnline("user1");
    } else if (mode === "practice") {
      const fetchInit = {
        method: "post",
        body: JSON.stringify({
          user1: "user3",
          user2: "user1"
        }),
        headers: {'Content-Type' : 'application/json'}
      }

      console.log("Request online init", fetchInit);
      fetch('/trivia/head-to-head/init', fetchInit).then(res => res.json())
      .then((initData) => {
        console.log("got init", initData);

        const fetchUpdate = {
          method: "put",
          body: JSON.stringify({_id: initData._id}),
          headers: {'Content-Type' : 'application/json'}
        }

        console.log("Request update", fetchUpdate);
        fetch('/trivia/head-to-head/update', fetchUpdate).then(res => res.json())
        .then((updateData) => {
          console.log("got update", updateData);
          console.log("got update", updateData.gameInstance.currentQuestionIndex);

          const fetchSubmit = {
            method: "post",
            body: JSON.stringify({
              _id: initData._id,
              username: "user3",
              answer: "blah blah blah",
            }),
            headers: {'Content-Type' : 'application/json'}
          }
          fetch('/trivia/head-to-head/submit', fetchSubmit).then(res => res.json())
          .then((updateSubmit) => {
            console.log("got submit data", updateSubmit);

            const fetchFinalUpdate = {
              method: "put",
              body: JSON.stringify({_id: initData._id}),
              headers: {'Content-Type' : 'application/json'}
            }
    
            fetch('/trivia/head-to-head/update', fetchFinalUpdate).then(res => res.json())
            .then((finalData) => {
              console.log("FINAL DATA", finalData.gameInstance.currentQuestionIndex);
            })
          })
        })
      })
    }
  }

  const initOnline = (enemy) => {
    const newState = deepcopy(initialState);
    newState.mode = "online";
    newState.list = [];
    newState.username["enemy"] = enemy;
    newState.score = {"user": 0, "enemy": 0};
    newState.acsChange = {}
    newState.gameOver = false;

    const fetchInit = {
      method: "post",
      body: JSON.stringify({
        user1: authContext.user.username,
        user2: enemy,
      }),
      headers: {'Content-Type' : 'application/json'}
    }
    console.log("Request online init", fetchInit);
    fetch('/trivia/head-to-head/init', fetchInit).then(res => res.json())
    .then((initData) => {
      console.log("got init", initData);
      setState(newState);
    })
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
      setState(deepcopy(newState));      
    }

    setTimeout(showNextQuestion, 2000);
  }, [state])

  // Transition from anywhere to nav screen
  useEffect(() => {
    console.log("PRINT THIS", state);
    console.log("initial", initialState);
    if (!("stop" in state) || state.stop !== "toNav") {
      return;
    }
    
    setState(deepcopy(initialState));
  }, [state])

  // Render on change of state
  useEffect(() => {
    let nextTriviaPage = <InGameTrivia {...state} handleModeSelect={handleModeSelect} handleOptionSelect={handleOptionSelect}/>;
    setTriviaPage(nextTriviaPage);
  }, [state]);

  // Fetch this user's image
  useEffect(() => {
    fetch("/profile/" + authContext.user.username).then(res => res.json())
      .then(data => {
        const newState = deepcopy(state);
        if ("ppurl" in newState) {
          newState.ppurl.user = data.image;
        } else {
          newState.ppurl = {
            user: data.image
          }
        }
        setInitialState(deepcopy(newState));
        setState(newState);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [])

  // Fetch the enemy's image
  useEffect(() => {
    if (!("username" in state) || !("enemy" in state.username) || state.username.enemy == "") {
      return;
    }

    fetch("/profile/" + state.username.enemy).then(res => res.json())
      .then(data => {
        const newState = deepcopy(state);
        if ("ppurl" in newState) {
          newState.ppurl.enemy= data.image;
        } else {
          newState.ppurl = {
            enemy: data.image
          }
        }
        console.log("WET ENEMEY URL", newState);
        setState(newState);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [state.username])

  return(
    <div>
      {triviaPage}
    </div>
  );
}

function deepcopy(o) {
  // return JSON.parse(JSON.stringify(o))
  return {...o}
}