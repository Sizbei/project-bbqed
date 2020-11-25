import React, { useEffect, useState, useContext } from 'react';
import '../styling/TheZone.css';
import PostPopup from './ProfilePostPopup';
import ReportPopup from './TheZoneReportPopup';
import Pagination from "@material-ui/lab/Pagination";
import { AuthContext } from '../Context/AuthContext';
import ProfilePicture from './ProfilePicture';
import { Link } from 'react-router-dom';



export default function TheZone(props) {
    const authContext = useContext(AuthContext);
    const postId = props.location.pathname.slice(17, props.location.pathname.length);
    const upath = '/zone/display/focused/';
    const spath = '/zone/display/';
    
    
    const [content, setContent] = useState('');
    const [agree, setAgree] = useState(false);
    const [disagree, setDisagree] = useState(false);
    const [rId, setRId] = useState('');
    const [reported, setReported] = useState(false);
    const [type, setType] = useState('');

    const [currentPage, setCurrentPage] = useState(1); 
    const [totalNumber, setTotalNumber] = useState(0); 
    const [posts, setPosts] = useState([]); 

    const [showPostPopup, setPostPopup] = useState(false);         
    const [showReportPopup, setReportPopup] = useState(false);       
   

    useEffect(() => {    
        handlePosts(currentPage - 1); 
    }, [currentPage])

    const togglePostPopup = () => {
       setPostPopup(!showPostPopup);
    }

    const handlePosts = async (page) => {
        await fetch(spath + page + '/likes').then(response => response.json())
            .then(data => {
                setPosts(data.posts);
                setContent(data.posts.body);
                setAgree(data.posts.upvoted);
                setDisagree(data.posts.downvoted);
                setPosts(data.posts);
                setTotalNumber(data.post_count);
                
            }).catch((error) => {
                console.log(error);
            })
       
    }

    const toggleReportPopup = (rId, type) => {
        setRId(rId);
        setType(type);
        
        setReportPopup(!showReportPopup);
    }

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    }

   
    const handlePostAgree = (data, index) => {

        const body = {
            post: data._id,
            username: authContext.user.username,
            upvoted: data.upvoted,
            downvoted: data.downvoted,
        }
        fetch('/zone/upvote', {
            method: "put",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(updatedData => {
                const updatedEntry = {
                    "_id": data._id,
                    "poster": {
                        "username": data.poster.username,
                        "image": data.poster.image,
                        "acs": data.poster.acs
                    },
                    "body": data.body,
                    "likes": updatedData.likes,
                    "upvoted": updatedData.upvoted,
                    "downvoted": updatedData.downvoted
                }
                const newPosts = [
                    ...posts.slice(0, index),
                    updatedEntry,
                    ...posts.slice(index + 1)
                ]
                setPosts(newPosts);
            })
            .catch((error) => {
                console.log(error);
            })

    }
    const handlePostDisagree = (data, index) => {
        const body = {
            post: data._id,
            username: authContext.user.username,
            upvoted: data.upvoted,
            downvoted: data.downvoted,
        }
        fetch('/zone/downvote', {
            method: "put",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            //axios.post('http://localhost:5000/post/add', body)
            .then(updatedData => {
                const updatedEntry = {
                    "_id": data._id,
                    "poster": {
                        "username": data.poster.username,
                        "image": data.poster.image,
                        "acs": data.poster.acs
                    },
                    "body": data.body,
                    "likes": updatedData.likes,
                    "upvoted": updatedData.upvoted,
                    "downvoted": updatedData.downvoted
                }
                const newPosts = [
                    ...posts.slice(0, index),
                    updatedEntry,
                    ...posts.slice(index + 1)
                ]
                setPosts(newPosts);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    
    return (
        <div class="tzone-page">
            
            <div class= "tzone-all-posts"> 
                {showPostPopup ? <PostPopup closePopup={togglePostPopup} />
                    : null
                }

                {showReportPopup ? <ReportPopup closePopup={toggleReportPopup} rId = {rId} type = {type} />
                    : null
                }

                <div class="tzone-post-body">
                    <button class="tzone-create-post-btn" onClick={togglePostPopup}>  {"What's on your mind, " + (authContext.user.username) + "?"}
                    </button>
                </div>

                <div className= "tzone-post-number"> Posts ({posts.length})</div>
                {posts.map((data, index) => {
                    return (
                        <div class="tzone-overall-container">
                            <div className="tzone-post-container">

                                <div className="tzone-user-info">
                                    <Link className="tzone-profile-pic">
                                    <ProfilePicture username={data.poster.username} />
                                    </Link>
                                   
                                    <label className="tzone-profile-link" >{data.poster.username} ({data.poster.acs})  
                                    </label>

                                    
                                    
                                    <div className="tzone-likes"> <label> {data.likes} </label></div>
                                    </div>

                                {data.reported ? <label className="tzone-reported"> Post Reported </label> : <button className="tzone-report-btn" onClick={() => toggleReportPopup( data._id, "post")} >{"Report Post"}</button>
                                   }
                               
                                    
                                    <div className="tzone-post-info">      
                                    <Link to={"/theZone/display/" + (data._id)} className="tzone-link">
                                        <p> {data.body} </p>
                                    </Link>

                                    </div> 
                                 </div>
                        <div className="tzone-post-buttons">
                                <a onClick={() => handlePostAgree(data, index)} className={data.agree ? "tzone-post-button-agree-selected" : "tzone-post-button-agree"}> Agree </a>
                                <a onClick={() => handlePostDisagree(data, index)} className={data.disagree ? "tzone-post-button-disagree-selected" : "tzone-post-button-disagree"}> Disagree </a>
                        </div>

                        </div>
                    )
                })}
                <Pagination className="MuiPagination-ul" color="primary" count={Math.ceil(totalNumber/ 10)} onChange={handlePageChange} />
            </div>
        </div>
    )
}


