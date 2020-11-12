import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../Context/AuthContext';
import Reports from './Reports'
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


export default function Report(props) { 
  const [reportList, setReportList] = useState([]); 
  const [currentPage, setCurrentPage] = useState(0);
  const authContext = useContext(AuthContext); 
  const [type, setType] = useState("comment"); 

  const onChangeSelect = (e) => {
    console.log(e.target.value);
    if (e.target.value === "Posts") { 
      setType("post"); 
      props.history.push('/reports/post');
      window.location.reload(); 
    }
    
  }
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    handleComment(); 

  } 


  const handleComment = () => { 
    fetch("/zone/display/" + authContext.user.username + "/reportedComments/" + currentPage).then(response => response.json()) 
    .then (data => {
      setReportList(data.comments);
    })
  }
  useEffect( () =>  {
      handleComment(); 
  }, [])
  //
  return (
    <div className="reports-background">
      <div className="reports-container" >
        <div>
          <h1> Reports </h1>
          <div className="reports-selection">
            <select value={"Comments"} onChange={onChangeSelect}>
              <option> Posts  </option>
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