import React, {useState} from 'react';
import axios from 'axios';
import Header from './Header';
import '../styling/TriviaSidebar.css';
import icon from '../res/images/puzzle-piece.png'

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
    <div className="TSBG-list-item-checkmark-div">
      <div className="TSBG-list-item-checkmark"></div>
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
          <div className="TSBG-list-item TSBG-list-item-e">
            <span className="TSBG-list-item-baseline">
              <span className="TSBG-list-item-number"> &nbsp; 1. &nbsp; </span>
              <span className="TSBG-list-item-text"> Here lies the first few words of the question...</span>
            </span>
            <div className="TSBG-list-item-checks">
              {checkmark}
              {crossmark}
            </div>
          </div>
          <div className="TSBG-list-item TSBG-list-item-o">
            <span className="TSBG-list-item-number"> &nbsp; 2. &nbsp;</span>
            <div className="TSBG-list-item-checks">
              {crossmark}
              {checkmark}
            </div>
          </div>
          <div className="TSBG-list-item TSBG-list-item-e">
            <span className="TSBG-list-item-number"> &nbsp; 3. &nbsp;</span>
            <div className="TSBG-list-item-checks">
              {checkmark}
              {checkmark}
            </div>
          </div>
          <div className="TSBG-list-item TSBG-list-item-o">
            <span className="TSBG-list-item-number"> 10. &nbsp; </span>
            <span className="TSBG-list-item-text"> Here lies the few words of the question...</span>
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
