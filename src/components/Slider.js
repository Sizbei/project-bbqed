import React, {useEffect, useContext, useState} from 'react';
import axios from 'axios';
import InGameTrivia from './InGameTrivia';
import {AuthContext} from '../Context/AuthContext';
import AuthService from '../Services/AuthService';
import '../styling/Slider.css';

export default function Slider(props) {
  const scale = "scale" in props? props.scale : 1.0;
  const [lock, setLock] = useState(false);
  const [done, setDone] = useState(false);
  const [angle, setAngle] = useState(180);
  const [prevAngle, setPrevAngle] = useState(null);
  const sliderContainerSize = 9;
  const minDeg = 25.15;
  const maxDeg = 335.8;
  const tickSize = 1;
  const tickAngle = (maxDeg - minDeg) / (100 / tickSize);
  const colors = [
    [87.7, "#61B305"],
    [134.7, "#C8D64E"],
    [182.4, "#F8DB6B"],
    [229.2, "#FAAD54"],
    [285.8, "#FF0905"],
  ]
  const interpolate = require('color-interpolate');

  const mod = (n, m) => {
    return ((n % m) + m) % m;
  }
  // get a radian measure
  // output in [0, 2pi)
  const getAngle = (x, y) => {
    return mod(2 * Math.atan(y / (x + Math.sqrt(x * x + y * y))), 2 * Math.PI);
  }

  // Transform a radian measure r in [0, 2pi) to a degree d in [0, 360)
  const radToDegree = r => {
    return 180 * r / Math.PI;
  }

  // transform a degree measure into a tick from 0 to 100
  const getTick = deg => {
    return tickSize * Math.round((deg - minDeg) / tickAngle);
  }
  
  const invert = tick => {
    return 100 - tick;
  }

  const updatePosition = e => {
    e.stopPropagation();
    if (lock || done) {
      return;
    }

    const target = e.currentTarget.getBoundingClientRect();
    const x = 2 * ((e.clientX - target.left) / target.width - 0.5);
    const y = -2 * ((e.clientY - target.top) / target.height - 0.5);
    const theta = getAngle(x, y);

    console.log(x, y, "radian:", theta, "deg:", radToDegree(theta))
    let deg = radToDegree(theta);
    deg = Math.max(deg, minDeg);
    deg = Math.min(deg, maxDeg);

    // round degree to the nearest tick
    const tick = getTick(deg);
    deg = minDeg + tickAngle * tick / tickSize;
    setAngle(deg);
  }

  const submit = e => {
    e.stopPropagation();
    console.log("Clicked!");
    setPrevAngle(angle);
    setDone(true);
  }

  const handleMouseEnter = e => {
    e.stopPropagation();
    if (lock) {
      return;
    }

    setDone(false);
  }

  const handleMouseOut = e => {
    e.stopPropagation();
    console.log("Mouse out!");
    setAngle(prevAngle);
  }

  // Map a set of degree measures to a color
  // Then search for closest color
  // TODO interpolate?
  const getColor = angle => {
    let best;
    let bestDist = 1 << 16;

    colors.forEach((v) => {
      const d = Math.abs(v[0] - angle);
      if (d < bestDist) {
        bestDist = d;
        best = v;
      }
    })

    let secondBest;
    let secondBestDist = 1 << 16;
    colors.forEach((v) => {
      if (v == best) return;

      const d = Math.abs(v[0] - angle);
      if (d < secondBestDist) {
        secondBestDist = d;
        secondBest = v;
      }
    })

    // do interpolation...
    const lower = (function() {
      if (best[0] <= secondBest[0]) {
        return best;
      } else {
        return secondBest;
      }
    }());
    const upper = lower[0] == best[0] ? secondBest : best;

    if (lower[0] <= angle && angle <= upper[0]) {
      const colormap = interpolate([lower[1], upper[1]]);
      const point = (angle - lower[0]) / (upper[0] - lower[0]);
      // console.log("interpolate", colormap(point), point, lower, upper, angle);
      return colormap(point);
    }
    return best[1];
  }

  const color = getColor(angle);
  const prevColor = getColor(prevAngle);

  const sliderContainerStyle = {

  }
  
  const sliderArrowStyle = {
    borderLeft: 0.4 * scale + "vw solid transparent",
    borderRight: 0.4 * scale + "vw solid transparent",
    borderBottom: 0.8 * scale + "vw solid " + color,
  }

  const sliderArrowContainerStyle = {
    width: sliderContainerSize * scale + "vw",
    height: sliderContainerSize * scale + "vw",
    transform: "rotate(" + -angle + "deg)",
  }

  const sliderArrowGhostStyle = {
    borderLeft: 0.4 * scale + "vw solid transparent",
    borderRight: 0.4 * scale + "vw solid transparent",
    borderBottom: 0.8 * scale + "vw solid " + prevColor,
  }

  const sliderArrowGhostContainerStyle = {
    width: sliderContainerSize * scale + "vw",
    height: sliderContainerSize * scale + "vw",
    transform: "rotate(" + -prevAngle + "deg)",
    visibility: prevAngle == null ? "hidden" : "visible",
  }

  const sliderMouseContainerStyle = {
    width: sliderContainerSize * scale + "vw",
    height: sliderContainerSize * scale + "vw"
  }

  const sliderStyle = {
    width: 4 * scale + "vw",
    height: 4 * scale + "vw",
    marginLeft: 0.3 * scale + "vw",
  }

  const percentStyle = {
    color: color,
    fontSize: 0.9 * scale + "vw",
  }

  return (
    <div className="slider-container" style={sliderContainerStyle}>
      <div className="slider-arrow-container" style={sliderArrowContainerStyle}>
        <div className="slider-arrow" style={sliderArrowStyle}>
        </div>
      </div>
      <div className="slider-arrow-ghost-container" style={sliderArrowGhostContainerStyle}>
        <div className="slider-arrow-ghost" style={sliderArrowGhostStyle}>
        </div>
      </div>
      <div className="slider-mouse-container" onMouseMove={updatePosition} onMouseDown={submit} 
        onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} style={sliderMouseContainerStyle}>
        <div className="slider" style={sliderStyle}>
          <label className="slider-percent" style={percentStyle}>
            {invert(getTick(angle))}%
          </label>
        </div>
      </div>
    </div>
  )
}