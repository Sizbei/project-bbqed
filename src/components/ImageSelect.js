import Axios from 'axios';
import React, { Component, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, useHistory} from "react-router-dom";
import logo from "../res/images/76ers.png"
import axios from 'axios';

import "../styling/ImageSelect.css"

function Tile(props) {
  const name = props.name;
  const image = props.image;

  const [selected, setSelected] = useState(false);
  
  const handleClick = (e) => {
    setSelected(!selected);
  }

  return (
  <td className="imageselect-tile">
    <div className={selected ? "image-tile-selected" : "image-tile-unselected"} onClick={handleClick}>
      <img className="imageselect-image" src={process.env.PUBLIC_URL + image} ></img>
    </div>
  </td> 
  )
}

function ImageSelect(props) {
  const width = props.width;
  const data = props.data;
  const onSubmitHandler = props.onSubmit

  const tiles = data.map((e) => <Tile name={e["name"]} image={e["image"]} key={e["name"]} />)

  let buffer = []

  for (var row = 0; row < Math.ceil(data.length / width); row++) {
    let tr_contents = []

    for (var col = 0; col < width; col++) {
      const index = row * width + col;
      if (index < tiles.length) {
        tr_contents.push(tiles[index])
      }
    }

    buffer.push(
      <tr key={row}>
        {tr_contents}
      </tr>
    )
  }

  const getData = () => {
    onSubmitHandler(1);
  }

  return (
    <div className="imageselect-container">
      <table className="imageselect-table">
        <tbody>
          {buffer}
        </tbody>
      </table>

      <button onClick={getData}>Submit!</button>
    </div>  
  )
}

export default function ImageTest(props) {

  const [initialized, setInitialized] = useState(false);
  const [imageSelect, setImageSelect] = useState(null);

  const handleImageSelectData = (result) => {
    console.log(result);
  }

  // Use useEffect or componentDidMount to do get requests only once
  // https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects  
  useEffect(() => {
    console.log("using effect...");
    axios.get('http://localhost:5000/teams/', "").then(
      (e) => {
        console.log("Got");
        setImageSelect(<ImageSelect data={e.data} width={6} onSubmit={handleImageSelectData} />)
      }
    ); 
  }, [])

  return (
    <div className="div-test">
      <span>Text.</span>
      {imageSelect}
    </div>
  )
}