import { HashLink as Link } from 'react-router-hash-link';
import React , {useContext} from 'react';
import "../styling/Reports.css";
import {AuthContext} from '../Context/AuthContext';

export default function Reports(props){ 
  const reports = props.reports;
  const type = props.type; 
  const authContext = useContext(AuthContext);
  const deleteReportPost = (postId) => { 
    const body = {
      _id: postId, 
    }
    fetch('/display/clearPost', {
      method :  "post",
      body : JSON.stringify(body),
      headers: {
          'Content-Type' : 'application/json'
      }
    }).then(res => res.json())
    .then(data => {
      window.location.reload(); 
    }) 
    .catch((error) => {
      console.log(error);
    })
  }
  const deleteReportComment = (commentId) => {
    const body = {
      _id: commentId, 
    }
    fetch('/display/clearComment', {
      method :  "post",
      body : JSON.stringify(body),
      headers: {
          'Content-Type' : 'application/json'
      }
    }).then(res => res.json())
    .then(data => {
      window.location.reload(); 
    }) 
    .catch((error) => {
      console.log(error);
    })
  }
  const deletePost = (postId) => {
    const body = {
      _id: postId, 
    }
    fetch('/display/' + authContext.user.username +'/deletePost', {
      method :  "delete",
      body : JSON.stringify(body),
      headers: {
          'Content-Type' : 'application/json'
      }
    }).then(res => res.json())
    .then(data => {
      deleteReportPost(postId);
    }) 
    .catch((error) => {
      console.log(error);
    })
  }
  const deleteComment = (commentId) => {
    const body = {
      _id: commentId, 
    }
    fetch('/display/' + authContext.user.username +'/deleteComment', {
      method :  "delete",
      body : JSON.stringify(body),
      headers: {
          'Content-Type' : 'application/json'
      }
    }).then(res => res.json())
    .then(data => {
      deleteReportComment(commentId);
    }) 
    .catch((error) => {
      console.log(error);
    })
  }
  return (
    <div>
    {
      reports.map((data) => {
        return (
          <div className="reports-body-container">
            <div className="reports-body-header-container"> 
              <h3> This {type} has been reported </h3> 
              <h5> Reported {data.totalReports} time(s) </h5>
            </div>
            <label>id: <Link to={type === "post" ? "/theZone/display/" + data._id : "/theZone/display/" + data.post + "#" + data._id}>{data._id}</Link> </label>
            <div className="reports-buttons">
              <button onClick={()=> {type === "post" ? deleteReportPost(data._id): deleteReportComment(data._id)}}> Close Report </button>
              <button onClick={()=> {type === "post" ? deletePost(data._id) : deleteComment(data._id)}}> Delete {type} </button>
            </div> 
          </div>
        )
      })
    }
    </div>
    
  )
}