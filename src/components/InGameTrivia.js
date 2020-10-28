import React, {Component} from 'react';
import axios from 'axios';
import Header from './Header';
import  '../styling/InGameTrivia.css';
import TriviaSidebar from './TriviaSidebar';

export default function InGameTrivia() {

    return(
        <div className='trivia-background'>
          <div className='left-segment'>
            <div className='clock'></div>
            <div className='questionBox'>
              <label id='question'>Example Question</label>
              {/* Dynamic relabelling: document.getElementById('question').label.value = 'newQuestion' */}
            </div>
            <div className='answers'>
              <div className='leftAnswers'>
                <div className='answer1Box'>
                  <label className='answer1'>Answer One</label>
                </div>
                <div className='answer2Box'>
                  <label className='answer2'>Answer Two</label>
                </div>
              </div>
              <div className='rightAnswers'>
                <div className='answer3Box'>
                  <label className='answer3'>Answer Three</label>
                </div>
                <div className='answer4Box'>
                  <label className='answer4'>Answer Four</label>
                </div>
              </div>
            </div>
            <div className='profile'>
              <div className='user-border'>
                <div className="profilePic"/>  
 
              </div>
              <label className='points'>9</label>
            </div>
          </div>
 
          <div className='right-segment'>
            <TriviaSidebar/>
          </div>
        </div>
    );
}