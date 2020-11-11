
import React, {useContext, useEffect, setState} from 'react';
import {AuthContext} from '../Context/AuthContext';
import { HashLink as Link } from 'react-router-hash-link';

function Reports(props){ 
  const reports = props.reports;

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
          <div>
            <h1> This {data.type} has been reported </h1> 
            <label>id: <Link to={data.type === "post" ? "/theZone/display/" + "5f9ef5615edae35730410775#5fa0723232c66f2fbc57227e" : null}>{data.id}</Link> </label>
            <label> {data.count} </label>
            <button onClick={()=> deleteReport(data.reportId)}> Close Report </button>
            <button onClick={()=> {data.type === "post" ? deletePost(data.id) : deleteComment(data.id)}}> Delete {data.type} </button>
          </div>
        )
      })
    }
    </div>
    
  )
}
export default function Report() { 
  //const [reports, setReports] = setState([]); 
  const dummyData = [
    {reportId: 1, type: "post" , id: "5f9ef5615edae35730410775", count: 20}, 
    {reportId: 2, type: "post" , id: "5fa616657602a8956000bb75", count: 10}, 
    {reportId: 3, type: "post" , id: "5fa4bf66333241970c61e7e9", count: 1}
  ];
  useEffect(() =>  {
    
  }, [])
  return (
    <div>
      <h1> Reports </h1>
      <div>

        <Reports reports={dummyData}/>
      </div>
    </div>
  )
}