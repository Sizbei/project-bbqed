import React, {useState,  useEffect, useContext} from "react"
import ProfilePicture from './ProfilePicture'
import '../styling/PostView.css'
import {AuthContext} from '../Context/AuthContext';
/*
 {username: 'user4', comment: 'blah blah', acs: 23}, 
        {username: 'user2', comment: 'blah blah1', acs: 22}, 
        {username: 'user1', comment: 'blah blah2', acs: 3}, 
        */
export default function View(props) {
    const authContext = useContext(AuthContext);
    const path = ' /zone/display/' + authContext.user.username + '/' + props.location.pathname.slice(17, props.location.pathname.length);
    const [username, setUsername] = useState(''); 
    const [likes, setLikes] = useState(0); 
    const [acs, setAcs] = useState(0); 
    const [content, setContent] = useState(''); 
    const [agree, setAgree] = useState(false); 
    const [disagree, setDisagree] = useState(false); 
    const [comments, setComments] = useState([
       
    ]); 
    useEffect(() => {
      
        fetch(path).then(res => res.json())
        .then(data => {
          console.log("Data: " + data.posts.poster);
          setUsername(data.posts.poster); 
          //setAcs(data.posts.poster.acs); 
          setLikes(data.posts.likes); 
          setContent(data.posts.body); 
          setAgree(data.posts.upvoted); 
          setDisagree(data.posts.downvoted); 
          setComments(data.posts.comments); 
        })
        .catch((error) => {
          console.log(error); 
        })
        
      }, [])
    
    const handlePostAgree = async () => {

        setAgree(!agree);
    }
    const handlePostDisagree = () => { 

    }

    const handleCommentAgree = () => {

    }
    const handleCommentDisagree = () => { 

    }
  return (
  <div className="tzpv-background">
      <div className="tzpv-container">
        <div className="tzpv-post-container">
            <div className="tzpv-user-info">
                <ProfilePicture username = {username}/>
                <label> {username} ({acs})  </label>

            </div>
            <div className="tzpv-post-info"> 
            <p> {content} </p>
            </div>
        </div>
        <div className="tzpv-post-buttons"> 
            <button onClick={handlePostAgree} className={agree ? "tzpv-post-button-agree-selected" :"tzpv-post-button-agree" }>   Agree  </button>
            <button onClick={handlePostDisagree} className={disagree? "tzpv-post-button-disagree-selected" : "tzpv-post-button-disagree" }> Disagree </button>
        </div>
        <div className="tzpv-post-comment-container">
            <input type="text"/>
            <button> Post Comment </button> 
        </div>
        <div className="tzpv-comments-container"> 
            {comments.map(data => {
                return (
                    <div key={data.username} className="tzpv-comment-container">
                        <div className="tzpv-profile">
                            <label> {data.username} ({data.acs})</label>
                            <ProfilePicture scale={0.8} username={data.username}/>
                            <div>
                                <a> Agree </a>
                                <a> Disagree </a>
                            </div>      
                        </div>
                        {data.comment}

                    </div>
                )
            })}
        </div>
      </div>
  </div>
  )
}