import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Route, useHistory} from "react-router-dom";
import logo from "../res/images/76ers.png"

import "../styling/ImageSelect.css"

function Tile(props) {
  console.log(props.imgKey);
  const imgKey = props.imgKey;
  const path = props.path;

  const [selected, setSelected] = useState(false);
  
  return (
  <td className="imageselect-tile" onClick={() => console.log("clicked " + imgKey) }>
    <div className="image-tile">
      <img className="imageselect-image" src={process.env.PUBLIC_URL + path} ></img>
    </div>
  </td> 
  )
}

export default function ImageSelect(props) {
  return (
    <div className="imageselect-container">
      <table className="imageselect-table">
        <tbody>
          <tr>
            <Tile imgKey="76ers" path="../res/images/76ers.png" />
            <Tile imgKey="TorontoRaptors" path="../res/images/TorontoRaptors.png" />
            <Tile imgKey="DenverNuggets" path="../res/images/DenverNuggets.png" />
          </tr>
          <tr>
            <Tile imgKey="76ers" path="../res/images/76ers.png" />
            <Tile imgKey="TorontoRaptors" path="../res/images/TorontoRaptors.png" />
            <Tile imgKey="DenverNuggets" path="../res/images/DenverNuggets.png" />
          </tr>
        </tbody>
      </table>
    </div>  
  )
}