import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Route, useHistory} from "react-router-dom";
import logo from "../res/images/76ers.png"

import "../styling/ImageSelect.css"

function Tile(props) {
  console.log(props.path === "../res/images/76ers.png");
  const key = props.key;
  const path = props.path;
  
  const [selected, setSelected] = useState(false);

  const name = "76ers.png";

  return (
  <td className="imageselect-tile" onClick={() => console.log("clicked") }>
    <img className="imageselect-image" src={process.env.PUBLIC_URL + path} ></img>
  </td> 
  )
}

export default function ImageSelect(props) {
  return (
    <div className="imageselect-container">
      <table className="imageselect-table">
        <tbody>
          <tr>
            {/* <td className="imageselect-tile" onClick={() => console.log("clicked") }>
              <img className="imageselect-image" src={logo}></img>
            </td> */}
            <Tile key="" path="../res/images/76ers.png" />

            <td className="imageselect-tile">
              <img className="imageselect-image" src={logo}></img>
            </td>
            <td className="imageselect-tile">Jill</td>
          </tr>
          <tr>
            <td className="imageselect-tile">Jill</td>
            <td className="imageselect-tile">Jill</td>
            <td className="imageselect-tile">Jill</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}