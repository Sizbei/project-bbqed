import React, { useState } from 'react';
import axios from 'axios';
import  '../styling/PostTrivia.css';
import ProfilePicture from './ProfilePicture'

export default function InGameTrivia(props) {
  const handleModeSelect = props.handleModeSelect;
  const score = "score" in props ? props.score : {user:0, enemy:0};
  const list = props.list;
  const mode = props.mode;
  const username = props.username;
  const acs = props.gameOver ? props.finalACS : 
    ("initialACS" in props ? props.initialACS : {user:"", enemy:""});
  const acsChange = "acsChange" in props ? props.acsChange : {user:"none", enemy:"none"};
  const ppurl = "ppurl" in props ? props.ppurl : {user: "", enemy: ""};
  const nav = mode === "nav";
  const [visible, setVisible] = useState('visible');

  var visibleJSON = {
      visibility: visible
  }

  const userHeaderSection = (
    <div className="post-header-block post-header-us">
      <span className="post-header-username">
        {username.user} &nbsp;
        <span className="post-header-acs">({acs != null ? acs.user : "-"})</span>
        &nbsp;
        <ACSChange change={acsChange.user} />
      </span>
      <ProfilePicture scale={1.5} url={ppurl.user} />
      <label className="post-header-score">{score.user}</label>
    </div>
  );

  const enemyHeaderSection = mode === "online" ? (
    <div className="post-header-block post-header-them">
      <span className="post-header-username">
        {username.enemy} &nbsp;
        <span className="post-header-acs">({acs != null ? acs.enemy : "-"})</span>
        &nbsp;
        <ACSChange change={acsChange.enemy} />
      </span>
      <ProfilePicture scale={1.5} url={ppurl.enemy} />
      <label className="post-header-score">{score.enemy}</label>
    </div>
  ) : null;

  const Hide = () => {
      setVisible('hidden');
      console.log("yay");
  }

  return (
      <div>
          <div className='post-popup' onClick={() => Hide()} style={visibleJSON}/>
          <div className='post-popup_inner' style={visibleJSON}>
            <div className="post-header">
              {userHeaderSection}
              {enemyHeaderSection}
            </div>
            <div className="post-nav">
              <button className="post-nav-button" onClick={() => handleModeSelect("playAgain")}>
                <label className="post-nav-button-label">Play Again</label>
              </button>
              {mode !== "singlePlayer" ? (
                <button className="post-nav-button" onClick={() => handleModeSelect("rematch")}>
                  <label className="post-nav-button-label">Rematch</label>
                </button>
              ) : null}
              <button className="post-nav-button" onClick={() => handleModeSelect("nav")}>
                <label className="post-nav-button-label">Select Mode</label>
              </button>
            </div>
          </div>
      </div> 
  );
}

function ACSChange(props) {
  const change = "change" in props ? props.change : "none";

  if (change === "none") {
    return <span className={"post-header-acschange-zero"}>&nbsp;&nbsp;</span>
  }

  if (change > 0) {
    return (
      <span className={"post-header-acschange-positive"}>+{change}</span>
    )
  } else if (change == 0) {
    return (
      <span className={"post-header-acschange-zero"}>+-0</span>
    )
  } else {
    return (
      <span className={"post-header-acschange-negative"}>{change}</span>
    )
  }
}