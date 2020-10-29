import React, {Component} from 'react';
import axios from 'axios';
import Header from './Header';
import  '../styling/InGameTrivia.css';
import TriviaSidebar from './TriviaSidebar';
import ProfilePicture from './ProfilePicture';

export default function InGameTrivia(props) {
  const mode = props.mode;
  const handleOptionSelect = props.handleOptionSelect;
  const handleModeSelect = props.handleModeSelect;
  let currentQuestion = '\u00A0'; // initialize with space to preserve spacing
  let options = ['\u00A0', '\u00A0', '\u00A0', '\u00A0'];
  if (mode == "singlePlayer") {
    currentQuestion = props.currentQuestion;
    options = props.options;
  }
      
  return(
      <div className='trivia-background'>
        <div className='left-segment'>
          <div className='clock'></div>
          <div className='questionBox'>
            <label id='question'>{currentQuestion}</label>
            {/* Dynamic relabelling: document.getElementById('question').label.value = 'newQuestion' */}
          </div>
          <div className='answers'>
            <div className='leftAnswers'>
              <div className='answer1Box' onClick={() => handleOptionSelect(0)}>
                <label className='answer1'>{options[0]}</label>
              </div>
              <div className='answer2Box' onClick={() => handleOptionSelect(1)}>
                <label className='answer2'>{options[1]}</label>
              </div>
            </div>
            <div className='rightAnswers'>
              <div className='answer3Box' onClick={() => handleOptionSelect(2)}>
                <label className='answer3'>{options[2]}</label>
              </div>
              <div className='answer4Box' onClick={() => handleOptionSelect(3)}>
                <label className='answer4'>{options[3]}</label>
              </div>
            </div>
          </div>
          <div className='profile'>
            <div className='user-border'> 
              <ProfilePicture scale={2.0} username="user1" />
            </div>
            <label className='points'>9</label>
          </div>
        </div>

        <div className='right-segment'>
          <TriviaSidebar mode={mode} handleModeSelect={handleModeSelect}/>
        </div>
      </div>
  );
}