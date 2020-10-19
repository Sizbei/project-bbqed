import React, { useEffect, useState } from 'react';
import axios from 'axios';

import "../styling/ImageSelect.css"

function Tile(props) {
  const name = props.name;
  const image = props.image;
  const notifyTable = props.notifyTable

  const [selected, setSelected] = useState(props.initial);
  
  const handleClick = () => {
    let newSelected = !selected;
    setSelected(newSelected);
    notifyTable(name, newSelected);
  }

  return (
  <td className="imageselect-tile">
    <div className={selected ? "image-tile-selected" : "image-tile-unselected"} onClick={handleClick}>
      <img className="imageselect-image" src={process.env.PUBLIC_URL + image} alt={name} ></img>
    </div>
  </td> 
  )
}

export default function ImageSelect(props) {
  const btntext = props.btntext;
  const selected = ("selected" in props) ? props.selected : [];
  const width = props.width;
  const data = props.data;
  const onSubmitHandler = props.onSubmit;
  const updateOnClick = props.updateOnClick;
  const onBlurHandler = ("onBlurHandler" in props) ? props.onBlurHandler : () => {};
  const noButton = props.noButton;
  const [tableContents, setTableContents] = useState(null);
  const [changed, setChanged] = useState(false);

  const pairs = data.map((t) => {
    const obj = {
      pair_name: t["name"],
      pair_bool: selected.some(v => {return v === t["name"]})
    }

    return obj;
  })

  const [tileState, setTileState] = useState(pairs);

  const handleToggle = (name, selected) => {
    let newTileState = tileState.map( o => {
      if (o["pair_name"] !== name) {
        return o;
      } else {
        const obj = {
          pair_name: o["pair_name"],
          pair_bool: selected
        }

        return obj;
      }
    })
    setTileState(newTileState);
    setChanged(true);
  }

  const tiles = data.map((e) => <Tile name={e["name"]} image={e["image"]} key={e["name"]} 
  initial={selected.some(v => {return v === e["name"]})} notifyTable={handleToggle} />)

  const getData = () => {
    let buffer = []
    tileState.forEach(element => {
      if (element["pair_bool"]) {
        buffer.push(element["pair_name"]);
      }
    });

    onSubmitHandler(buffer);
  }

  const handleMouseLeave = () => {
    console.log("changed", changed);
    if (changed) {
      setChanged(false);
      onBlurHandler();
    }
  }
  
  useEffect(() => {
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

    setTableContents(buffer);

    if (updateOnClick) {
      getData();
    }
  }, [tileState]) // aka refresh on tileState change, otherwise setTileState() does nothing

  let btn;
  if (noButton) {
    btn = null;
  } else {
    btn = (<div className="imageselect-btn-container">
      <button className="imageselect-btn" onClick={getData}>{btntext}</button>
    </div>)
  }

  return (
    <div className="imageselect-container">
      <table className="imageselect-table">
        <tbody onMouseLeave={handleMouseLeave}>
          {tableContents}
        </tbody>
      </table>

      {btn}
    </div>  
  )
}

// A minimal example for ImageSelect
function ImageTest(props) {

  const [imageSelect, setImageSelect] = useState(null);

  const handleImageSelectData = (result) => {
    console.log(result);
  }

  useEffect(() => {
    axios.get('http://localhost:5000/teams/', "").then(
      (e) => {
        setImageSelect(<ImageSelect btntext="Submit!" data={e.data} width={6} onSubmit={handleImageSelectData} />)
      }
    ); 
  }, [])

  return (
    <div className="div-test">
      {imageSelect}
    </div>
  )
}