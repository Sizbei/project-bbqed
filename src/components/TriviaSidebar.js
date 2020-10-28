import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Header from './Header';
import '../styling/TriviaSidebar.css';
import icon from '../res/images/puzzle-piece.png'

function QuestionPreviewText(props) {
  const max = 40;
  const ellipses = props.text.length > max;
  let text = props.text.substring(0, max);
  while (text.length > 0 && text[text.length - 1] === ' ') {
    console.log(text);
    text = text.substring(0, text.length -  1);
  }

  return (
    <span className="TSBG-list-item-text"> {text + (ellipses ? "..." : "")}</span>
  )
}

function QuestionListItem(props) {
  const number = props.number;
  const text = props.text;
  const userCorrect = props.userCorrect;
  const enemyCorrect = props.enemyCorrect;
  
  const checkmark = (
    <div className="TSBG-list-item-mark-div">
      <div className="TSBG-list-item-checkmark-div">
        <div className="TSBG-list-item-checkmark"></div>
      </div>
    </div>
  )

  const crossmark = (
    <div className="TSBG-list-item-crossmark">&times;</div>
  )

  const divClassName = "TSBG-list-item TSBG-list-item-" + (number % 2 == 0 ? "e" : "o");
  console.log(divClassName);

  return (
    <div className={divClassName}>
      <span className="TSBG-list-item-baseline">
        <span className="TSBG-list-item-number"> {number > 9 ? '' : '\u00A0'} {number}. {'\u00A0'} </span>
        <QuestionPreviewText text={text} />
      </span>
      <div className="TSBG-list-item-checks">
        {userCorrect ? checkmark : crossmark}
        {enemyCorrect ? checkmark : crossmark}
      </div>
  </div>
  )
}

export default function TriviaSidebar(props) {
  const [nav, setNav] = useState(false);  

  const handleClickOnline = e => {
    // axios.
    e.stopPropagation();
  }

  const handleClickSingle = e => {
    e.stopPropagation();  
  }

  const handleClickSend = e => {
    e.stopPropagation();
  }

  const handleClickSolo = e => {
    e.stopPropagation();
  }

  const checkmark = (
    <div className="TSBG-list-item-mark-div">
      <div className="TSBG-list-item-checkmark-div">
        <div className="TSBG-list-item-checkmark"></div>
      </div>
    </div>
  )

  const crossmark = (
    <div className="TSBG-list-item-crossmark">&times;</div>
  )

  if (nav) {
    return (
      <div className="TSB-div">
        <div className="TSB-header">
          <span className="TSB-header-text">Trivia!</span>
          <div className="TSB-header-icon"></div>
        </div>
        <div className="TSB-direct-div">
          <div className="TSB-direct-item" onClick={handleClickOnline}>
            <div className="TSB-direct-icon TSB-direct-icon-online"></div>
            <span className="TSB-direct-text">Play Online</span>
          </div>
          <div className="TSB-direct-item" onClick={handleClickSingle}>
            <div className="TSB-direct-icon TSB-direct-icon-single"></div>
            <span className="TSB-direct-text">Single Player</span>
          </div>
          <div className="TSB-direct-item" onClick={handleClickSend}>
            <div className="TSB-direct-icon TSB-direct-icon-send"></div>
            <span className="TSB-direct-text">Send a Challenge</span>
          </div>
          <div className="TSB-direct-item" onClick={handleClickSolo}>
            <div className="TSB-direct-icon TSB-direct-icon-solo"></div>
            <span className="TSB-direct-text">Practice</span>
          </div>
        </div>
      </div>  
    )
  } else {
    return (
      <div className="TSB-div">
        <div className="TSB-header">
          <span className="TSB-header-text">Trivia!</span>
          <div className="TSB-header-icon"></div>
        </div>

        {/* <div className="TSBG-header">
        </div> */}
        
        <div className="TSBG-list">
          <div className="TSBG-list-icons-div">
            <div className="TSBG-list-icons">
              <div className="TSBG-list-icon-div">
                <img className="TSBG-list-icon" src="https://www.citypng.com/public/uploads/preview/-41601313914ox6c3d6e4n.png"></img>
              </div>
              <div className="TSBG-list-icon-div TSBG-list-icon-div-2">
                <img className="TSBG-list-icon" src="https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2017/11/17140825/Swedish-Vallhund-head-portrait-outdoors.jpg"></img>
              </div>
            </div>
          </div>
          
          <QuestionListItem number={1} text="Question 1 goes here" userCorrect={true} enemyCorrect={false} />
          <QuestionListItem number={2} text="Question 2 goes here" userCorrect={true} enemyCorrect={true} />
          <QuestionListItem number={3} text="Question 3 goes here" userCorrect={true} enemyCorrect={false} />
          <QuestionListItem number={4} text="Question 4 goes here" userCorrect={true} enemyCorrect={true} />
          <QuestionListItem number={5} text="Question 5 goes here" userCorrect={true} enemyCorrect={false} />
          <QuestionListItem number={6} text="Question 6 goes here" userCorrect={false} enemyCorrect={true} />
          <QuestionListItem number={7} text="Question 7 goes here" userCorrect={false} enemyCorrect={false} />
          <QuestionListItem number={8} text="Question 8 goes here" userCorrect={true} enemyCorrect={true} />
          <QuestionListItem number={9} text="Question 9 goes here" userCorrect={true} enemyCorrect={false} />
          <QuestionListItem number={10} text="Question 10 goes here" userCorrect={true} enemyCorrect={true} />
          <QuestionListItem number={11} text="TIEBREAKER QUESTION" userCorrect={true} enemyCorrect={true} />
        </div>
      </div>
    )
  }
}
