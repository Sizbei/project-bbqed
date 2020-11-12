
import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../Context/AuthContext';
import { HashLink as Link } from 'react-router-hash-link';
import "../styling/Reports.css"

function Pagination(props) {
  const pageNumbers = []; 
  for(let i = 1; i <= Math.ceil(props.totalPosts/props.postsPerPage); i++) {
      pageNumbers.push(i); 
  }
  
  return (
      <nav> 
          <ul className="reports-pagination"> 
              {pageNumbers.map(number => ( 
                <div className='reports-page-box'>
                    <button key={number} onClick={()=>props.paginate(number)} > 
                    {number}
                    </button>
                </div>
                

              ))}
          </ul>
      </nav>
  )
}

function Reports(props){ 
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
export default function Report() { 
  const [reportList, setReportList] = useState([]); 
  const [currentPage, setCurrentPage] = useState(0);
  const authContext = useContext(AuthContext); 
  const [type, setType] = useState("post"); 
  /*
  const dummyData = [
    {reportId: 1, type: "post" , _id: "5f9ef5615edae35730410775", reports: 20}, 
    {reportId: 2, type: "post" , _id: "5fa616657602a8956000bb75", reports: 10}, 
    {reportId: 3, type: "post" , _id: "5fa4bf66333241970c61e7e9", reports: 1}
  ];
  */
 
  const onChangeSelect = (e) => {
    console.log(e.target.value);
    if (e.target.value === "Posts") { 
      setType("post"); 
      window.location.reload(); 
    }
    
    else if (e.target.value === "Comments") {
      setType("comment"); 
      window.location.reload(); 
    }
    
  }
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (type === "post") {
      handlePosts(); 
    }
    else if (type === "comment") {
      handleComment(); 
    }
  } 
  const handlePosts=  () => {
    fetch("/zone/display/" + authContext.user.username + "/reportedPosts/" + currentPage).then(response => response.json()) 
    .then( data => {
      setReportList(data.posts); 
      
    })
  }

  const handleComment = () => { 
    fetch("/zone/display/" + authContext.user.username + "/reportedComments/" + currentPage).then(response => response.json()) 
    .then (data => {
      setReportList(data.comments);
    })
  }
  useEffect( () =>  {
    console.log(type); 
    if (type === "post") {
      handlePosts(); 
    }
    else if (type === "comment") {
      handleComment(); 
    }
  }, [])
  //
  return (
    <div className="reports-background">
      <div className="reports-container" >
        <div>
          <h1> Reports </h1>
          <div>
            <select onChange={onChangeSelect}>
              <option> Posts </option>
              <option> Comments </option>
            </select>
          </div>
          <div>
          <Reports reports={reportList} type={type}/>
          </div>
        </div>
      </div>
    </div>
  )
}