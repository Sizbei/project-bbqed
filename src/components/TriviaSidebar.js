import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Header from './Header';
import '../styling/TriviaSidebar.css';
import icon from '../res/images/puzzle-piece.png'

function QuestionPreview(props) {
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

export default function TriviaSidebar(props) {
  const [nav, setNav] = useState(false);  

  const handleClickOnline = e => {
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
          <div className="TSBG-list-item TSBG-list-item-e">
            <span className="TSBG-list-item-baseline">
              <span className="TSBG-list-item-number"> &nbsp; 1. &nbsp; </span>
              <QuestionPreview text="blah blah blahblah blah blahblah blah blahblah blah blahblah blah blah" />
            </span>
            <div className="TSBG-list-item-checks">
              {checkmark}
              {crossmark}
            </div>
          </div>
          <div className="TSBG-list-item TSBG-list-item-o">
            <span className="TSBG-list-item-baseline">
              <span className="TSBG-list-item-number"> &nbsp; 2. &nbsp; </span>
              <QuestionPreview text="If a question is very long, what happens? Needs to be dynamic." />
            </span>            
            <div className="TSBG-list-item-checks">
              {checkmark}
              {crossmark}
            </div>
          </div>
          <div className="TSBG-list-item TSBG-list-item-e">
            <span className="TSBG-list-item-baseline">
              <span className="TSBG-list-item-number"> &nbsp; 3. &nbsp; </span>
              <QuestionPreview text="Short question." />
            </span>
            <div className="TSBG-list-item-checks">
              {checkmark}
              {checkmark}
            </div>
          </div>
          <div className="TSBG-list-item TSBG-list-item-o">
            <span className="TSBG-list-item-baseline">
              <span className="TSBG-list-item-number"> 10. &nbsp; </span>
              <QuestionPreview text="lopis dopis lopis dopis lopis dopis lopis dopis lopis dopis " />
            </span>
            <div className="TSBG-list-item-checks">
              {crossmark} 
              {crossmark}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
