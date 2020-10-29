import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Header from './Header';
import '../styling/TriviaSidebar.css';
import icon from '../res/images/puzzle-piece.png'
import ProfilePicture from './ProfilePicture';

function QuestionPreviewText(props) {
  const max = 60;
  const ellipses = props.text.length > max;
  let text = props.text.substring(0, max);
  while (text.length > 0 && text[text.length - 1] === ' ') {
    text = text.substring(0, text.length -  1);
  }

  return (
    <span className="TSBG-list-item-text"> {text + (ellipses ? "..." : "")}</span>
  )
}

function QuestionListItem(props) {
  const mode = props.mode;
  const number = props.number;
  const text = props.text;  
  const userCorrect = props.userCorrect;
  const enemyCorrect = "enemyCorrect" in props ? props.enemyCorrect : false;
  const multiplayer = mode === "online";

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

  return (
    <div className={divClassName}>
      <span className="TSBG-list-item-baseline">
        <span className="TSBG-list-item-number"> {number > 9 ? '' : '\u00A0'} {number}. {'\u00A0'} </span>
        <QuestionPreviewText text={text} />
      </span>
      <div className="TSBG-list-item-checks">
        {userCorrect ? checkmark : crossmark}
        {multiplayer ? (enemyCorrect ? checkmark : crossmark) : null}
      </div>
  </div>
  )
}

function EmptyQuestionListItem(props) {
  const mode = props.mode;
  const number = props.number;
  const divClassName = "TSBG-list-item TSBG-list-item-" + (number % 2 == 0 ? "e" : "o");
  const multiplayer = mode === "online";

  return (
    <div className={divClassName}>
      <span className="TSBG-list-item-baseline">
        <span className="TSBG-list-item-number"> {number > 9 ? '' : '\u00A0'} {number}. {'\u00A0'} </span>
      </span>
      <div className="TSBG-list-item-checks">
        <div className="TSBG-list-item-empty"></div>
        {multiplayer ? <div className="TSBG-list-item-empty"></div> : null } 
      </div>
  </div>
  )
}

function QuestionList(props) {
  const mode = props.mode;
  const list = props.list;

  let accum = [];
  list.forEach(e => {
    const props = {
      mode: mode,
      key: e["questionNumber"],
      number: e["questionNumber"],
      text: e["question"],
      userCorrect: e["userCorrect"],
      enemyCorrect: e["enemyCorrect"]
    }
    const item = <QuestionListItem {...props} /> 
    accum.push(item);
  })

  for (let i = list.length + 1; i <= 11; i++) {
    const props = {
      mode: mode,
      key: i,
      number: i
    }
    const item = <EmptyQuestionListItem {...props} /> 
    accum.push(item);
  }

  return (
    <div >
      {accum}
    </div>
  )
}

export default function TriviaSidebar(props) {
  const handleModeSelect = props.handleModeSelect;
  const mode = props.mode;
  const nav = mode === "nav";

  const handleClickOnline = e => {
    e.stopPropagation();
    handleModeSelect("online");
  }

  const handleClickSingle = e => {
    e.stopPropagation();  
    handleModeSelect("singlePlayer");
  }

  const handleClickSend = e => {
    e.stopPropagation();
    handleModeSelect("send");
  }

  const handleClickSolo = e => {
    e.stopPropagation();
    handleModeSelect("solo");
  }

  const qprops = [  // Some hardcoded data here.
    {
      questionNumber: 1,
      question: "Question 1 goes here.",
      userCorrect: true,
      enemyCorrect: true 
    },
    {
      questionNumber: 2,
      question: "Question 2 goes here. Question 2 goes here. Question 2 goes here. ",
      userCorrect: false,
      enemyCorrect: true 
    },
    {
      questionNumber: 3,
      question: "Question 3 goes here.",
      userCorrect: true,
      enemyCorrect: false 
    },
    {
      questionNumber: 4,
      question: "Question 4 goes here.",
      userCorrect: false,
      enemyCorrect: false 
    },
  ]

  const QList = <QuestionList list={qprops} />
  const enemyHeaderSection = mode === "online" ? (
    <div className="TSBG-header-block TSBG-header-them">
      <div className="TSBG-header-block TSBG-header-us">
        <span className="TSBG-header-username">
          User3 &nbsp;
          <span className="TSBG-header-acs">(600)</span>
        </span>
        <ProfilePicture scale={1.5} username="user3" />
        <label className="TSBG-header-score">2</label>
      </div>
    </div>
  ) : null;

  const enemyListIcon = mode === "online" ? (
    <div className="TSBG-list-icon-div TSBG-list-icon-div-2">
      <img className="TSBG-list-icon" src="https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2017/11/17140825/Swedish-Vallhund-head-portrait-outdoors.jpg"></img>
    </div>
  ) : null;

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
        <div className="TSBG-header">
          <div className="TSBG-header-block TSBG-header-us">
            <span className="TSBG-header-username">
              User1 &nbsp;
              <span className="TSBG-header-acs">(1234)</span>
            </span>
            <ProfilePicture scale={1.5} username="user1" />
            <label className="TSBG-header-score">2</label>
          </div>
          {enemyHeaderSection}
        </div>
        
        <div className="TSBG-list">
          <div className="TSBG-list-icons-div">
            <div className="TSBG-list-icons">
              <div className="TSBG-list-icon-div">
                <img className="TSBG-list-icon" src="https://www.citypng.com/public/uploads/preview/-41601313914ox6c3d6e4n.png"></img>
              </div>
              {enemyListIcon}
            </div>
          </div>
          
          {QList}
        </div>
      </div>
    )
  }
}
