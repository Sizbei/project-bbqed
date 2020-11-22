import React, {useEffect, useRef, useState} from 'react';
import BracketView from './BracketView.js';

// // aka leaf
// class BaseMatch {
//   constructor(parent, top, bottom) {
//     this.parent = parent;
//     this.top = top;
//     this.bottom = bottom;
//   }
// }

// aka non-leaf node
// class Match {
//   constructor(parent) {
//     this.parent = parent;
//   }

//   copy() {
//     return new Match(this.parent);
//   }

//   update() {
    
//   }
// }

export default function BracketController(props) {
  const teams = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
  ]

  const [selected, setSelected] = useState(Array(32).fill(false));
  const [slots, setSlots] = useState(Array(32).fill(0).map((el, i) => i));

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

  // Translate 0-29 to a tree index
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
  }

  // Reverse toTreeIndex
  const toPostIndex = (function() {
    const reverse = {}
    Object.keys(toTreeIndex).forEach(key => {
      reverse[toTreeIndex[key]] = key;
    })
    return reverse;
  }())

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
    const treeIndex = toTreeIndex[index];

    // is it a new prediction?
    // update predictions if yes


    // console.log(translateToTreeIndex[index])

    // let path = toTreeIndex[index];
    // while (path != 'None') {
    //   console.log(toPostIndex[path]);
    //   path = parent(path);
    // }
  }

  const [tree, setTree] = useState(null);

  useEffect(() => {
    // const parent1 = new Match(null);
    // const child1 = new BaseMatch(tree, "team a", "team b");
    // const child2 = new BaseMatch(tree, "team c", "team d");
    // setTree(parent1);
  }, [])

  console.log(tree);

  return <BracketView slots={slots} onClick={onClick}/>
}

