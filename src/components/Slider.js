import React, {useEffect, useContext, useState} from 'react';
import axios from 'axios';
import InGameTrivia from './InGameTrivia';
import {AuthContext} from '../Context/AuthContext';
import AuthService from '../Services/AuthService';
import '../styling/Slider.css';

export default function Slider(props) {
  const scale = "scale" in props? props.scale : 1.0;
  const [angle, setAngle] = useState(180);
  const sliderContainerSize = 9;

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

  const updatePosition = e => {
    e.stopPropagation();
    const target = e.currentTarget.getBoundingClientRect();
    const x = 2 * ((e.clientX - target.left) / target.width - 0.5);
    const y = -2 * ((e.clientY - target.top) / target.height - 0.5);
    const theta = getAngle(x, y);

    console.log(x, y, "radian:", theta, "deg:", radToDegree(theta))
    setAngle(radToDegree(theta));
  }

  const submit = e => {
    e.stopPropagation();
    console.log("Clicked!");
  }

  const sliderContainerStyle = {
    
    // width: 5 * scale + "vw",
    // height: 5 * scale + "vw"
  }
  
  const sliderArrowStyle = {
    borderLeft: 0.4 * scale + "vw solid transparent",
    borderRight: 0.4 * scale + "vw solid transparent",
    borderBottom: 0.8 * scale + "vw solid red",
    // marginRight: 0.9 * scale + "vw",
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

  return (
    <div className="slider-container" style={sliderContainerStyle}>
      <div className="slider-arrow-container" style={sliderArrowContainerStyle}>
        <div className="slider-arrow" style={sliderArrowStyle}>
        </div>
      </div>
      <div className="slider-mouse-container" onMouseMove={updatePosition} onMouseDown={submit} style={sliderMouseContainerStyle}>
        <div className="slider" style={sliderStyle}>

        </div>
      </div>
    </div>
  )
}