import React, {useEffect, useContext, useState} from 'react';
import axios from 'axios';
import InGameTrivia from './InGameTrivia';
import {AuthContext} from '../Context/AuthContext';
import AuthService from '../Services/AuthService';
import '../styling/Slider.css';

export default function Slider(props) {
  const scale = "scale" in props? props.scale : 1.0;
  const [lock, setLock] = useState(false);
  const [angle, setAngle] = useState(180);
  const sliderContainerSize = 9;
  const minDeg = 24;
  const maxDeg = 334.5;
  const tickSize = 1;
  const tickAngle = (maxDeg - minDeg) / (100 / tickSize);
  const colors = [
    [72.8, "#FE140B"],
    [89.2, "#FE2210"],
    [104.7, "#FB7D3D"],
    [126.3, "#FA994A"],
    [138.27, "#FAAA53"],
    [163.7, "#F9CD63"],
    [179, "#F8DD6B"],
    [217.2, "#D9DC59"],
    [270.3, "#61B305"],
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

  const updatePosition = e => {
    e.stopPropagation();
    if (lock) {
      return;
    }

    const target = e.currentTarget.getBoundingClientRect();
    const x = 2 * ((e.clientX - target.left) / target.width - 0.5);
    const y = -2 * ((e.clientY - target.top) / target.height - 0.5);
    const theta = getAngle(x, y);

    // console.log(x, y, "radian:", theta, "deg:", radToDegree(theta))
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
    setLock(true);
  }

  // Map a set of degree measures to a color
  // Then search for closest color
  // TODO interpolate?
  const color = (function() {
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
  }())

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
      <div className="slider-mouse-container" onMouseMove={updatePosition} onMouseDown={submit} style={sliderMouseContainerStyle}>
        <div className="slider" style={sliderStyle}>
          <label className="slider-percent" style={percentStyle}>
            {getTick(angle)}%
          </label>
        </div>
      </div>
    </div>
  )
}