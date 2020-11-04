import React, { useEffect, useState, useContext } from 'react';
import '../styling/TheZone.css';
import PostPopup from './ProfilePostPopup';
import { AuthContext } from '../Context/AuthContext';
import ProfilePicture from './ProfilePicture'
import { Link } from 'react-router-dom';



export default function TheZone(props) {
    const authContext = useContext(AuthContext);
    const postId = props.location.pathname.slice(17, props.location.pathname.length);
    const path = ' /zone/display/' + authContext.user.username + '/' + postId;

    const [username, setUsername] = useState('');
    const [likes, setLikes] = useState(0);
    const [acs, setAcs] = useState(0);
    const [content, setContent] = useState('');
    const [agree, setAgree] = useState(false);
    const [disagree, setDisagree] = useState(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(path).then(res => res.json())
            .then(data => {
                setPosts(data.posts);
                setUsername(data.posts.poster.username);
                setAcs(data.posts.poster.acs);
                setLikes(data.posts.likes);
                setContent(data.posts.body);
                setAgree(data.posts.upvoted);
                setDisagree(data.posts.downvoted);
                
                
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

   
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
   
    

    const togglePostPopup = () => {

    }

    return (
        <div class="tzone-page">
            
            <div class= "tzone-all-posts"> 
                <div class="tzone-post-body">   
                    <input type="text" class="tzone-create-post" onClick={togglePostPopup} placeholder="Create Post"></input>

                </div>

                <h2> Posts ({posts.length})</h2>
                {posts.map((data, index) => {
                    return (
                        <div className="tzone-post-container">
                            <div className="tzone-user-info">
                                <ProfilePicture username={data.poster.username} />
                                <label> {data.poster.username} ({data.poster.acs})  </label>
                                <div className="tzone-likes"> <label> {data.likes} </label></div>
                            </div>
                            <div className="tzone-post-info">
                                
                                <Link to={"/theZone/display/" + (data._id)} className="tzone-link">
                                    <p> {data.body} </p>
                                </Link>
                            </div>
                            
                            
                            
                            
                            <div className="tzone-post-buttons">
                                <a onClick={() => handlePostAgree(data, index)} className={data.agree ? "tzone-post-button-agree-selected" : "tzone-post-button-agree"}> Agree </a>
                                <a onClick={() => handlePostDisagree(data, index)} className={data.disagree ? "tzone-post-button-disagree-selected" : "tzone-post-button-disagree"}> Disagree </a>
                            </div>
                            
                            
                        </div>
                    )
                })}
            
                   

            </div>

            
        </div>
    )
}

