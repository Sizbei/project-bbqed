import React, {useEffect, useRef, useState} from 'react';
import {AuthContext} from '../Context/AuthContext';
import AuthService from '../Services/AuthService';
import '../styling/BracketView.css';

export default function BracketView(props) {
  const canvasRef = useRef(null);

  // constants
  const color = '#FFFFFF';
  const boxDim = {
    width: 200,
    height: 60,
  }
  const minHeightDiff = 10;
  const lineWidth = 1;
  const pairHeight = 2 * boxDim.height + lineWidth;

  // constants regarding connecting lines
  const minTurn = 20;
  const minLineGap = 10;

  // canvas width/height
  const minWidth = 6 * boxDim.width;
  const minHeight = 4 * minHeightDiff + 4 * pairHeight;
  const canvasWidth = Math.max(minWidth, props.width);
  const canvasHeight = Math.max(minHeight, props.height);
  
  

  const [objects, setObjects] = useState([]);

  const round = (n) => {
    const m = Math.round(n);
    // if (m % 1 === 0) {
    //   return m + 0.5;
    // } else {
    //   return m;
    // }
    if (m < n) {
      return m + 0.5;
    } else {
      return m - 0.5;
    }
  }

  // ctx.lineTo and ctx.stroke() will draw a line where the current point is right on the center of the line. 
  // It's easier when we work with the corners of lines, so these functions will be an adapter
  const moveTo = (desx, desy) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.moveTo(round(desx), round(desy + lineWidth / 2));
  }

  const drawLineTo = (desx, desy) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(round(desx), round(desy + lineWidth / 2));
    ctx.stroke();
  }

  const drawLine = (srcx, desx, srcy, desy) => {
    moveTo(round(srcx), round(srcy));
    drawLineTo(round(desx), round(desy));
  }

  const drawPair = (marginLeft, marginTop) => {
    const newObjects = []
    newObjects.push(<Rect {...boxDim} marginLeft={marginLeft} marginTop={marginTop} />)
    newObjects.push(<Rect {...boxDim} marginLeft={marginLeft} marginTop={marginTop + boxDim.height + lineWidth} />)
    return newObjects;
  }

  /* Draw the connecting lines for this:
        a--
          |
          -----c
          |
        b--

        minimum distance before the line turns is defined by the variable minTurn
    */
  const drawT = (a, b, c) => {
    // Determine the direction
    if (a.x < c.x) {
      drawLine(a.x, a.x + minTurn, a.y, a.y);
      drawLine(b.x, b.x + minTurn, b.y, b.y);
      drawLine(a.x + minTurn - lineWidth / 2, a.x + minTurn - lineWidth / 2, a.y, b.y);
      drawLine(a.x + minTurn - lineWidth / 2, a.x + minTurn - lineWidth / 2, a.y, c.y);
      drawLine(a.x + minTurn - lineWidth, c.x, Math.round(c.y), Math.round(c.y));
    } else {
      drawLine(a.x, a.x - minTurn, a.y, a.y);
      drawLine(b.x, b.x - minTurn, b.y, b.y);
      drawLine(a.x - minTurn + lineWidth / 2, a.x - minTurn + lineWidth / 2, a.y, b.y);
      drawLine(a.x - minTurn + lineWidth / 2, a.x - minTurn + lineWidth / 2, a.y, c.y);
      drawLine(a.x - minTurn + lineWidth, c.x, c.y, c.y);
    }
  }

  const draw = () => {
    const canvas = canvasRef.current;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    const newObjects = [];
    const heightGap = Math.max((height - 4 * pairHeight) / 3, minHeightDiff);
    const heightBlock = pairHeight + heightGap;

    const widthGap = (width - 6 * boxDim.width) / 5;
    const widthBlock = boxDim.width + widthGap;

    // Western Conference Round 1
    Array(4).fill(0).forEach((el, i) => newObjects.push(drawPair(0, i * heightBlock)))

    // Western Conference Semi Finals
    const sf1Height = (0 + heightBlock + pairHeight) / 2;
    newObjects.push(drawPair(widthBlock, sf1Height - boxDim.height));
    drawT({x: boxDim.width + minLineGap, y: boxDim.height}, {x: boxDim.width + minLineGap, y: heightBlock + boxDim.height}, {x: 2 * widthBlock - minLineGap, y: sf1Height})


    // Eastern Conference Round 1
    Array(4).fill(0).forEach((el, i) => newObjects.push(drawPair(width - boxDim.width, i * heightBlock)))

    setObjects(newObjects);
    
    // Draw connecting lines
    drawT({x: boxDim.width + minLineGap, y: boxDim.height}, {x: boxDim.width + minLineGap, y: 2 * heightBlock + boxDim.height}, {x: width - boxDim.width - minLineGap, y: heightBlock + boxDim.height})
    drawT({x: width - boxDim.width - minLineGap, y: boxDim.height}, {x: width - boxDim.width - minLineGap, y: 3 * heightBlock + boxDim.height}, {x: boxDim.width + minLineGap, y: height * 3 / 4})
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
    backgroundColor: "grey",
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