import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import  '../styling/InGameTrivia.css';
import TriviaSidebar from './TriviaSidebar';
import ProfilePicture from './ProfilePicture';
import { convertCompilerOptionsFromJson } from 'typescript';
import crown from '../res/images/crowns.png'

export default function InGameTrivia(props) {
  const mode = props.mode;
  const previousAnswer = props.previousAnswer;
  const handleOptionSelect = props.handleOptionSelect;
  const handleModeSelect = props.handleModeSelect;
  const chosenOptions = "chosenOptions" in props ? props.chosenOptions : {user: 1, enemy: 2};
  let currentQuestion = '\u00A0'; // initialize with space to preserve spacing
  let options = ['\u00A0', '\u00A0', '\u00A0', '\u00A0'];
  if (mode == "singlePlayer") {
    currentQuestion = props.currentQuestion;
    options = props.options;
  }

  const [tickValue, NewTickValue] = useState(0);
  const [opacityValue, NewOpacityValue] = useState(100);
  const [timeValue, NewTimeValue] = useState(10);
  const [activeTimers, setActiveTimers] = useState({});
  
  var timerOn = false;
  var tickJSON = { 
    width: tickValue + "%"
  }
  var opacityJSON = {
    opacity: opacityValue + "%"
  }

  const triviaClockTick = () => {
    var divTimeLeft = document.getElementsByClassName('clockTick')[0];
    var divClock = document.getElementsByClassName('clock')[0];
    var divCountDown = document.getElementsByClassName('time');
    timerOn = true;
    var flashOn = true;
    var fps = 40;
    var percentPerFrame = 10 / fps;
    var triggerCount = 0;
    var tick = 0;
    var opacity = 100;
    var counter = 10;
    NewTimeValue(counter);
    var Timer = setInterval(() => triggerTicker(), 1000 / fps);
    const clockInterval = setInterval(() => triggerCountDown(), 1000);
    function triggerTicker() {
        if (timerOn) {
            triggerCount += 1;
            tick = triggerCount * percentPerFrame;

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
                opacity -= 3;
            else if (tick >= 60 && flashOn)
                opacity += 7.5;
        }
        else {
            timerOn = false;
            clearInterval(Timer);
        }
    }
    function triggerCountDown() {
      if (counter == 0) {
        stopTimers();
        handleOptionSelect(null); 
      } else if (counter > 0) {
        counter -= 1;
        NewTimeValue(counter);
      } else {
        clearInterval(clockInterval);
      }
    }

    return {clockInterval: clockInterval, Timer: Timer};
  }

  const stopTimers = () => {
    // Clear previous intervals
    clearInterval(activeTimers.Timer);
    clearInterval(activeTimers.clockInterval);
  }

  // stopTimers() should be called before this function is called
  // otherwise it is a seizure simulation
  const reset = () => { 
    timerOn = false;
    NewOpacityValue(100);
    NewTickValue(0);
  }

  // Stop timers when props.stopTimers === "stop"
  useEffect(() => {
    if (!("stop" in props) || props.stop === "nostop") {
      return;
    }

    stopTimers();
  }, [props.stop])

  // Reset timers on each new question
  useEffect(() => {
    if (!("questionCount" in props)) {
      return;
    }

    stopTimers();
    reset();
    const newActiveTimers = triviaClockTick();
    setActiveTimers(newActiveTimers);
  }, [props.questionCount])
      
  return(
    <div className='trivia-background'>
      <div className='left-segment'>
        <div className='timeBox'>
            <label className='time'>{timeValue}</label>
        </div>
        <div className='clockRed'>
            <div className='clockTick' style={tickJSON}></div>
            <div className='clock' style={opacityJSON}>
            </div>
        </div>
        <div className='questionBox'>
          <label id='question'>{currentQuestion}</label>
        </div>
        <div className='answers'>
          <div className='leftAnswers'>
              <div className='answer1Box' onClick={() => handleOptionSelect(0)}>
                <div className='answer-div'>
                  <label className='answer1'>{options[0]}</label>
                </div>
                <div className="answer-icons-div">
                  <div className="answer-icons">
                    {previousAnswer === options[0] ? <img className="answer-icon" src={crown}></img> : null}
                    {chosenOptions.user === options[0] ? <img className="answer-icon" src={props.ppurl.user}></img> : null}
                    {chosenOptions.enemy === options[0] ? <img className="answer-icon" src={props.ppurl.user}></img> : null}
                  </div>
                </div>
              </div>
              <div className='answer2Box' onClick={() => handleOptionSelect(1)}>
                <div className='answer-div'>
                  <label className='answer2'>{options[1]}</label>
                </div>
                <div className="answer-icons-div">
                  <div className="answer-icons">
                    {previousAnswer === options[1] ? <img className="answer-icon" src={crown}></img> : null}
                    {chosenOptions.user === options[1] ? <img className="answer-icon" src={props.ppurl.user}></img> : null}
                    {chosenOptions.enemy === options[1] ? <img className="answer-icon" src={props.ppurl.user}></img> : null}
                  </div>
                </div>
              </div>
          </div>
          <div className='rightAnswers'>
              <div className='answer3Box' onClick={() => handleOptionSelect(2)}>
                <div className='answer-div'>
                  <label className='answer3'>{options[2]}</label>
                </div>
                <div className="answer-icons-div">
                  <div className="answer-icons">
                    {previousAnswer === options[2] ? <img className="answer-icon" src={crown}></img> : null}
                    {chosenOptions.user === options[2] ? <img className="answer-icon" src={props.ppurl.user}></img> : null}
                    {chosenOptions.enemy === options[2] ? <img className="answer-icon" src={props.ppurl.user}></img> : null}
                  </div>
                </div>
              </div>
              <div className='answer4Box' onClick={() => handleOptionSelect(3)}>
                <div className='answer-div'>
                  <label className='answer3'>{options[3]}</label>
                </div>
                <div className="answer-icons-div">
                  <div className="answer-icons">
                    {previousAnswer === options[3] ? <img className="answer-icon" src={crown}></img> : null}
                    {chosenOptions.user === options[3] ? <img className="answer-icon" src={props.ppurl.user}></img> : null}
                    {chosenOptions.enemy === options[3] ? <img className="answer-icon" src={props.ppurl.user}></img> : null}
                  </div>
                </div>
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