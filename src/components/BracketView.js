import React, {useEffect, useRef, useState} from 'react';
import '../styling/BracketView.css';

export default function BracketView(props) {
  const { height, width } = useWindowDimensions();

  return (
    <div>
      <Bracket {...props} width={width * 0.85} height={(height - 117.3) * 0.9} />
    </div>
  );
}

// Get window dimensions. Source:
// https://stackoverflow.com/a/36862446
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

function Bracket(props) {
  const canvasRef = useRef(null);
  const onClick = props.onClick;
  const slots = props.slots;
  
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
      moveTo(round(srcx), round(srcy + lineWidth));
      drawLineTo(round(desx - lineWidth / 2), round(desy + lineWidth)); // a bandaid fix...
    } else { // vertical
      moveTo(round(srcx), round(srcy + lineWidth));
      drawLineTo(round(desx), round(desy + lineWidth));
    }
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

  const drawPair = (i, marginLeft, marginTop) => {
    const newObjects = []
    newObjects.push(<Rect key={"rect" + i} index={i} slot={slots[i]} {...boxDim} marginLeft={round(marginLeft)} marginTop={round(marginTop)} onClick={onClick} />)
    newObjects.push(<Rect key={"rect" + (i+1)} index={i+1} slot={slots[i+1]} {...boxDim} marginLeft={round(marginLeft)} marginTop={round(marginTop + boxDim.height + lineWidth)} onClick={onClick} />)
    return newObjects;
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

    let index = 0;

    // Western Conference Round 1
    Array(4).fill(0).forEach((el, i) => {
      newObjects.push(drawPair(index, 0, i * heightBlock))
      index += 2;
    })

    // Western Conference Semi Finals
    let sfHeights = [];
    Array(2).fill(0).forEach((el, i) => {
      const sfHeight = 2 * i * heightBlock + (heightBlock + pairHeight) / 2;
      sfHeights.push(sfHeight);
      newObjects.push(drawPair(index, widthBlock, sfHeight - boxDim.height));
      drawT({x: boxDim.width + minLineGap, y: 2 * i * heightBlock + boxDim.height}, {x: boxDim.width + minLineGap, y: (2 * i + 1) * heightBlock +  + boxDim.height}, {x: widthBlock - minLineGap, y: sfHeight})
      index += 2;
    })
    
    // Western Conference Finals
    const fHeight = (3 * heightBlock + pairHeight) / 2;
    newObjects.push(drawPair(index, 2 * widthBlock, fHeight - boxDim.height));
    drawT({x: widthBlock + boxDim.width + minLineGap, y: sfHeights[0]}, {x: widthBlock + boxDim.width + minLineGap, y: sfHeights[1]}, {x: 2 * widthBlock - minLineGap, y: fHeight})
    index += 2;

    // Finals
    newObjects.push(drawPair(index, 3 * widthBlock, fHeight - boxDim.height));
    drawLine(2 * widthBlock + boxDim.width + minLineGap, 3 * widthBlock - minLineGap, fHeight, fHeight);
    drawLine(3 * widthBlock + boxDim.width + minLineGap, 4 * widthBlock - minLineGap, fHeight, fHeight);
    index += 2;

    // Eastern Conference Finals
    newObjects.push(drawPair(index, 4 * widthBlock, fHeight - boxDim.height));
    drawT({x: 5 * widthBlock - minLineGap, y: sfHeights[0]}, {x: 5 * widthBlock - minLineGap, y: sfHeights[1]}, {x: 4 * widthBlock + boxDim.width + minLineGap, y: fHeight})
    index += 2;

    // Eastern Conference Semi Finals
    Array(2).fill(0).forEach((el, i) => {
      const sfHeight = sfHeights[i];
      newObjects.push(drawPair(index, 5 * widthBlock, sfHeight - boxDim.height));
      drawT({x: 6 * widthBlock - minLineGap, y: 2 * i * heightBlock + boxDim.height}, {x: 6 * widthBlock - minLineGap, y: (2 * i + 1) * heightBlock +  + boxDim.height}, {x: 5 * widthBlock + boxDim.width + minLineGap, y: sfHeight})
      index += 2;
    })

    // Eastern Conference Round 1
    Array(4).fill(0).forEach((el, i) => {
      newObjects.push(drawPair(index, width - boxDim.width, i * heightBlock));
      index += 2;
    })

    setObjects(newObjects);
  }    

  useEffect(() => {
    draw();
  }, [JSON.stringify(props)])

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
  const index = props.index;
  const slot = props.slot;
  const width = props.width;
  const height = props.height;
  const marginLeft = props.marginLeft;
  const marginTop = props.marginTop;
  const onClick = props.onClick;

  const style = {
    backgroundColor: "grey",
    width: width + "px",
    height: height + "px",
    marginLeft: marginLeft + "px",
    marginTop: marginTop + "px"
  }

  return (
    <div className="rect" style={style} onClick={() => onClick(index)}>
      <span className="rect-content"> {slot} </span>
    </div>
  )
}