import React, {useEffect, useContext, useState} from 'react';
import axios from 'axios';
import Header from './Header';
import {AuthContext} from '../Context/AuthContext';
import '../styling/AnalysisPostView.css'
import Slider from './Slider';
import Histogram from './Histogram';

export default function AnalysisPostView(props) {
  const _id = window.location.pathname.split("/").pop();

  const authContext = useContext(AuthContext);
  const [formState, setFormState] = useState("discussion");
  const [tier, setTier] = useState("Analyst");
  const [response, setResponse] = useState("");
  const [question, setQuestion] = useState("Sample Question to be Answered");
  const [ourPosts, setOurPosts] = useState([]);
  const [otherPosts, setOtherPosts] = useState([]);
  const [averageScore, setAverageScore] = useState("0");

  useEffect(() => {
    //Find out if the user had already answered the question and set new form state
    setFormState("discussion");

    fetch('/analysis/post/' + _id).then(res => res.json())
    .then((initData) => {
      console.log("got init", initData);

      setOurPosts(initData.userPosts)
      setOtherPosts(initData.otherPosts)
    })
  }, [_id])



  const sampleHistogramData = Array(101).fill(0).map((el, i) => i*i + (100-i)*(100-i) - 2 * 50 * 50);
  sampleHistogramData[55] = 50*50*30;

  const sampleHistogramData2 = Array(101).fill(0).map((el, i) => (i-60) * (i-60) + Math.pow(1.1, i));

  const sampleHistogramData3 = Array(101).fill(0).map((el, i) => 10);

  if (formState === "discussion") {
    return(
    <div className='analysis-background'>
      <div className="analysis-header">
        <span>
          <label className="analysis-question-header">Daily Question </label>
          <label className="analysis-question-difficulty">{tier}</label>
        </span>
        <label className="analysis-question-text">Sample question to be answered</label>
        </div>
        <div className="analysis-question-image">
          {/* Insert image here; div used as a placeholder  */}
          <div className="sample-div"/>
        </div>
        <div className="analysis-comments"> 

        <div className="analysis-posts">
          {ourPosts.map((data, index) => {
            console.log(data);
            return (
              <VotePost user={data.user} us={authContext.user.username === data.user} acs={0} 
              timeAgo={data.createdAt} scoreData={sampleHistogramData3} content={data.content} averageScore={data.averageScore} />
            )
          })}

          {otherPosts.map((data, index) => {
            console.log(data);
            return (
              <VotePost user={data.user} us={authContext.user.username === data.user} acs={0} 
              timeAgo={data.createdAt} scoreData={sampleHistogramData3} content={data.content} averageScore={data.averageScore} />
            )
          })}
        </div>
      </div>
  </div>
    );
  } 
  else if (formState === "dailyQuestion") {
    return(
      <div className='analysis-background'>
        <div className="analysis-header">
        <span>
          <label className="analysis-question-header">Daily Question </label>
          <label className="analysis-question-difficulty">{tier}</label>
        </span>
        <label className="analysis-question-text">{question}</label>
        </div>
        <div className="analysis-question-image">
          {/* Insert image here; div used as a placeholder  */}
          <div className="sample-div"/>
        </div>
        <div className='analysis-response'>
          <label className='analysis-response-header'>Your Response</label>
          <textarea type="text" className="analysis-response-input" maxLength="1000"></textarea>
          <button className='analysis-response-submit'>Submit</button>
        </div>
      </div>
      );
  }
} 

function VotePost(props) {
  const username = props.user;
  const us = "us" in props ? props.us : false;
  const acs = props.acs;
  var timeAgo = Date.parse(props.timeAgo);
  var timeNow = new Date(Date.now());
  var timeBefore = new Date(timeAgo);
  const [scoreData, setScoreData] = useState(props.scoreData);
  const averageScore = props.averageScore;
  const content = props.content;
  var updatedTime = "";

//   console.log("timeNow: " + timeNow + "\n" + timeNow.getMonth() + "\n" + timeNow.getDate() + "\n" + timeNow.getHours() + "\n" + timeNow.getMinutes() + "\n");
//   console.log("timeBefore: " + timeBefore + "\n" + timeBefore.getMonth() + "\n" + timeBefore.getDate() + "\n" +  + timeBefore.getHours() + "\n" + timeBefore.getMinutes() + "\n");
  if(timeNow.getMonth() > timeBefore.getMonth()) {
    updatedTime = timeNow.getMonth() - timeBefore.getMonth() + " months ago";
  } else if (timeNow.getDate() > timeBefore.getDate()) {
    updatedTime = timeNow.getDate() - timeBefore.getDate() + " days ago";
  } else if (timeNow.getHours > timeBefore.getHours()) {
    updatedTime = timeNow.getHours() - timeBefore.getHours() + " hours ago";
  } else if (timeNow.getMinutes() > timeBefore.getMinutes()) {
    updatedTime = timeNow.getMinutes() - timeBefore.getMinutes() + " minutes ago";
  } else {
    updatedTime = " 1 minute ago";
  }

  const handleVote = (score) => {
    console.log("GOT", score);
    console.log(scoreData[score]);
    const newScoreData = Array(101).fill(0).map((el, i) => scoreData[i]);
    newScoreData[score] += 1;
    console.log("NEW SCORE DATA", newScoreData);
    setScoreData(newScoreData);
  }

  return (
    <div>
      {!us ? (
        <div className="analysis-slider">
          <Slider scale={0.7} onSubmit={handleVote}/>
        </div>
      ) : (
        <div className="analysis-slider" style={{visibility: "hidden"}}>
        </div>
      )}
      
      <div className="analysis-user">
        <div className="left-user-info">
          <label className="analysis-username">{username}</label>
          <label className="analysis-ACS">({acs})</label>
          {/* <div className="analysis-ACS-div">
          </div> */}
          <div className="analysis-histogram">
            <Histogram data={scoreData} xScale={0.4} yScale={0.2}/>
          </div>
          <label className="analysis-average-Score">Average Score: {averageScore}</label>
          <label className="analysis-time-ago">{updatedTime}</label>
        </div>
        <label className="analysis-additional-comment">{content}</label>
      </div>
    </div>
  )
}
