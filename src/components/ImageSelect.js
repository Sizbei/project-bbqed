import Axios from 'axios';
import React, { Component, useState } from 'react';
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

  return (
    <div className="imageselect-container">
      <table className="imageselect-table">
        <tbody>
          {buffer}
        </tbody>
      </table>
    </div>  
  )
}

export default function ImageTest(props) {

  // const [data, setData] = new useState([]);

  const [imageSelect, setImageSelect] = useState(null);

  const getData = () => {
    axios.get('http://localhost:5000/teams/', "").then(
      (e) => {
        // console.log(e.data);
        setImageSelect(<ImageSelect data={e.data} width={6} />)
      }
    );
  }

  return (
    // <ImageSelect data={getData()} width={6} height={3} />
    <div>
      <button onClick={getData}>click!</button>
      {imageSelect}
    </div>

    // axios.get('http://localhost:5000/teams/', "").then(
    //   (e) => {
    //     console.log(e.data);
    //     <ImageSelect />
    //   }
    // );
  )
}

// function ImageSelect(props) {
//   // const width = props.width;
//   // const height = props.height;

//   const [data, setData] = new useState([]);

//   return (
//     <div className="imageselect-container">
//       <table className="imageselect-table">
//         <tbody>
//           <tr>
//             <Tile name="76ers" image="../res/images/76ers.png" />
//             <Tile name="TorontoRaptors" image="../res/images/TorontoRaptors.png" />
//             <Tile name="DenverNuggets" image="../res/images/DenverNuggets.png" />
//           </tr>
//           <tr>
//             <Tile name="76ers" image="../res/images/76ers.png" />
//             <Tile name="TorontoRaptors" image="../res/images/TorontoRaptors.png" />
//             <Tile name="DenverNuggets" image="../res/images/DenverNuggets.png" />
//           </tr>
//           <tr>
//             <Tile name="76ers" image="../res/images/76ers.png" />
//             <Tile name="TorontoRaptors" image="../res/images/TorontoRaptors.png" />
//             <Tile name="DenverNuggets" image="../res/images/DenverNuggets.png" />
//           </tr>
//         </tbody>
//       </table>
//     </div>  
//   )
// }