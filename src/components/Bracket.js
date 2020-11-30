import React, {useEffect, useRef, useState} from 'react';
import BracketView from './BracketView.js';

export default function BracketController(props) {
  const codes = [
    "WC-QF1A",
    "WC-QF1B",
    "WC-QF2A",
    "WC-QF2B",
    "WC-QF3A",
    "WC-QF3B",
    "WC-QF4A",
    "WC-QF4B",
    "WC-SF1A",
    "WC-SF1B",
    "WC-SF2A",
    "WC-SF2B",
    "WC-FA",
    "WC-FB",
    "FA",
    "FB",
    "EC-FA",
    "EC-FB",
    "EC-SF1A",
    "EC-SF1B",
    "EC-SF2A",
    "EC-SF2B",
    "EC-QF1A",
    "EC-QF1B",
    "EC-QF2A",
    "EC-QF2B",
    "EC-QF3A",
    "EC-QF3B",
    "EC-QF4A",
    "EC-QF4B",
  ]

  // contain the teams that are represented in the bracket
  const [teams, setTeams] = useState({
    "WC-QF1A": "Atlanta Hawks",
    "WC-QF1B": "Boston Celtics",
    "WC-QF2A": "Brooklyn Nets",
    "WC-QF2B": "Charlotte Hornets",
    "WC-QF3A": "Chicago Bulls",
    "WC-QF3B": "Cleveland Chandeliers",
    "WC-QF4A": "Dallas Mavericks",
    "WC-QF4B": "Minnesota Timberwolves",
    "EC-QF1A": "Portland Trail Blazers",
    "EC-QF1B": "Detroit Pistons",
    "EC-QF2A": "Toronto Raptors",
    "EC-QF2B": "Washington Wizards",
    "EC-QF3A": "Miami Heat",
    "EC-QF3B": "Milwaukee Bucks",
    "EC-QF4A": "Golden State Warriors",
    "EC-QF4B": "Houston Rockets",
  })  

  const [predictions, setPredictions] = useState({
    "WC-QF1": null,
    "WC-QF2": null,
    "WC-QF3": null,
    "WC-QF4": null, 
    "WC-SF1": null,
    "WC-SF2": null,
    "WC-F": null,
    "F": null,
    "EC-F": null,
    "EC-SF1": null,
    "EC-SF2": null,
    "EC-QF1": null,
    "EC-QF2": null,
    "EC-QF3": null,
    "EC-QF4": null,
  });

  // the actual results of the games
  const [results, setResults] = useState({
    "WC-QF1": null,
    "WC-QF2": null,
    "WC-QF3": null,
    "WC-QF4": null, 
    "WC-SF1": null,
    "WC-SF2": null,
    "WC-F": null,
    "F": null,
    "EC-F": null,
    "EC-SF1": null,
    "EC-SF2": null,
    "EC-QF1": null,
    "EC-QF2": null,
    "EC-QF3": null,
    "EC-QF4": null,
  });

  // the change to the user's acs
  const [acsChange, setAcsChange] = useState('none');

  const [counter, setCounter] = useState(0); // ensure updates for child useEffect so that onClick remains fresh

  const getOpposingTreeIndex = (treeIndex) => {
    return treeIndex % 2 == 0 ? treeIndex + 1 : treeIndex - 1;
  }

  const toMatchName = (treeIndex) => {
    if (treeIndex === 1) {
      return 'winner';
    }
    // get the upper index for single representative
    const representative = treeIndex % 2 == 0 ? treeIndex : treeIndex - 1;

    const map = {
      1: "CHAMPION",
      2: "F",
      4: "WC-F",
      6: "EC-F",
      8: "WC-SF1",
      10: "WC-SF2",
      12: "EC-SF1",
      14: "EC-SF2",
      16: "WC-QF1",
      18: "WC-QF2",
      20: "WC-QF3",
      22: "WC-QF4",
      24: "EC-QF1",
      26: "EC-QF2",
      28: "EC-QF3",
      30: "EC-QF4",
    }

    return map[representative];
  }

  // Translate 0-30 to a tree index
  // the winner is the tree index 1
  const toTreeIndex = {
    0: 16,
    1: 17,
    2: 18,
    3: 19,
    4: 20,
    5: 21,
    6: 22,
    7: 23,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 4,
    13: 5,
    14: 2,
    15: 3,
    16: 6,
    17: 7,
    18: 12,
    19: 13,
    20: 14,
    21: 15,
    22: 24,
    23: 25,
    24: 26,
    25: 27,
    26: 28,
    27: 29,
    28: 30,
    29: 31,
    30: 1,
  }

  // Reverse toTreeIndex
  const toPostIndex = (function() {
    const reverse = {}
    Object.keys(toTreeIndex).forEach(key => {
      reverse[toTreeIndex[key]] = key;
    })
    return reverse;
  }())

  const hasChildren = (treeIndex) => {
    return treeIndex < 16;
  }

  const parent = (treeIndex) => {
    if (treeIndex <= 1) {
      return 'None';
    }

    if (treeIndex % 2 == 0) {
      return treeIndex / 2;
    } else {
      return (treeIndex - 1) / 2;
    }
  }


  const onClick = (index) => {
    setCounter(counter + 1);

    const teamName = teams[codes[index]];
    let treeIndex = toTreeIndex[index];
    
    console.log("start", predictions);
    const newPredictions = {...predictions};
    const matchName = toMatchName(treeIndex);
    const previousPrediction = predictions[matchName];

    let newPrediction = null; 

    if (!hasChildren(treeIndex)) {
      newPrediction = teamName;
      console.log("LEAF NODE", newPrediction);
    } else {
      const predictedUs = newPredictions[toMatchName(2 * treeIndex)];
      const predictedOther = newPredictions[toMatchName(2 * getOpposingTreeIndex(treeIndex))];

      if (predictedUs === null || predictedOther === null) {
        console.log("Nothing to predict here.");
      } else {
        newPrediction = predictedUs;
      }
    }

    newPredictions[matchName] = newPrediction;

    // Reset predictions for higher levels if it's new
    if (newPrediction !== previousPrediction) {
      let resetTreeIndex = parent(treeIndex);
      while (resetTreeIndex != 1) {
        newPredictions[toMatchName(resetTreeIndex)] = null;
        resetTreeIndex = parent(resetTreeIndex);
      }
    }

    setPredictions(newPredictions);
  }

  console.log("predictions", predictions);

  const slots = (function(){
    const slots = Array(31).fill(0).map((el, i) => {
      const treeIndex = toTreeIndex[i];
      
      if (!hasChildren(treeIndex)) {
        return teams[codes[i]]
      } else {
        const childPrediction = predictions[toMatchName(2 * treeIndex)];
        return childPrediction;
      }
    })
    return slots;
  }());

  return <BracketView slots={slots} onClick={onClick} counter={counter}/>
}

