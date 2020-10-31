import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import  '../styling/InGameTrivia.css';
import TriviaSidebar from './TriviaSidebar';
import ProfilePicture from './ProfilePicture';
import { convertCompilerOptionsFromJson } from 'typescript';
import PostTrivia from './PostTrivia'

export default function InGameTrivia(props) {
  const mode = props.mode;
  const list = props.list;
  const score = props.score;
  const handleOptionSelect = props.handleOptionSelect;
  const handleModeSelect = props.handleModeSelect;
  let currentQuestion = '\u00A0'; // initialize with space to preserve spacing
  let options = ['\u00A0', '\u00A0', '\u00A0', '\u00A0'];
  if (mode == "singlePlayer") {
    currentQuestion = props.currentQuestion;
    options = props.options;
  }

  const [tickValue, NewTickValue] = useState(0);
  const [opacityValue, NewOpacityValue] = useState(100);
  const [timeValue, NewTimeValue] = useState(10);
  
  var timerOn = false;
  var tickJSON = { 
    width: tickValue + "%"
  }
  var opacityJSON = {
    opacity: opacityValue + "%"
  }

  //example for 10 second: 
  //onClick={() => triviaClockTick(10, 0.04, 100, 0)}
  //example for 14 second:
  //onClick={() => triviaClockTick(14, 0.03, 100, 0)}
  const triviaClockTick = (timeAllotted, tickSpeed, setOpacity, setTick) => {
    var divTimeLeft = document.getElementsByClassName('clockTick');
    var divClock = document.getElementsByClassName('clock');
        timerOn = true;
    var flashOn = true;
    var tick = setTick;
    var opacity = setOpacity;
    var counter = timeAllotted;
    NewTimeValue(counter);
    var Timer = setInterval(() => triggerTicker(), 1);
    setInterval(() => triggerCountDown(), 1000);
    function triggerTicker() {
        if (divTimeLeft[0].clientWidth < divClock[0].clientWidth && timerOn) {
            tick += tickSpeed;
            // This is 10 seconds, 14 seconds has a tickRate of 0.03 (Make this a variable)
            NewTickValue(tick);
            if (opacity > 100) 
                opacity = 100;
            if (opacity < 0)
                opacity = 0;
            NewOpacityValue(opacity);
            if (Math.trunc(tick) % 4 == 0)
                flashOn = true;
            else
                flashOn = false;
            if (tick >= 60 && !flashOn)
                opacity -= 0.6;
            else if (tick >= 60 && flashOn)
                opacity += 1.5;
        }
        else {
            NewTickValue(100);
            timerOn = false;
            clearInterval(Timer);
        }
    }
    function triggerCountDown() {
        counter -= 1;
        if (counter >= 0) {
            NewTimeValue(counter);
        }
    }
  }

  const reset = () => {
    timerOn = false;
    NewOpacityValue(100);
    NewTickValue(0);
    NewTimeValue(10);
  }
      
  return(
      <div className='trivia-background'>
        {/* <PostTrivia {...props}/> */}
        <div className='left-segment'>
        <div className='timeBox'>
            <label className='time'>{timeValue}</label>
        </div>
        <div className='clockRed'>
            <div className='clockTick' style={tickJSON}></div>
            <div className='clock' style={opacityJSON}>
            </div>
        </div>
        <div className='questionBox' onClick={() => triviaClockTick(10, 0.04, 100, 0)}>
          <label id='question'>{currentQuestion}</label>
        </div>
        <div className='answers'>
          <div className='leftAnswers'>
              <div className='answer1Box'>
                  <button className='answer1Btn' onClick={() => handleOptionSelect(0)}> 
                    <label className='answer1'>{options[0]}</label>
                  </button>
              </div>
              <div className='answer2Box'>
                  <button className='answer2Btn' onClick={() => handleOptionSelect(1)}>
                    <label className='answer2'>{options[1]}</label>
                  </button> 
              </div>
          </div>
          <div className='rightAnswers'>
              <div className='answer3Box'>
                  <button className='answer3Btn' onClick={() => handleOptionSelect(2)}>
                    <label className='answer3'>{options[2]}</label>
                  </button>
              </div>
              <div className='answer4Box'>
                  <button className='answer4Btn'  onClick={() => handleOptionSelect(3)}>
                    <label className='answer4'>{options[3]}</label>
                  </button>
              </div>
          </div>
        </div>
      </div>

    <div className='right-segment'>
      <TriviaSidebar {...props} handleModeSelect={handleModeSelect}/>
    </div>
    
    </div>
  );
}