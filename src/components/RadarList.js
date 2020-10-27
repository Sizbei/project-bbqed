import React, { Component, useEffect, useState, useContext } from 'react';
import '../styling/RadarList.css';  
import {AuthContext} from '../Context/AuthContext';


/*{pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user1",acs: 20},
      {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user2",acs: 21},
      {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user3",acs: 22},
      {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user4",acs: 23},
      {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user5",acs: 24},
      {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user6",acs: 25},
      {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user7",acs: 26},
      {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user8",acs: 27},
      {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user9",acs: 28},
      {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user10",acs: 90},
      {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user11",acs: 30},*/

function Pagination(props) {
  const pageNumbers = []; 
  for(let i = 1; i <= Math.ceil(props.totalPosts/props.postsPerPage); i++) {
      pageNumbers.push(i); 
  }
  
  return (
      <nav> 
          <ul className="radar-list-pagination"> 
              {pageNumbers.map(number => ( 
                <button onClick={()=>props.paginate(number)} className='radar-list-page-link'> 
                {number}
                </button>

              ))}
          </ul>
      </nav>
  )
}

function Posts(props){ 
if (props.loading) {
  return <h2> Loading... </h2>; 
}

return (
    <div className="radar-list-popup-table">  
      <table>
          <tbody>
          {props.posts.map(data => {
              return (
                  <tr>
                      <td><img className="radar-list-popup-img" src={data.profilePic}></img></td>
                      <td>{data.username}</td>
                      <td>{data.acs}</td>
                  </tr>
              )
          })} 
      
          </tbody>
        </table>   
    </div>
  )
}

export default function RadarList(props) {
const posts =  props.RadarList; 
const [loading] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const [postsPerPage] = useState(5); 

/*
useEffect(() => {
  const fetchPosts = async() => {
    setLoading(true); 
    fetch(auth + "/radarlist").then(res => res.json())
    .then(data => {
      setPosts(data.radarList)
    }) 
    setLoading(false); 
  }
  fetchPosts(); 
}, []);
*/
//Get current posts 
const indexOfLastPost = currentPage * postsPerPage; 
const indexOfFirstPost = indexOfLastPost - postsPerPage; 
console.log(posts); 
const currentPosts = posts; 

//change page 
const paginate = (pageNumber) => setCurrentPage(pageNumber); 
console.log(posts); 
return (
  <div className="radar-list-container">
      <h1 className="radar-list-h1"> Radar List </h1>
    
      <Posts posts={currentPosts} loading={loading} /> 
      <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}/>
  </div>
);
}