import React, {Component, useState, useEffect} from 'react';
import axios from 'axios';
import Header from './Header';

function Child(props) {
  const [childState, setChildState] = useState(1);
  const on = props.on;
  const setF = props.setF;
  
  const somefunc = () => {
    setChildState(childState + 1);
    return 0;
  }

  useEffect(() => {
    setF(() => somefunc); // note that this is equivalent to () => () => somefunc()
    // props.r(() => somefunc); // alternate solution

    // Since the inner function modifies childState, need to re-bind the updated function somefunc 
    // (it seems even the value of childState in somefunc is hardcoded in setF(() => () => somefunc());)
  }, [childState]) 

  let onText = on ? <div> On!!!</div> : <div> Off.</div>;
  let childText = <div> State changed in child function but called outside: {childState} </div>;
  return (
    <div>
      {onText}
      {childText}
      <div> State changed in child function but called outside: {childState} </div>
    </div>
  )
}

export default function Trivia() {
  const [on, setOn] = useState(false);
  const [f, setF] = useState();
  return (
    <div>
      <Child on={on} setF={setF} r={e => {setF(e)}}/>
      <button onClick={() => {setOn(!on)}}> Change State</button>
      <button onClick={() => {console.log("Got:", f())}}> Call child function</button>
    </div>
  )
}
