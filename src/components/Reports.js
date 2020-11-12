import { HashLink as Link } from 'react-router-hash-link';
import React from 'react';
import "../styling/Reports.css";

export default function Reports(props){ 
  const reports = props.reports;
  const type = props.type; 

  const deleteReport = (reportId) => { 

  }
  const deletePost = (postId) => {

  }
  const deleteComment = (commentId) => {

  }
  return (
    <div>
    {
      reports.map((data) => {
        return (
          <div className="reports-post-background">
            <h3> This {type} has been reported </h3> 
            <label> {data.totalReports} </label>
            <label>id: <Link to={type === "post" ? "/theZone/display/" + data._id : "/theZone/display/" + data.post + "#" + data._id}>{data._id}</Link> </label>
            <button onClick={()=> {type === "post" ? deleteReport(data._id): deleteReport(data.post)}}> Close Report </button>
            <button onClick={()=> {type === "post" ? deletePost(data._id) : deleteComment(data._id)}}> Delete {type} </button>
          </div>
        )
      })
    }
    </div>
    
  )
}