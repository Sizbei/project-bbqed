import React, {useEffect, useRef, useState} from 'react';
import {AuthContext} from '../Context/AuthContext';
import AuthService from '../Services/AuthService';
import BracketView from './BracketView.js';

export default function Bracket(props) {
  const { height, width } = useWindowDimensions();

  console.log(height, width);
  return (
    <div>
      <BracketView width={width * 0.85} height={(height - 117.3) * 0.9} />
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

