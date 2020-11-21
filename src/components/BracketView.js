import React, {useEffect, useRef, useState} from 'react';
import {AuthContext} from '../Context/AuthContext';
import AuthService from '../Services/AuthService';
import '../styling/BracketView.css';

export default function BracketView(props) {
  const canvasRef = useRef(null);
  const color = '#FFFFFF';
  const boxDim = {
    width: 200,
    height: 60,
  }
  const minHeightDiff = 15;
  const lineWidth = 1;
  const pairHeight = 2 * boxDim.height + lineWidth;
  const minHeight = 4 * minHeightDiff + 4 * pairHeight;
  const canvasWidth = props.width;
  const canvasHeight = Math.max(minHeight, props.height);
  
  
  const [objects, setObjects] = useState([]);

  const drawPair = (marginLeft, marginTop) => {
    const newObjects = []
    newObjects.push(<Rect {...boxDim} marginLeft={marginLeft} marginTop={marginTop} />)
    newObjects.push(<Rect {...boxDim} marginLeft={marginLeft} marginTop={marginTop + boxDim.height + lineWidth} />)
    return newObjects;
  }

  const draw = () => {
    const canvas = canvasRef.current;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');

    const newObjects = [];
    const heightDiff = Math.max((height - 4 * pairHeight) / 3, minHeightDiff);

    // Western Conference Round 1
    Array(4).fill(0).forEach((el, i) => newObjects.push(drawPair(0, i * (pairHeight + heightDiff))))

    // Eastern Conference Round 1
    Array(4).fill(0).forEach((el, i) => newObjects.push(drawPair(width - boxDim.width, i * (pairHeight + heightDiff))))

    setObjects(newObjects);

    console.log(width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.moveTo(0, boxDim.height + lineWidth / 2)
    ctx.lineTo(boxDim.width, boxDim.height + lineWidth / 2);
    ctx.stroke();
    ctx.lineTo(width - boxDim.width, height - boxDim.height);
    ctx.stroke();
    ctx.lineTo(width, height - boxDim.height);
    ctx.stroke();
  }

  useEffect(() => {
    draw();
  }, [JSON.stringify(props)])

  console.log(objects);

  console.log("final", canvasWidth, canvasHeight);
  return (
    <div className="bracketview-center">
      <div className="bracketview-div">  
        <canvas id="bracket" ref={canvasRef} width={canvasWidth} height={canvasHeight}></canvas>
        {/* <SampleRect width={200} height={100} marginLeft={400} marginTop={300} /> */}
        {objects}
      </div> 
    </div>
  )
}

function Rect(props) {
  const width = props.width;
  const height = props.height;
  const marginLeft = props.marginLeft;
  const marginTop = props.marginTop;

  console.log(width, height);
  const style = {
    backgroundColor: "green",
    width: width + "px",
    height: height + "px",
    marginLeft: marginLeft + "px",
    marginTop: marginTop + "px"
  }
  return (
    <div className="rect" style={style}>
      
    </div>
  )
}