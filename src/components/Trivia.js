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
    stop: nostop | single-transition-immediate | transition-showSolution | toNav  // a state
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
      initOnline("user2");
    } else if (mode === "practice") {
      const fetchInit = {
        method: "post",
        body: JSON.stringify({
          user1: "user3",
          user2: "user2",
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
          console.log("got update", updateData.gameInstance);

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
              console.log("FINAL DATA", finalData.gameInstance);
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
        user: authContext.user.username,
        enemy: enemy,
      }),
      headers: {'Content-Type' : 'application/json'}
    }
    console.log("Request online init", fetchInit);
    fetch('/trivia/head-to-head/init', fetchInit).then(res => res.json())
    .then((initData) => {
      console.log("got init", initData);
      newState.instance = initData._id
      newState.stop = "getenemyimage";
      setState(newState);
    })
  }

  const handleOptionSelect = option => {
    console.log(option);

    if (state.mode === "singlePlayer" && !state.gameOver && state.stop === "nostop") {
      const newState = {...state};
      newState.stop = "single-transition-immediate"
      newState.chosenOption = option;
      newState.chosenOptions = {user: state.options[option], enemy: ""};
      setState(newState);
    } else if (state.mode === "online" && !state.gameOver) {
      const newState = {...state};
      newState.chosenOption = option;
      newState.unSubmitted = true;
      newState.chosenOptions = {user: state.options[option], enemy: ""};
      newState.stop = "repeat";
      // clearTimeout(state.timeOut); // clear any previous fetch timer
      setState(newState);
    }
  }

  const processOptionSelect = () => {
    if (state.mode !== "online") {
      console.log("ERROR mode can only be online");
      return;
    }

    if (!("unSubmitted" in state && state.unSubmitted == true)) {
      console.log("ERROR option is not new.");
      return;
    }

    console.log("Process option...");
    const newState = {...state}
    newState.unSubmitted = false;
    newState.stop = "fetch";
    setState(newState);
  }

  const [triviaPage, setTriviaPage] = useState(null);
  
  /*------------State Transitions----------------*/
  // A transition from state-immediate to fetching for next data
  useEffect(() => { 
    if (!("stop" in state) || state.stop !== "single-transition-immediate") {
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
    if (!("stop" in state) || state.stop !== "toNav") {
      return;
    }
    
    setState(deepcopy(initialState));
  }, [state])

  // // check for a user submission
  // useEffect(() => {
  //   if (!("stop" in state) || state.stop !== "checkSubmit") {
  //     return;
  //   }

  //   if ("unSubmitted" in state && state.unSubmitted == true) {
  //     clearTimeout(state.timeOut); // clear any previous fetch timer
  //     processOptionSelect();
  //   }
  // }, [state.stop])

  // an infinite loop
  useEffect(() => {
    if (!("stop" in state) || state.stop !== "repeat") {
      return;
    }
    
    clearTimeout(state.timeOut); // clear any previous fetch timer

    // Check if there is a selected, unprocessed answer
    if ("unSubmitted" in state && state.unSubmitted == true) {
      processOptionSelect();
    } else {
      // Otherwise go fetch again
      const timeOut = setTimeout(() => {
        const newState = {...state};
        newState.stop = "fetch";
        newState.timeOut = timeOut;
        setState(newState);
      }, 1000);
    }
  }, [state.stop])

  // For multiplayer, fetch the state, transition to "repeat"
  useEffect(() => {
    if (!("stop" in state) || state.stop !== "fetch") {
      return;
    }

    const fetchUpdate = {
      method: "put",
      body: JSON.stringify({
        _id: state.instance,
        user: authContext.user.username
      }),
      headers: {'Content-Type' : 'application/json'}
    }

    // console.log("Fetching state...", fetchUpdate);
    fetch('/trivia/head-to-head/update', fetchUpdate).then(res => res.json())
    .then((updateData) => {
      const data = updateData.gameInstance;
      // console.log("got update", updateData);

      const newState = {...state}

      // update score
      newState.score = {user: data.users.user.point, enemy: data.users.enemy.point};
      newState.acsChange = {user: data.users.user.acsChange, enemy: data.users.enemy.acsChange};
      
      // update displayed questions and answers
      const currentQuestion = data.questions[data.curQuestionIndex];
      newState.currentQuestion = currentQuestion.triviaQuestion.question;
      newState.options = currentQuestion.triviaQuestion.options;

      const list = [] // construct list
      let questionNumber = 0;
      data.questions.forEach(e => {
        const question = e.triviaQuestion.question;
        questionNumber++;
        
        const entry = {
          questionNumber: questionNumber,
          question: question,
        }

        if (questionNumber - 1 < data.curQuestionIndex) { // answers present!
          const userCorrect = "accuracy" in currentQuestion.responses.user ? currentQuestion.responses.user.accuracy : false;
          const enemyCorrect = (currentQuestion.responses.enemy != null && "accuracy" in currentQuestion.responses.enemy) 
            ? currentQuestion.responses.enemy.accuracy : false;
          entry.userCorrect = userCorrect;
          entry.enemyCorrect = enemyCorrect;
        }
        list.push(entry);
      })

      newState.list = list;
      newState.stop = "repeat";
      console.log("new state", newState);
      setState(newState);
    })
  }, [state.stop])

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
            enemy: data.images
          }
        }
        console.log("Fetched enemy url");
        newState.stop = "fetch"; // goto fetch
        setState(newState);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [JSON.stringify(state.username)])

  // Render on change of state
  useEffect(() => {
    let nextTriviaPage = <InGameTrivia {...state} handleModeSelect={handleModeSelect} handleOptionSelect={handleOptionSelect}/>;
    setTriviaPage(nextTriviaPage);
  }, [state]);

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