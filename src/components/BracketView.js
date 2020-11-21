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
  const minTurn = 10;
  const minLineGap = 5;

  // canvas width/height
  const minWidth = 7 * boxDim.width + 6 * (2 * (minTurn + minLineGap) + lineWidth);
  const minHeight = 4 * minHeightDiff + 4 * pairHeight;
  const canvasWidth = Math.max(minWidth, props.width);
  const canvasHeight = Math.max(minHeight, props.height);
  
  const [objects, setObjects] = useState([]);

  const round = (n) => {
    const m = Math.floor(n);
    return m + 0.5;
  }

  // ctx.lineTo and ctx.stroke() will draw a line where the current point is right on the center of the line. 
  // It's easier when we work with the corners of lines, so these functions will be an adapter
  const moveTo = (desx, desy) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.moveTo(round(desx), round(desy));
  }

  const drawLineTo = (desx, desy) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(round(desx), round(desy));
    ctx.stroke();
  }

  const drawLine = (srcx, desx, srcy, desy) => {
    if (srcy == desy) { // horizontal
      moveTo(round(srcx), round(srcy));
      drawLineTo(round(desx - lineWidth / 2), round(desy)); // a bandaid fix...
    } else { // vertical
      moveTo(round(srcx), round(srcy));
      drawLineTo(round(desx), round(desy));
    }
  }

  const drawPair = (marginLeft, marginTop) => {
    const newObjects = []
    newObjects.push(<Rect {...boxDim} marginLeft={round(marginLeft)} marginTop={round(marginTop)} />)
    newObjects.push(<Rect {...boxDim} marginLeft={round(marginLeft)} marginTop={round(marginTop + boxDim.height + lineWidth)} />)
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
      drawLine(a.x + minTurn, c.x, c.y, c.y);
    } else {
      drawLine(a.x - minTurn, a.x, a.y, a.y);
      drawLine(b.x - minTurn, b.x, b.y, b.y);
      drawLine(a.x - minTurn - lineWidth / 2, a.x - minTurn - lineWidth / 2, a.y, b.y);
      drawLine(a.x - minTurn - lineWidth / 2, a.x - minTurn - lineWidth / 2, a.y, c.y);
      drawLine(c.x, a.x - minTurn, c.y, c.y);
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

    const widthGap = (width - 7 * boxDim.width) / 6;
    const widthBlock = boxDim.width + widthGap;

    // Western Conference Round 1
    Array(4).fill(0).forEach((el, i) => newObjects.push(drawPair(0, i * heightBlock)))

    // Western Conference Semi Finals
    let sfHeights = [];
    Array(2).fill(0).forEach((el, i) => {
      const sfHeight = 2 * i * heightBlock + (heightBlock + pairHeight) / 2;
      sfHeights.push(sfHeight);
      newObjects.push(drawPair(widthBlock, sfHeight - boxDim.height));
      drawT({x: boxDim.width + minLineGap, y: 2 * i * heightBlock + boxDim.height}, {x: boxDim.width + minLineGap, y: (2 * i + 1) * heightBlock +  + boxDim.height}, {x: widthBlock - minLineGap, y: sfHeight})
    })
    
    // Western Conference Finals
    const fHeight = (3 * heightBlock + pairHeight) / 2;
    console.log(fHeight, (sfHeights[0] + sfHeights[1]) / 2);
    newObjects.push(drawPair(2 * widthBlock, fHeight - boxDim.height));
    drawT({x: widthBlock + boxDim.width + minLineGap, y: sfHeights[0]}, {x: widthBlock + boxDim.width + minLineGap, y: sfHeights[1]}, {x: 2 * widthBlock - minLineGap, y: fHeight})

    // Eastern Conference Finals
    newObjects.push(drawPair(3 * widthBlock, fHeight - boxDim.height));
    drawT({x: 4 * widthBlock - minLineGap, y: sfHeights[0]}, {x: 4 * widthBlock - minLineGap, y: sfHeights[1]}, {x: 3 * widthBlock + boxDim.width + minLineGap, y: fHeight})

    // Eastern Conference Semi Finals
    Array(2).fill(0).forEach((el, i) => {
      const sfHeight = sfHeights[i];
      newObjects.push(drawPair(4 * widthBlock, sfHeight - boxDim.height));
      drawT({x: 5 * widthBlock - minLineGap, y: 2 * i * heightBlock + boxDim.height}, {x: 5 * widthBlock - minLineGap, y: (2 * i + 1) * heightBlock +  + boxDim.height}, {x: 4 * widthBlock + boxDim.width + minLineGap, y: sfHeight})
    })

    // Eastern Conference Round 1
    Array(4).fill(0).forEach((el, i) => newObjects.push(drawPair(width - boxDim.width, i * heightBlock)))

    setObjects(newObjects);
    
    // Draw connecting lines
    // drawT({x: boxDim.width + minLineGap, y: boxDim.height}, {x: boxDim.width + minLineGap, y: 2 * heightBlock + boxDim.height}, {x: width - boxDim.width - minLineGap, y: heightBlock + boxDim.height})
    // drawT({x: width - boxDim.width - minLineGap, y: boxDim.height}, {x: width - boxDim.width - minLineGap, y: 3 * heightBlock + boxDim.height}, {x: boxDim.width + minLineGap, y: height * 3 / 4})
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